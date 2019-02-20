const Boom = require('boom')
const Joi = require('joi')

const defaultFailHandler = require('../../defaultFailHandler')

const { canDeleteApp } = require('../../../../security')


module.exports = {
    //authenticated endpoint returning all apps no matter which status they have
    method: 'DELETE',
    path: '/v1/apps/{app_uuid}',
    config: {
        //TODO: add auth
        //auth: 'jwt',
        tags: ['api', 'v1'],
        response: {
            status: {
                200: Joi.any(),
                500: Joi.any()
            },
            failAction: defaultFailHandler
        },
    },
    handler: async (request, h) => {
        request.logger.info('In handler %s', request.path)

        if ( !canDeleteApp(request, h) ) {
            throw Boom.unauthorized();
        }
        //todo: validate
        //todo: auth/permission

        const knex = h.context.db;

        const result = await knex('app').where('uuid', request.params.app_uuid).del()

        //TODO: delete files

        //{"message":"Status changed for app: WHO Data Quality Tool","httpStatus":"OK","httpStatusCode":200}
        console.log(result)

        return {message: 'Successfully deleted app', httpStatus: 'OK', httpStatusCode: 200}
    }
}