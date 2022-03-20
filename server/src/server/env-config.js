const debug = require('debug')('apphub:server:env-config:')

const getRequiredEnv = envVar => {
    const value = process.env[envVar]
    if (!value && process.env.NODE_ENV === 'production') {
        throw new Error(`Expected env ${envVar} to be present.`)
    } else if (!value) {
        debug(`Env ${envVar} not set. This is required for production.`)
    }
    return value
}

//This config is the default which is mostly read from env-vars which is supposed to be used in production and when running locally
//This is passed into the server init (init-server.js) so if we need to override any config values for testing different
//scenarios we could pass another config object from tests instead of relying of external env vars being set
const config = {
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
        jwtSecret: getRequiredEnv('INTERNAL_JWT_SECRET'),
    },
    displayRoutesTable: process.env.NODE_ENV !== 'test',
    logging: {
        enabled: true,
        redactAuthorization: process.env.NODE_ENV !== 'test',
        level: process.env.NODE_ENV !== 'test' ? 'info' : 'error',
        prettyPrint: process.env.NODE_ENV !== 'test',
    },
    aws: {
        region: process.env.AWS_REGION || 'eu-west-1',
    },
    sentry: {
        dsn: process.env.SENTRY_DSN,
    },
    auth: {
        noAuthUserIdMapping: process.env.NO_AUTH_MAPPED_USER_ID,
        config: {
            strategy: getRequiredEnv('AUTH_STRATEGY'),
            audience: getRequiredEnv('AUTH0_AUDIENCE'),
            domain: getRequiredEnv('AUTH0_DOMAIN'),
            issuer: getRequiredEnv('AUTH0_ISSUER'),
            algorithms: [process.env.AUTH0_ALGO || 'RS256'],
            jwksUri: getRequiredEnv('AUTH0_JWKS_URI'),
            managementClientId: getRequiredEnv('AUTH0_MANAGEMENT_CLIENT_ID'),
            managementAudience: getRequiredEnv('AUTH0_MANAGEMENT_AUDIENCE'),
            managementSecret: getRequiredEnv('AUTH0_MANAGEMENT_SECRET'),
        },
        useAuth0: () => {
            return (
                config.auth.config.strategy === 'jwt' &&
                config.auth.config.audience &&
                config.auth.config.domain &&
                config.auth.config.issuer &&
                config.auth.config.jwksUri &&
                config.auth.config.managementClientId &&
                config.auth.config.managementAudience &&
                config.auth.config.managementSecret
            )
        },
    },
}

exports.config = config
