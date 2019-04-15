
const { createUserValidationFunc } = require('@security')

const registerAuth0 = (server, opts) => {

    server.auth.strategy('jwt', 'jwt', {
        ...opts, 
        complete: true,
        validate: createUserValidationFunc(server.db, opts.verifyOptions.audience)
    })
}

module.exports = registerAuth0
