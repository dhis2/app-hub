const debug = require('debug')('appstore:server:boot:api')

const Blipp = require('blipp')
const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')

const HapiSwagger = require('hapi-swagger')
const Pino = require('hapi-pino')

const options = require('../options/index.js')

const staticFrontendRoutes = require('../plugins/staticFrontendRoutes')
const apiRoutes = require('../plugins/apiRoutes')

exports.init = async knex => {
    debug('Starting server...')

    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
        routes: {
            cors: {
                origin: ['*'],
                headers: ['Accept', 'Content-Type', 'authorization'],
                additionalHeaders: ['X-Requested-With'],
            },
            payload: {
                allow: 'application/json',
            },
        },
    })

    await server.register({
        plugin: require('hapi-api-version'),
        options: {
            validVersions: [1, 2],
            defaultVersion: 1,
            vendorName: 'dhis2-app-store-api',
            basePath: '/api/',
        },
    })

    //Swagger + deps to render swaggerui
    //served from the url /documentation
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: options.swaggerOptions,
        },
    ])

    if (process.env.NODE_ENV !== 'test') {
        await server.register(Blipp)
    }

    //Add pino, logging lib
    await server.register({
        plugin: Pino,
        options: {
            prettyPrint: process.env.NODE_ENV !== 'test',
            //redact: ['req.headers.authorization']
        },
    })

    await server.register({
        plugin: staticFrontendRoutes,
    })

    await server.register({
        plugin: apiRoutes,
        options: {
            knex,
        },
    })

    await server.start()

    debug(`Server running at: ${server.info.uri}`)

    return server
}
