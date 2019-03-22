

const Boom = require('boom')
const Joi = require('joi')
const path = require('path')

const AWSFileHandler = require('@utils/AWSFileHandler')

const defaultFailHandler = require('../../defaultFailHandler')

module.exports = {
    //unauthenticated endpoint returning the icon for an app with the specified uuid
    method: 'GET',
    path: '/v1/apps/media/{organisation_slug}/{appver_slug}/{app_version}/{filename}',
    config: {
        auth: false,
        tags: ['api', 'v1'],
        response: {
            failAction: defaultFailHandler
        }
    },
    handler: async (request, h) => {

        request.logger.info('In handler %s', request.path)

        const { organisation_slug, appver_slug, app_version, filename } = request.params

        const knex = h.context.db

        const [item] = await knex
            .select()
            .from('apps_view')
            .where({
                organisation_slug,
                appver_slug,
                'version': app_version
            })

        console.log(item)

        const [media] = await knex
            .select()
            .from('app_version_media')
            .innerJoin('media_type', 'media_type_id', 'media_type.id')
            .where('app_version_media.id', item.media_id)

        console.log(media)

        console.log(`${item.uuid}/${item.version_uuid}/${filename}`)

        //TODO: improve by streaming instead of first downloading then responding with the zip?
        //or pass out the aws url directly
        console.log(`Fetching file from ${item.uuid}/${item.version_uuid}`)
        const fileHandler = new AWSFileHandler(process.env.AWS_REGION, process.env.AWS_BUCKET_NAME)
        const file =  await fileHandler.getFile(`${item.uuid}/${item.version_uuid}`, filename)

        return h.response(file.Body)
            .type(media.mime)
            .header('Content-length', file.ContentLength)
    }
}
