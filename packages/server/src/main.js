

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

const validateUser = async (decoded, request) => {

    console.log('ValidateUser')
    if (decoded && decoded.sub) {
        console.log('Valid user')
        //TODO: check that it exists
        return { isValid: true }
    }

    console.log('Invalid user')
    return { isValid: false }
};


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

    server.auth.strategy('jwt', 'jwt', {
        complete: true,
        key: process.env.auth0_secret,
        verifyOptions: {
            audience: process.env.auth0_audience,
            issuer: process.env.auth0_domain,
            algorithms: [process.env.auth0_alg]
        },
        validate: validateUser
    })


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
