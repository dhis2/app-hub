const Boom = require('boom')

module.exports = (request, h, err) => {
    if (err.isJoi) {
        //schema validation error
        console.log('\n===J O I  V A L I D A T I O N  E R R O R===\n')
        console.dir(err)
        console.log('\n===========================================\n')
        throw Boom.badImplementation(Boom.boomify(err))
    }

    console.dir(err)
    throw Boom.badImplementation(Boom.boomify(err))
}
