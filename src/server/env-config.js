//This config is the default which is mostly read from env-vars which is supposed to be used in production and when running locally
//This is passed into the server init (init-server.js) so if we need to override any config values for testing different
//scenarios we could pass another config object from tests instead of relying of external env vars being set
const config = {
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
    },
    displayRoutesTable: process.env.NODE_ENV !== 'test',
    logging: {
        enabled: true,
        redactAuthorization: process.env.NODE_ENV !== 'test',
        level: process.env.NODE_ENV !== 'test' ? 'info' : 'error',
        prettyPrint: process.env.NODE_ENV !== 'test',
    },
    auth: {
        noAuthUserIdMapping: process.env.NO_AUTH_MAPPED_USER_ID,
        config: {
            strategy: process.env.AUTH_STRATEGY,
            secrets: [process.env.AUTH0_SECRET, process.env.AUTH0_M2M_SECRET],
            audience: process.env.AUTH0_AUDIENCE,
            issuer: process.env.AUTH0_DOMAIN,
            algorithms: [process.env.AUTH0_ALG],
        },
        useAuth0: () => {
            return (
                !config.auth.noAuthUserIdMapping && //if noAuth mapping is set it gets prioritized
                config.auth.config.strategy === 'jwt' &&
                config.auth.config.secrets.length > 0 &&
                config.auth.config.audience &&
                config.auth.config.issuer &&
                config.auth.config.algorithms
            )
        },
    },
}

exports.config = config
