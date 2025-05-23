const Boom = require('@hapi/boom')
const Joi = require('joi')

const defaultFailHandler = require('../../defaultFailHandler')
const { canChangeAppStatus } = require('../../../../security')

module.exports = {
    //authenticated endpoint returning all apps no matter which status they have
    method: 'POST',
    path: '/v1/apps/{appId}/approval',
    config: {
        auth: 'token',
        tags: ['api', 'v1'],
        response: {
            status: {
                200: Joi.any(),
                500: Joi.any(),
            },
            failAction: defaultFailHandler,
        },
    },
    handler: async (request, h) => {
        //request.logger.info('In handler %s', request.path)

        if (!canChangeAppStatus(request, h)) {
            throw Boom.forbidden()
        }

        const { status } = request.query
        //todo: validate
        //todo: auth/permission
        if (!status) {
            return Boom.badRequest()
        }

        const knex = h.context.db

        const row = await knex
            .select(['app.id', 'name'])
            .from('app')
            .innerJoin('app_version', { 'app.id': 'app_version.app_id' })
            .innerJoin('app_version_localised', {
                'app_version_localised.app_version_id': 'app_version.id',
            })
            .where({ 'app.id': request.params.appId, language_code: 'en' })

        if (row.length > 0) {
            const updated = await knex('app_status')
                .where({ app_id: row[0].id })
                .update({ status })

            return {
                message: `Status changed for app: ${row[0].name}`,
                httpStatus: 'OK',
                httpStatusCode: 200,
            }
        }

        return Boom.badImplementation()
    },
}
