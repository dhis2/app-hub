

const Boom = require('boom')
const Joi = require('joi')

const { deleteDir } = require('@utils')
const defaultFailHandler = require('../../defaultFailHandler')

const { canDeleteApp } = require('@security')
const getAppsByUuid = require('@data/getAppsByUuid')
const deleteApp = require('@data/deleteApp')

const { getCurrentAuthStrategy } = require('@security')

module.exports = {
    //authenticated endpoint returning all apps no matter which status they have
    method: 'DELETE',
    path: '/v1/apps/{appUuid}',
    config: {
        auth: getCurrentAuthStrategy(),
        tags: ['api', 'v1'],
        response: {
            status: {
                200: Joi.any(),
                500: Joi.any()
            },
            failAction: defaultFailHandler
        }
    },
    handler: async (request, h) => {


        //request.logger.info('In handler %s', request.path)

        if ( !canDeleteApp(request, h) ) {
            throw Boom.unauthorized();
        }
        //todo: validate

        const knex = h.context.db;

        const appUuid = request.params.appUuid

        const appRows = await getAppsByUuid(appUuid, 'en', knex)

        const item = appRows[0]

        try {
            await deleteDir(item.uuid)
            const result = await deleteApp(appUuid, knex)
            console.log(result)

            return { message: 'Successfully deleted app', httpStatus: 'OK', httpStatusCode: 200 }
        } catch ( err ) {
            return { message: 'An error occurred', httpStatus: 'Internal Server Error', httpStatusCode: 500 }
        }
    }
}
