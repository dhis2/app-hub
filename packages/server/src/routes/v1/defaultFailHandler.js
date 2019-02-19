const Boom = require('boom')

module.exports = async function(request, h, err) {
    console.log("=================================================")
    //console.dir(err);
    if ( err.isJoi ) {  //schema validation error
        console.log("\n=================================================\n")
        request.logger.info(err.details)
        console.log("\n=================================================\n")
        request.logger.info(err.details.context)
        console.log("\n=================================================\n")
        throw Boom.badImplementation('Schema validation error')
    }
    throw Boom.badImplementation()
}