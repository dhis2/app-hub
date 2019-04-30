const Boom = require('boom')

const EditAppModel = require('@models/v1/in/EditAppModel')

const {
    getCurrentAuthStrategy,
    getCurrentUserFromRequest,
    currentUserIsManager,
} = require('@security')

const {
    createTransaction,
    updateApp,
    getAppDeveloperId,
    setImageAsLogoForApp,
} = require('@data')

module.exports = {
    method: 'PUT',
    path: '/v1/apps/{appUuid}/images/{mediaUuid}',
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

        const { mediaUuid, appUuid } = request.params

        const currentUser = await getCurrentUserFromRequest(request, db)
        const appDeveloperId = await getAppDeveloperId(
            request.params.appUuid,
            db
        )

        const isManager = currentUserIsManager(request)

        if (isManager || appDeveloperId === currentUser.id) {
            //can edit app
            const transaction = await createTransaction(db)

            try {
                await setImageAsLogoForApp(appUuid, mediaUuid, db, transaction)

                transaction.commit()
            } catch (err) {
                transaction.rollback()
                throw Boom.internal(err)
            }
        } else {
            throw Boom.unauthorized()
        }

        //What the old v1 api responds with on this endpoint if all works out
        return {
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'App updated',
        }
    },
}
