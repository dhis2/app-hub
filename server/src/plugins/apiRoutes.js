const jwt = require('hapi-auth-jwt2')

const debug = require('debug')('apphub:server:plugins:apiRoutes')

const createUserValidationFunc = require('../security/createUserValidationFunc')

const routes = require('../routes/index.js')

// This is needed to override staticFrontendRoutes's catch-all route
// so that 404s under /api is not redirected to index.html
const defaultNotFoundRoute = {
    method: 'GET',
    path: '/{p*}',
    handler: () => {
        return {
            statusCode: 404,
            error: 'Not Found',
            message: 'Not Found',
        }
    },
}

const apiRoutesPlugin = {
    name: 'DHIS2 App Hub Backend',
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

            server.auth.strategy('token', 'jwt', {
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

            //Map required authentication to no-auth
            server.auth.strategy('token', 'no-auth')

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
                throw new Error(
                    'No auth set up. Set process.env.NO_AUTH_MAPPED_USER_ID to a valid user ID.'
                )
            }
        }

        server.route([...routes, defaultNotFoundRoute])
    },
}

module.exports = apiRoutesPlugin
