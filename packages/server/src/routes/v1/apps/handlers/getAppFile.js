const Boom = require('boom')
const Joi = require('joi')

const { AppStatus } = require('../../../../enums')
const AppModel = require('../../../../models/v1/out/App')
const AWSFileHandler = require('../../../../utils/AWSFileHandler')

const defaultFailHandler = require('../../defaultFailHandler')

module.exports = {
    //unauthenticated endpoint returning the approved app for the specified uuid
    method: 'GET',
    path: '/v1/apps/download/{organisation_slug}/{appver_slug}/{app_version}/app.zip',
    config: {
        auth: false,
        tags: ['api', 'v1'],
    },
    handler: async (request, h) => {
        request.logger.info('In handler %s', request.path)

        const fileHandler = new AWSFileHandler(process.env.AWS_REGION,
                                               process.env.AWS_BUCKET_NAME)

        const { organisation_slug, appver_slug, app_version } = request.params

        const knex = h.context.db

        const appRows = await knex
                    .select()
                    .from('apps_view')
                    .where({
                        'organisation_slug': organisation_slug,
                        'appver_slug': appver_slug,
                        'version': app_version,
                        'status': AppStatus.APPROVED,
                        'language_code': 'en'
                    })

        const item = appRows[0]

        console.log(`Fetching file from ${item.uuid}/${item.version_uuid}`)
        const file =  await fileHandler.getFile(`${item.uuid}/${item.version_uuid}`, 'app.zip')


        return h.response(file.Body)
                .type('application/zip')
                .header('Content-length', file.ContentLength)
                
    }
}