const Boom = require('@hapi/boom')

const debug = require('debug')('apphub:server:routes:handlers:v1:deleteImage')

const {
    getCurrentUserFromRequest,
    currentUserIsManager,
} = require('../../../../security')

const {
    deleteAppMedia,
    getOrganisationAppsByUserId,
} = require('../../../../data')

const { deleteFile } = require('../../../../utils')

module.exports = {
    method: 'DELETE',
    path: '/v1/apps/{appId}/images/{appMediaId}',
    config: {
        auth: 'token',
        tags: ['api', 'v1'],
        plugins: {
            //TODO: set correct payloadType for 'hapi-swagger'
        },
        response: {
            status: {
                //TODO: add response statuses
            },
        },
    },
    handler: async (request, h) => {
        request.logger.info('In handler %s', request.path)

        const db = h.context.db

        const { appMediaId, appId } = request.params

        const currentUser = await getCurrentUserFromRequest(request, db)
        const isManager = currentUserIsManager(request)

        const userApps = await getOrganisationAppsByUserId(currentUser.id, db)
        const canDeleteImage =
            isManager || userApps.map((app) => app.app_id).indexOf(appId) !== -1

        debug('isManager:', isManager)
        debug('canDeleteImage:', canDeleteImage)

        if (canDeleteImage) {
            //can edit app
            const transaction = await db.transaction()

            try {
                await deleteAppMedia(appMediaId, transaction)

                await transaction.commit()

                await deleteFile(appId, appMediaId)
            } catch (err) {
                await transaction.rollback()
                throw Boom.internal(err)
            }
        } else {
            throw Boom.unauthorized()
        }

        //What the old v1 api responds with on this endpoint if all works out
        return {
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'Media deleted',
        }
    },
}
