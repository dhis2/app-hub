const path = require('path')

const Blipp = require('blipp')
const Hapi = require('hapi')
const HapiSwagger = require('hapi-swagger')
const Inert = require('inert')
const Pino = require('hapi-pino')
const Vision = require('vision')

const jwt = require('hapi-auth-jwt2')

const routes = require('../routes/index.js')
const options = require('../options/index.js')
const registerAuth0 = require('../security/registerAuth0.js')

exports.init = async (knex) => {
    console.info('Starting server...')

    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
        routes: {
            cors: {
                origin: ['*'],
                headers: ['Accept', 'Content-Type'],
                additionalHeaders: ['X-Requested-With'],
            },
        },
    })

    server.bind({
        db: knex,
    })

    //Add pino, logging lib
    await server.register({
        plugin: Pino,
        options: {
            prettyPrint: process.env.NODE_ENV !== 'test',
            //redact: ['req.headers.authorization']
        },
    })

    //Swagger + deps to render swaggerui
    //served from the url /documentation
    await server.register([
        Inert,
        Vision,
        Blipp,
        {
            plugin: HapiSwagger,
            options: options.swaggerOptions,
        },
    ])

    if (
        process.env.AUTH_STRATEGY === 'jwt' &&
        process.env.AUTH0_SECRET &&
        process.env.AUTH0_M2M_SECRET &&
        process.env.AUTH0_AUDIENCE &&
        process.env.AUTH0_DOMAIN &&
        process.env.AUTH0_ALG
    ) {
        await server.register(jwt)

        registerAuth0(server, knex, {
            key: [process.env.AUTH0_SECRET, process.env.AUTH0_M2M_SECRET],
            verifyOptions: {
                audience: process.env.AUTH0_AUDIENCE,
                issuer: process.env.AUTH0_DOMAIN,
                algorithms: [process.env.AUTH0_ALG],
            },
        })
    } else {
        //Warn with red background
        console.warn(
            '\x1b[41m',
            'No authentication method configured, all endpoints are running unprotected',
            '\x1b[0m'
        )
        if (!process.env.NO_AUTH_MAPPED_USER_ID) {
            console.error(
                '\x1b[41m',
                'Running without authentication requires to setup mapping to a user to use for requests requiring a current user id (e.g. creating apps for example). Set process.env.NO_AUTH_MAPPED_USER_ID',
                '\x1b[m'
            )
            process.exit(1)
            return
        }
    }

    //Temporary route to serve frontend static build until we've flattened the project structure
    server.route([
        {
            method: 'GET',
            path: '/assets/{param*}',
            handler: {
                directory: {
                    path: path.join(__dirname, '../../static/assets/'),
                },
            },
        },
        {
            method: 'GET',
            path: '/js/{param*}',
            handler: {
                directory: {
                    path: path.join(__dirname, '../../static/js/'),
                },
            },
        },
        {
            method: 'GET',
            path: '/{param*}',
            handler: {
                file: path.join(__dirname, '../../static/index.html'),
            },
        },
    ])

    server.realm.modifiers.route.prefix = '/api'
    server.route(routes)

    await server.start()

    console.log(`Server running at: ${server.info.uri}`)

    return server
}
