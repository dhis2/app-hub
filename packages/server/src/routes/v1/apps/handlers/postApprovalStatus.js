const Boom = require('boom')
const Joi = require('joi')

const AppModel = require('../../../../models/v1/out/App')
const defaultFailHandler = require('../../defaultFailHandler')
const { getAllAppsByLanguage } = require('../data')
const { convertAppsToApiV1Format } = require('../formatting')

const { canChangeAppStatus } = require('../../../../security')

module.exports = {
    //authenticated endpoint returning all apps no matter which status they have
    method: 'POST',
    path: '/v1/apps/{app_uuid}/approval',
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

        if ( !canChangeAppStatus(request, h) ) {
            throw Boom.unauthorized();
        }

        const { status } = request.query
        //todo: validate
        //todo: auth/permission
        if ( !status ) {
            return Boom.badRequest()
        }

        const knex = h.context.db;


        const row = await knex.select(['app.id', 'name'])
                    .from('app')
                    .innerJoin('app_version', {'app.id': 'app_version.app_id'})
                    .innerJoin('app_version_localised', {'app_version_localised.app_version_id': 'app_version.id'})
                    .where({'app.uuid': request.params.app_uuid, 'language_code': 'en'})

        //{"message":"Status changed for app: WHO Data Quality Tool","httpStatus":"OK","httpStatusCode":200}
        console.log(row)
        if ( row.length > 0 ) {
            const updated = await knex('app_status')
                .where({'app_id': row[0].id})
                .update({'status': status})

            console.log(updated)

            return {
                'message': `Status changed for app: ${row[0].name}`, 'httpStatus': 'OK', 'httpStatusCode': 200
            }
        }

        return Boom.badImplementation()
    }
}