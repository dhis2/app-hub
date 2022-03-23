const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const Schmervice = require('@hapipal/schmervice')
const Blipp = require('blipp')
const debug = require('debug')('apphub:server:boot:api')
const Pino = require('hapi-pino')
const HapiSentry = require('hapi-sentry')
const HapiSwagger = require('hapi-swagger')
const options = require('../options/index.js')
const apiRoutes = require('../plugins/apiRoutes')
const errorMapper = require('../plugins/errorMapper')
const pagination = require('../plugins/pagination')
const queryFilter = require('../plugins/queryFilter')
const staticFrontendRoutes = require('../plugins/staticFrontendRoutes')
const { getUserDecoration } = require('../security')
const { createAppVersionService } = require('../services/appVersion')
const { createEmailService } = require('../services/EmailService')

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
            validate: {
                failAction:
                    process.env.NODE_ENV !== 'production'
                        ? (request, h, err) => {
                              throw err
                          }
                        : undefined,
            },
        },
    })

    server.bind({
        config,
        db: knex,
    })

    if (config.sentry.dsn) {
        debug('Starting Hapi-Sentry')
        const { dsn, environment } = config.sentry
        await server.register({
            plugin: HapiSentry,
            options: {
                client: {
                    dsn,
                    environment,
                },
            },
        })
    }

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

    await server.register(Schmervice)

    await server.registerService(createEmailService)
    await server.registerService(createAppVersionService)

    await server.register({
        plugin: staticFrontendRoutes,
    })

    await server.register({
        plugin: errorMapper,
        options: {
            preserveMessage: process.env.NODE_ENV === 'development',
        },
    })

    await server.register(
        {
            plugin: apiRoutes,
            options: {
                knex,
                auth: config.auth,
                config,
            },
        },
        {
            routes: {
                prefix: '/api',
            },
        }
    )

    await server.register({
        plugin: queryFilter,
    })

    await server.register({
        plugin: pagination,
    })

    server.decorate('request', 'getUser', getUserDecoration)
    await server.start()

    debug(`Server running at: ${server.info.uri}`)

    return server
}
