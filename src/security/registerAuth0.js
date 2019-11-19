const {
    createUserValidationFunc,
} = require('../security/createUserValidationFunc')

const registerAuth0 = (server, db, opts) => {
    server.auth.strategy('required', 'jwt', {
        ...opts,
        complete: true,
        validate: createUserValidationFunc(db, opts.verifyOptions.audience),
    })
}

module.exports = registerAuth0
