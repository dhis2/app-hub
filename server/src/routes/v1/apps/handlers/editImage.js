const Boom = require('@hapi/boom')

const {
    getCurrentUserFromRequest,
    currentUserIsManager,
} = require('../../../../security')

const {
    updateImageMeta,
    setImageAsLogoForApp,
    getOrganisationAppsByUserId,
} = require('../../../../data')

module.exports = {
    method: 'PUT',
    path: '/v1/apps/{appId}/images/{mediaId}',
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

        const { mediaId, appId } = request.params

        const jsonPayload = request.payload

        const currentUser = await getCurrentUserFromRequest(request, db)
        const appsUserCanEdit = await getOrganisationAppsByUserId(
            currentUser.id,
            db
        )
        const userCanEditApp = appsUserCanEdit
            .map(app => app.app_id)
            .includes(request.params.appId)
        const isManager = currentUserIsManager(request)

        if (isManager || userCanEditApp) {
            //can edit app
            const transaction = await db.transaction()

            try {
                //if just clicking the star symbol in the frontend, the jsonPayload will only contain logo = true
                if (jsonPayload.logo) {
                    await setImageAsLogoForApp(
                        {
                            appId,
                            mediaId,
                        },
                        db,
                        transaction
                    )
                }

                //if editing the caption/desc it will also contain this on top of the logo boolean
                if (jsonPayload.caption || jsonPayload.description) {
                    await updateImageMeta(
                        {
                            id: mediaId,
                            caption: jsonPayload.caption,
                            description: jsonPayload.description,
                        },
                        db,
                        transaction
                    )
                }

                await transaction.commit()
            } catch (err) {
                await transaction.rollback()
                throw Boom.internal(err)
            }
        } else {
            throw Boom.forbidden()
        }

        //What the old v1 api responds with on this endpoint if all works out
        return {
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'App updated',
        }
    },
}
