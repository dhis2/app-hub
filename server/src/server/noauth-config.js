const config = {
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
    },
    displayRoutesTable: false,
    logging: {
        enabled: true,
        redactAuthorization: process.env.NODE_ENV !== 'test',
        level: 'info',
        prettyPrint: process.env.NODE_ENV !== 'test',
    },
    auth: {
        noAuthUserIdMapping: process.env.NO_AUTH_MAPPED_USER_ID,
        useAuth0: () => {
            return false
        },
    },
}

exports.config = config
