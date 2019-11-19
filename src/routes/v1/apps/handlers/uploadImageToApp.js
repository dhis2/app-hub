const Boom = require('@hapi/boom')

const { ImageType } = require('../../../../enums')
const { saveFile } = require('../../../../utils')

const {
    getCurrentUserFromRequest,
    currentUserIsManager,
} = require('../../../../security')

const {
    getAppsByUuid,
    addAppVersionMedia,
    getAppDeveloperId,
} = require('../../../../data')

module.exports = {
    method: 'POST',
    path: '/v1/apps/{appUuid}/images',
    config: {
        auth: 'required',
        tags: ['api', 'v1'],
        payload: {
            maxBytes: 20 * 1024 * 1024, //20MB
            allow: 'multipart/form-data',
            parse: true,
            output: 'stream',
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
            request.params.appUuid,
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

        const appVersions = await getAppsByUuid(
            request.params.appUuid,
            'en',
            knex
        )

        const imageFile = request.payload.file
        const imageFileMetadata = imageFile.hapi

        const trx = await knex.transaction()

        //Save the image to all versions? (previously the appstore stored media per app, and not version, so we keep them per version for now.
        //In the future we should be able to use separate screenshots for different versions to be able to show differences/new features
        const promises = appVersions.map(async appVersion => {
            const { id, uuid } = await addAppVersionMedia(
                {
                    userId: currentUser.id,
                    appVersionId: appVersion.version_id,
                    imageType: ImageType.Screenshot,
                    fileName: imageFileMetadata.filename,
                    mime: imageFileMetadata.headers['content-type'],
                },
                knex,
                trx
            )

            await saveFile(
                `${appVersion.uuid}/${appVersion.version_uuid}`,
                uuid,
                imageFile._data
            )
        })

        await Promise.all(promises)

        await trx.commit()

        return {
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'Image uploaded',
        }
    },
}
