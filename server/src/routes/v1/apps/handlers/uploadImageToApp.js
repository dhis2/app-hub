const debug = require('debug')(
    'apphub:server:routes:handlers:v1:uploadImageToApp'
)

const { MediaType } = require('../../../../enums')
const { saveFile } = require('../../../../utils')

const {
    getCurrentUserFromRequest,
    currentUserIsManager,
} = require('../../../../security')
const { addAppMedia, getOrganisationAppsByUserId } = require('../../../../data')
const { validateImageMetadata } = require('../../../../utils/validateMime')

module.exports = {
    method: 'POST',
    path: '/v1/apps/{appId}/images',
    config: {
        auth: 'token',
        tags: ['api', 'v1'],
        payload: {
            maxBytes: 20 * 1024 * 1024, //20MB
            allow: 'multipart/form-data',
            parse: true,
            output: 'stream',
            multipart: true,
        },
        plugins: {
            'hapi-swagger': {
                payloadType: 'form',
            },
        },
        response: {
            status: {
                //TODO: add response statuses
            },
        },
    },
    handler: async (request, h) => {
        request.logger.info('In handler %s', request.path)

        const knex = h.context.db
        const appId = request.params.appId

        const currentUser = await getCurrentUserFromRequest(request, knex)
        const isManager = currentUserIsManager(request)

        const userApps = await getOrganisationAppsByUserId(currentUser.id, knex)
        const canUploadMedia =
            isManager || userApps.map(app => app.app_id).indexOf(appId) !== -1

        debug('isManager:', isManager)
        debug('canUploadMedia:', canUploadMedia)

        if (!canUploadMedia) {
            return h
                .response({ message: `You don't have access to edit that app` })
                .code(401)
        }

        const imageFile = request.payload.file
        const imageFileMetadata = imageFile.hapi
        validateImageMetadata(request.server.mime, imageFileMetadata)

        const trx = await knex.transaction()

        let imageId = null

        const { id } = await addAppMedia(
            {
                userId: currentUser.id,
                appId: appId,
                mediaType: MediaType.Screenshot,
                fileName: imageFileMetadata.filename,
                mime: imageFileMetadata.headers['content-type'],
            },
            trx
        )
        imageId = id

        await saveFile(appId, id, imageFile._data)

        await trx.commit()

        return {
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'Image uploaded',
            id: imageId,
        }
    },
}
