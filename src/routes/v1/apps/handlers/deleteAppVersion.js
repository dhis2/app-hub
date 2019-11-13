const Boom = require('@hapi/boom')

const {
    getCurrentAuthStrategy,
    getCurrentUserFromRequest,
    currentUserIsManager,
} = require('../../../../security')

const { getAppDeveloperId, deleteAppVersion } = require('../../../../data')

const { deleteFile } = require('../../../../utils')

module.exports = {
    method: 'DELETE',
    path: '/v1/apps/{appUuid}/versions/{versionUuid}',
    config: {
        auth: getCurrentAuthStrategy(),
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

        const { appUuid, versionUuid } = request.params

        const currentUser = await getCurrentUserFromRequest(request, db)
        const appDeveloperId = await getAppDeveloperId(appUuid, db)

        const isManager = currentUserIsManager(request)

        if (isManager || appDeveloperId === currentUser.id) {
            //can edit app
            const transaction = await db.transaction()

            try {
                await deleteAppVersion(versionUuid, db, transaction)
                await transaction.commit()
                await deleteFile(`${appUuid}/${versionUuid}`, 'app.zip')
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
            message: 'Appversion deleted',
        }
    },
}
