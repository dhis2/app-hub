const Boom = require('boom')

const EditAppModel = require('../../../../models/v1/in/EditAppModel')

const {
    getCurrentAuthStrategy,
    getCurrentUserFromRequest,
    currentUserIsManager,
} = require('../../../../security')

const {
    updateApp,
    getAppDeveloperId,
} = require('../../../../data')

module.exports = {
    method: 'PUT',
    path: '/v1/apps/{appUuid}',
    config: {
        auth: getCurrentAuthStrategy(),
        tags: ['api', 'v1'],
        validate: {
            payload: EditAppModel.payloadSchema,
            failAction: (request, h, err) => {
                return err
            },
        },
        plugins: {
            //TODO: set correct payloadType for 'hapi-swagger'
            /*'hapi-swagger': {
                payloadType: 'form'
            }*/
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

        const currentUser = await getCurrentUserFromRequest(request, db)
        const appDeveloperId = await getAppDeveloperId(
            request.params.appUuid,
            db
        )

        if (
            currentUserIsManager(request) ||
            appDeveloperId === currentUser.id
        ) {
            //can edit app
            const transaction = await db.transaction()

            try {
                const {
                    name,
                    description,
                    appType,
                    sourceUrl,
                } = request.payload

                await updateApp(
                    {
                        uuid: request.params.appUuid,
                        userId: currentUser.id,
                        name,
                        description,
                        sourceUrl,
                        appType,
                        languageCode: 'en',
                    },
                    db,
                    transaction,
                )

                //TODO: update developer/organisation. Create new developer if e-mail & name changed or update old?

                transaction.commit()
            } catch (err) {
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
