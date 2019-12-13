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
} = require('db-errors')

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
    // not error or joi-error, ignore
    if (!error.isBoom || error.isJoi) {
        return h.continue
    }
    throw mapError(error, this.options)
}

const mapError = (error, options) => {
    for (const key in dbErrorMap) {
        const httpError = dbErrorMap[key].find(e => error instanceof e)
        if (httpError) {
            return Boom[key](options.preserveMessage ? error.message : null)
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
