'use strict'

const Knex = require('knex')
const Hapi = require('hapi')
const Pino = require('hapi-pino')

//const jwt = require('hapi-auth-jwt2');
//const jwksRsa = require('jwks-rsa');

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
            prettyPrint:  true, //process.env.NODE_ENV !== 'production',
            redact: ['req.headers.authorization']
        }
    })

    //Swagger + deps to render swaggerui
    await server.register([
        Inert,
        Vision,
        Blipp,
        {
            plugin: HapiSwagger,
            options: require('./options').swaggerOptions
        }
    ])


    //TODO: add auth
    //await server.register(jwt)
    /* server.auth.strategy('jwt', 'jwt', 'required', {
        // verify the Access Token against the
        // remote Auth0 JWKS
        key: process.env.auth0_secret,
        verifyOptions: {
            audience: process.env.auth0_audience, //TODO: move to config/env var
            issuer: process.env.auth0_domain, //TODO: move to config/env var
            algorithms: [process.env.auth0_alg]
        },
        validate: validateUser
    })*/


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
