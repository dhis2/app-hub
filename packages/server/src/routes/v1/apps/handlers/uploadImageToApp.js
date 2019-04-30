const Boom = require('boom')

const { ImageType } = require('@enums')
const { saveFile } = require('@utils')

const {
    getCurrentAuthStrategy,
    getCurrentUserFromRequest,
    currentUserIsManager,
} = require('@security')

const {
    createTransaction,
    getAppsByUuid,
    addAppVersionMedia,
    updateApp,
    getAppDeveloperId,
} = require('@data')

module.exports = {
    method: 'POST',
    path: '/v1/apps/{appUuid}/images',
    config: {
        auth: getCurrentAuthStrategy(),
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

        const currentUser = await getCurrentUserFromRequest(request, db)
        const appDeveloperId = await getAppDeveloperId(
            request.params.appUuid,
            db
        )

        if (
            !currentUserIsManager(request) ||
            appDeveloperId !== currentUser.id
        ) {
            throw Boom.unauthorized(`You don't have access to edit that app`)
        }

        const appVersions = await getAppsByUuid(
            request.params.appUuid,
            'en',
            knex
        )

        const imageFile = request.payload.file
        const imageFileMetadata = imageFile.hapi

        const trx = await createTransaction(knex)

        //Save the image to all versions (previously the appstore stored media per app, and not version, so we keep them per version now but distinct them, if one version is deleted we still want to keep the screenshot for that version.) In the future we should be able to use separate screenshots for different versions to be able to show differences/new features
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

        trx.commit()

        return {
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'Image uploaded',
        }
    },
}
