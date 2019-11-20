const jwt = require('hapi-auth-jwt2')

const debug = require('debug')('appstore:server:plugins:apiRoutes')

const createUserValidationFunc = require('../security/createUserValidationFunc')

const routes = require('../routes/index.js')

const apiRoutesPlugin = {
    name: 'DHIS2 App Bazaar Backend',
    register: async (server, options) => {
        const { knex, auth } = options

        server.bind({
            db: knex,
        })

        if (auth && auth.useAuth0()) {
            await server.register(jwt)

            const authConfig = {
                key: auth.config.secrets,
                verifyOptions: {
                    audience: auth.config.audience,
                    issuer: auth.config.issuer,
                    algorithms: auth.config.algorithms,
                },
            }

            server.auth.strategy('optional', 'jwt', {
                ...authConfig,
                mode: 'optional',
                complete: true,
                validate: createUserValidationFunc(
                    knex,
                    authConfig.verifyOptions.audience
                ),
            })

            server.auth.strategy('required', 'jwt', {
                ...authConfig,
                complete: true,
                validate: createUserValidationFunc(
                    knex,
                    authConfig.verifyOptions.audience
                ),
            })
        } else {
            server.auth.scheme('no-auth', (server, options) => ({
                authenticate: async (request, reply) => {
                    const user = await knex('users')
                        .where('id', auth.noAuthUserIdMapping)
                        .first()
                    return reply.authenticated({
                        credentials: {
                            ...user,
                            userId: user.id,
                            roles: ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_MANAGER'],
                        },
                    })
                },
            }))

            const noAuthCredentialsResponse = server.auth.strategy(
                'optional',
                'no-auth',
                { mode: 'optional' }
            )

            server.auth.strategy('required', 'no-auth')
            //Warn with red background
            debug(
                '\x1b[41m',
                'No authentication method configured, all endpoints are running unprotected',
                '\x1b[0m'
            )
            if (!auth.noAuthUserIdMapping) {
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
