

const Knex = require('knex')
const Hapi = require('hapi')
const Pino = require('hapi-pino')

const jwt = require('hapi-auth-jwt2');

const Inert = require('inert');
const Vision = require('vision');
const Blipp = require('blipp')

const HapiSwagger = require('hapi-swagger');

const routes = require('./routes')

const config = require('dotenv').config({ path: `${require('os').homedir()}/.dhis2/appstore/vars` })
const knexConfig = require('../knexfile')

console.log('Using env: ', process.env.NODE_ENV)
console.log('Injecting config vars into process.env: ', config)

// server things before start
const db = new Knex(knexConfig[process.env.NODE_ENV])
console.log(knexConfig[process.env.NODE_ENV])

const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: 'localhost',
    routes: {
        cors: {
            //TODO: load the URLs from database or something, so we can dynamically manage these
            origin: ['http://localhost:9000']
        }
    }
})

server.bind({
    db
})

// kick it
const init = async () => {

    //Add pino, logging lib
    await server.register({
        plugin: Pino,
        options: {
            prettyPrint:  process.env.NODE_ENV !== 'test',
            redact: ['req.headers.authorization']
        }
    })

    //Swagger + deps to render swaggerui
    //served from the url /documentation
    await server.register([
        Inert,
        Vision,
        Blipp,
        {
            plugin: HapiSwagger,
            options: require('./options').swaggerOptions
        }
    ])


    await server.register(jwt)

    if ( process.env.auth_strategy === 'jwt'
        && process.env.AUTH0_SECRET
        && process.env.AUTH0_M2M_SECRET
        && process.env.AUTH0_AUDIENCE
        && process.env.AUTH0_DOMAIN
        && process.env.AUTH0_ALG ) {

        const registerAuth0Provider = require('@security/auth0')

        registerAuth0Provider(server, {
            keys: [process.env.AUTH0_SECRET, process.env.AUTH0_M2M_SECRET],
            verifyOptions: {
                audience: process.env.AUTH0_AUDIENCE,
                issuer: process.env.AUTH0_DOMAIN,
                algorithms: [process.env.AUTH0_ALG]
            }
        })
    } else {
        //Warn with red background
        console.warn('\x1b[41m', 'No authentication method configured, all endpoints are running unprotected', '\x1b[0m')

        if ( !process.env.no_auth_mapped_user_id ) {
            console.error('\x1b[41m', 'Running without authentication requires to setup mapping to a user to use for requests requiring a current user id (e.g. creating apps for example). Set process.env.NO_AUTH_MAPPED_USER_ID', '\x1b[m')
            process.exit(1)
            return
        }
    }


    server.route(routes)

    await server.start()

    console.log(`Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {

    console.log(err)
    process.exit(1)
})

init()


module.exports = { server, db }
