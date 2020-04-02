const { MediaType } = require('../../../../enums')
const { saveFile } = require('../../../../utils')

const {
    getCurrentUserFromRequest,
    currentUserIsManager,
} = require('../../../../security')

const { addAppMedia, getAppDeveloperId } = require('../../../../data')

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

        const currentUser = await getCurrentUserFromRequest(request, knex)
        const appDeveloperId = await getAppDeveloperId(
            request.params.appId,
            knex
        )

        if (
            !currentUserIsManager(request) &&
            appDeveloperId !== currentUser.id
        ) {
            return h
                .response({ message: `You don't have access to edit that app` })
                .code(401)
        }

        const imageFile = request.payload.file
        const imageFileMetadata = imageFile.hapi

        const trx = await knex.transaction()

        let imageId = null

        const appId = request.params.appId

        const { id } = await addAppMedia(
            {
                userId: currentUser.id,
                appId: appId,
                mediaType: MediaType.Screenshot,
                fileName: imageFileMetadata.filename,
                mime: imageFileMetadata.headers['content-type'],
            },
            knex,
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
