module.exports = async function(request, h, err) {
    console.log("=================================================")
    console.dir(err);
    if ( err.isJoi ) {  //schema validation error
        throw Boom.badImplementation('Schema validation error:' + JSON.stringify(err.details))
    }
    throw Boom.badImplementation()
}