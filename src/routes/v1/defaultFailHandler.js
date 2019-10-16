const debug = require('debug')(
    'appstore:server:routes:handlers:v1:defaultFailHandler'
)
const Boom = require('@hapi/boom')

module.exports = (request, h, err) => {
    if (err.isJoi) {
        //schema validation error
        debug('\n===J O I  V A L I D A T I O N  E R R O R===\n')
        debug(err)
        debug('\n===========================================\n')
        throw Boom.badImplementation(Boom.boomify(err))
    }

    debug(err)
    throw Boom.badImplementation(Boom.boomify(err))
}
