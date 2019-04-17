
const { createUserValidationFunc } = require('@security')

const registerAuth0 = (server, db, opts) => {

    server.auth.strategy('jwt', 'jwt', {
        ...opts, 
        complete: true,
        validate: createUserValidationFunc(db, opts.verifyOptions.audience)
    })
}

module.exports = registerAuth0
