const debug = require('debug')('apphub:server:boot:api')

const Blipp = require('blipp')
const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')

const HapiSwagger = require('hapi-swagger')
const Pino = require('hapi-pino')

const options = require('../options/index.js')

const staticFrontendRoutes = require('../plugins/staticFrontendRoutes')
const apiRoutes = require('../plugins/apiRoutes')

exports.init = async (knex, config) => {
    debug('Starting server...')

    const server = Hapi.server({
        port: config.server.port,
        host: config.server.host,
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

    server.bind({
        config,
    })

    await server.register({
        plugin: require('hapi-api-version'),
        options: {
            validVersions: [1, 2],
            defaultVersion: 1,
            vendorName: 'dhis2-app-hub-api',
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

    if (config.displayRoutesTable) {
        await server.register(Blipp)
    }

    //Add pino, logging lib
    if (config.logging.enabled) {
        await server.register({
            plugin: Pino,
            options: {
                prettyPrint: config.logging.prettyPrint,
                redact: config.logging.redactAuthorization
                    ? []
                    : ['req.headers.authorization'],
                level: config.logging.level,
            },
        })
    }

    await server.register({
        plugin: staticFrontendRoutes,
    })

    await server.register(
        {
            plugin: apiRoutes,
            options: {
                knex,
                auth: config.auth,
            },
        },
        {
            routes: {
                prefix: '/api',
            },
        }
    )

    await server.start()

    debug(`Server running at: ${server.info.uri}`)

    return server
}
