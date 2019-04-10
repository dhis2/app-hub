
const { createUserValidationFunc } = require('@security')

module.exports = (server, opts) => {

    server.auth.strategy('jwt', 'jwt', {
        ...opts, 
        complete: true,
        validate: createUserValidationFunc(db, opts.verifyOptions.audience)
    })
}
