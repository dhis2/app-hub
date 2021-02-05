const Boom = require('@hapi/boom')
const Joi = require('@hapi/joi')

const queryParamsSchema = Joi.object({
    page: Joi.number()
        .default(1)
        .min(1),
    pageSize: Joi.number()
        .default(25)
        .min(1),
})

function paginate(key, data) {
    try {
        const { page, pageSize } = Joi.attempt(
            this.request.query,
            queryParamsSchema,
            {
                stripUnknown: true,
            }
        )
        const startIndex = (page - 1) * pageSize
        const endIndex = startIndex + pageSize
        const total = data.length

        return this.response({
            [key]: data.slice(startIndex, endIndex),
            pager: {
                page,
                pageCount: Math.ceil(total / pageSize),
                pageSize,
                total,
            },
        })
    } catch (e) {
        throw Boom.boomify(e, { statusCode: 400 })
    }
}

module.exports = {
    name: 'PaginatePlugin',
    register: server => {
        server.decorate('toolkit', 'paginate', paginate)
    },
}
