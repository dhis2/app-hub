const Boom = require('boom')

const EditAppModel = require('@models/v1/in/EditAppModel')

const {
    getCurrentAuthStrategy,
    getCurrentUserFromRequest,
    currentUserIsManager,
} = require('@security')

const {
    createTransaction,
    updateImageMeta,
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

        const jsonPayload = JSON.parse(request.payload)

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
                //if just clicking the star symbol in the frontend, the jsonPayload will only contain logo = true
                if (jsonPayload.logo) {
                    await setImageAsLogoForApp(
                        {
                            appUuid,
                            mediaUuid,
                        },
                        db,
                        transaction
                    )
                }

                //if editing the caption/desc it will also contain this on top of the logo boolean
                if (jsonPayload.caption || jsonPayload.description) {
                    await updateImageMeta(
                        {
                            uuid: mediaUuid,
                            caption: jsonPayload.caption,
                            description: jsonPayload.description,
                        },
                        db,
                        transaction
                    )
                }

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
