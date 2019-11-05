const jwt = require('hapi-auth-jwt2')

const debug = require('debug')('appstore:server:plugins:apiRoutes')

const registerAuth0 = require('../security/registerAuth0.js')

const routes = require('../routes/index.js')

const apiRoutesPlugin = {
    name: 'DHIS2 App Bazaar Backend',
    register: async (server, options) => {
        const { knex } = options

        server.bind({
            db: knex,
        })

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
            debug(
                '\x1b[41m',
                'No authentication method configured, all endpoints are running unprotected',
                '\x1b[0m'
            )
            if (!process.env.NO_AUTH_MAPPED_USER_ID) {
                debug(
                    '\x1b[41m',
                    'Running without authentication requires to setup mapping to a user to use for requests requiring a current user id (e.g. creating apps for example). Set process.env.NO_AUTH_MAPPED_USER_ID',
                    '\x1b[m'
                )
                process.exit(1)
                return
            }
        }

        server.realm.modifiers.route.prefix = '/api'
        server.route(routes)
    },
}

module.exports = apiRoutesPlugin
