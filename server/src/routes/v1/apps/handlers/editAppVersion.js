const Boom = require('@hapi/boom')

const {
    getCurrentUserFromRequest,
    currentUserIsManager,
} = require('../../../../security')

const {
    updateAppVersion,
    getOrganisationAppsByUserId,
} = require('../../../../data')

const EditAppVersionModel = require('../../../../models/v1/in/EditAppVersionModel')

module.exports = {
    method: 'PUT',
    path: '/v1/apps/{appId}/versions/{versionId}',
    config: {
        auth: 'token',
        tags: ['api', 'v1'],
        validate: {
            payload: EditAppVersionModel.payloadSchema,
            failAction: (request, h, err) => {
                return err
            },
        },
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
        const apps = await getOrganisationAppsByUserId(currentUser.id, db)

        const hasDeveloperAccessToApp = apps.map(app => app.id).indexOf(appId)

        if (currentUserIsManager(request) || hasDeveloperAccessToApp) {
            //can edit appversion
            const transaction = await db.transaction()

            try {
                const {
                    maxDhisVersion,
                    minDhisVersion,
                    demoUrl,
                    version,
                    channel,
                } = request.payload

                await updateAppVersion(
                    {
                        id: versionId,
                        maxDhisVersion,
                        minDhisVersion,
                        demoUrl,
                        version,
                        channel,
                        userId: currentUser.id,
                    },
                    db,
                    transaction
                )

                await transaction.commit()
                //Legacy return format
                //{"message":"Version with id xxxxxxxx updated","httpStatus":"OK","httpStatusCode":200}
                return {
                    message: `Version with id ${versionId} updated`,
                    httpStatus: 'OK',
                    httpStatusCode: 200,
                }
            } catch (err) {
                await transaction.rollback()
                throw Boom.internal(
                    `Could not update appversion: ${err.message}`
                )
            }
        }

        throw Boom.forbidden()
    },
}
