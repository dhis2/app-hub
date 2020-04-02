const debug = require('debug')('apphub:server:routes:handlers:v1:getAppMedia')
const Boom = require('@hapi/boom')

const { getFile } = require('../../../../utils')
const { getAppMedia } = require('../../../../data')

const defaultFailHandler = require('../../defaultFailHandler')

module.exports = {
    //unauthenticated endpoint returning the icon for an app with the specified uuid
    method: 'GET',
    path: '/v1/apps/media/{organisation_slug}/{app_id}/{app_media_id}',
    config: {
        auth: false,
        tags: ['api', 'v1'],
        response: {
            failAction: defaultFailHandler,
        },
    },
    handler: async (request, h) => {
        //request.logger.info('In handler %s', request.path)

        // eslint-disable-next-line no-unused-vars
        const { organisation_slug, app_id, app_media_id } = request.params

        const knex = h.context.db

        const appMedia = await getAppMedia(app_media_id, knex)

        //TODO: improve by streaming instead of first downloading then responding with the zip?
        //or pass out the aws url directly
        debug(`Fetching appid/app_media_id ${app_id}/${app_media_id}`)

        try {
            const file = await getFile(app_id, app_media_id)
            debug('got file:', file)

            if (file && file.Body) {
                return h
                    .response(file.Body)
                    .type(appMedia.mime)
                    .header('Content-length', file.ContentLength)
            }

            return Boom.internal(
                `Was not able to fetch file: ${app_id}/${appMedia.media_id}`
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
