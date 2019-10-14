const debug = require('debug')('appstore:server:routes:handlers:v1:getAllApps')
const Boom = require('boom')
const Joi = require('@hapi/joi')

const { getFile } = require('../../../../utils')

const defaultFailHandler = require('../../defaultFailHandler')

module.exports = {
    //unauthenticated endpoint returning the icon for an app with the specified uuid
    method: 'GET',
    path: '/v1/apps/media/{organisation_slug}/{version_uuid}/{filename}',
    config: {
        auth: false,
        tags: ['api', 'v1'],
        response: {
            failAction: defaultFailHandler,
        },
    },
    handler: async (request, h) => {
        //request.logger.info('In handler %s', request.path)

        const { organisation_slug, version_uuid, filename } = request.params

        const knex = h.context.db

        const appversions = await knex
            .select()
            .from('apps_view')
            .where({
                organisation_slug,
                version_uuid,
            })

        const [item] = appversions

        const [media] = await knex
            .select()
            .from('app_version_media')
            .innerJoin('media_type', 'media_type_id', 'media_type.id')
            .where('app_version_media.id', item.media_id)

        //TODO: improve by streaming instead of first downloading then responding with the zip?
        //or pass out the aws url directly
        debug(`Fetching file ${item.uuid}/${item.version_uuid}/${filename}`)

        try {
            const file = await getFile(
                `${item.uuid}/${item.version_uuid}`,
                filename
            )

            if (file && file.Body) {
                return h
                    .response(file.Body)
                    .type(media.mime)
                    .header('Content-length', file.ContentLength)
            }

            return Boom.internal(
                `Was not able to fetch file: ${item.uuid}/${item.version_uuid}/${filename}`
            )
        } catch (err) {
            //AWS S3 error code if object is missing
            if (err.code === 'NoSuchKey') {
                //The file does not exist in the file storage
                return Boom.notFound()
            }
        }

        return Boom.notFound()
    },
}
