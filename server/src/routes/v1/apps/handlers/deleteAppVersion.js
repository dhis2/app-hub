const Boom = require('@hapi/boom')

const {
    getCurrentUserFromRequest,
    currentUserIsManager,
} = require('../../../../security')

const { getAppDeveloperId, deleteAppVersion } = require('../../../../data')

const { deleteFile } = require('../../../../utils')

module.exports = {
    method: 'DELETE',
    path: '/v1/apps/{appId}/versions/{versionId}',
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

        const { appId, versionId } = request.params

        const currentUser = await getCurrentUserFromRequest(request, db)
        const appDeveloperId = await getAppDeveloperId(appId, db)

        const isManager = currentUserIsManager(request)

        if (isManager || appDeveloperId === currentUser.id) {
            //can edit app
            const transaction = await db.transaction()

            try {
                await deleteAppVersion(versionId, transaction)
                await transaction.commit()
                await deleteFile(`${appId}/${versionId}`, 'app.zip')
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
