const Knex = require('knex')
const Hapi = require('hapi')
const Pino = require('hapi-pino')
const Boom = require('boom')
const HapiApiVersion = require('hapi-api-version')

const { routes } = require('./routes')

const db = Knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'appstore',
        password: 'appstore123',
        database: 'appstore',
    },
})

// server things before start

const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
        cors: {
             //TODO: load the URLs from database or something, so we can dynamically manage these
            origin: ['http://localhost:9000']  
        }
    }
})

server.bind({
    db,
})

server.route(routes)

// kick it

const init = async () => {
    await server.register({
        plugin: Pino,
        options: {
            prettyPrint: true,
            logEvents: ['response', 'onPostStart'],
        },        
    })

    await server.register({
        plugin: HapiApiVersion,
        options: {
            validVersions: [1, 2],
            defaultVersion: 1,
            vendorName: 'dhis2Appstore'
        }
    })

    await server.start()

    console.log(`Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', err => {
    console.log(err)
    process.exit(1)
})

init()
