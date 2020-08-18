const { NotFoundError } = require('../utils/errors')
const Boom = require('@hapi/boom')
const {
    UniqueViolationError,
    ForeignKeyViolationError,
    NotNullViolationError,
    CheckViolationError,
    DBError,
    DataError,
    ConstraintViolationError,
    wrapError,
} = require('db-errors')

/**
 * A plugin that parses database-errors thrown in handlers and maps them to the correct boom-error.
 * This means that in many cases we do not need to handle or catch db-query errors
 * unless we need to do something else with the error.
 */

const dbErrorMap = {
    badRequest: [
        CheckViolationError,
        ConstraintViolationError,
        DataError,
        ForeignKeyViolationError,
        NotNullViolationError,
    ],
    conflict: [UniqueViolationError],
    notFound: [NotFoundError],
    internal: [DBError],
}

const onPreResponseHandler = function(request, h) {
    const { response: error } = request
    // not error or joi-error - ignore
    // Map Joi-errors to 400 bad-request errors

    if (error.isJoi) {
        return Boom.badRequest(error)
    }
    if (!error.isBoom) {
        return h.continue
    }
    throw mapError(error, this.options)
}

const mapError = (error, options) => {
    const wrappedError = wrapError(error)
    for (const key in dbErrorMap) {
        const httpError = dbErrorMap[key].find(
            e => wrappedError.constructor.name === e.name
        )
        if (httpError) {
            const boomError = Boom[key](
                options.preserveMessage ? error.message : null
            )
            if (options.preserveMessage) {
                // Needed to show 500-errors
                boomError.reformat(true)
            }
            return boomError
        }
    }
    return error
}

const defaultOptions = {
    preserveMessage: false,
}

const errorPlugin = {
    name: 'ErrorPlugin',
    register: async (server, options = defaultOptions) => {
        server.bind({
            options,
        })
        server.ext('onPreResponse', onPreResponseHandler)
    },
}

module.exports = errorPlugin
