const jwt = require('hapi-auth-jwt2')

const Auth0ManagementClient = require('auth0').ManagementClient

const debug = require('debug')('apphub:server:plugins:apiRoutes')

const { createUserValidationFunc, ROLES } = require('../security')
const routes = require('../routes/index.js')

const jwksRsa = require('jwks-rsa')

// This is needed to override staticFrontendRoutes's catch-all route
// so that 404s under /api is not redirected to index.html
const defaultNotFoundRoute = {
    method: 'GET',
    path: '/{p*}',
    handler: (request, h) => {
        return h
            .response({
                statusCode: 404,
                error: 'Not Found',
                message: 'Not Found',
            })
            .code(404)
    },
}

const apiRoutesPlugin = {
    name: 'DHIS2 App Hub Backend',
    register: async (server, options) => {
        const { knex, auth } = options

        const bindContext = {
            db: knex,
        }

        if (auth && auth.useAuth0()) {
            // Client used for Auth0 Management API to get new user-information from Auth0
            const auth0ManagementClient = new Auth0ManagementClient({
                domain: auth.config.domain,
                clientId: auth.config.managementClientId,
                clientSecret: auth.config.managementSecret,
                scope: 'read:users',
            })
            bindContext.auth0ManagementClient = auth0ManagementClient

            await server.register(jwt)
            const authConfig = {
                key: jwksRsa.hapiJwt2KeyAsync({
                    cache: true,
                    rateLimit: true,
                    jwksRequestsPerMinute: 5,
                    jwksUri: auth.config.jwksUri,
                }),
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
                    authConfig.verifyOptions.audience,
                    auth0ManagementClient
                ),
            })
        } else {
            // eslint-disable-next-line no-unused-vars
            server.auth.scheme('no-auth', (server, options) => ({
                authenticate: async (request, reply) => {
                    const user = await knex('users')
                        .where('id', auth.noAuthUserIdMapping)
                        .first()
                    return reply.authenticated({
                        credentials: {
                            ...user,
                            userId: user.id,
                            roles: [ROLES.MANAGER],
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

        server.bind(bindContext)

        server.route([...routes, defaultNotFoundRoute])
    },
}

module.exports = apiRoutesPlugin
