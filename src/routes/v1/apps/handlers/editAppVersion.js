const Boom = require('boom')

const {
    getCurrentAuthStrategy,
    getCurrentUserFromRequest,
    currentUserIsManager,
} = require('../../../../security')

const {
    updateAppVersion,
    getAppDeveloperId,
} = require('../../../../data')

const EditAppVersionModel = require('../../../../models/v1/in/EditAppVersionModel')

module.exports = {
    method: 'PUT',
    path: '/v1/apps/{appUuid}/versions/{versionUuid}',
    config: {
        auth: getCurrentAuthStrategy(),
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

        const { appUuid, versionUuid } = request.params

        const currentUser = await getCurrentUserFromRequest(request, db)
        const currentUserIsAppDeveloper = await getAppDeveloperId(
            request.params.appUuid,
            db
        )

        if (currentUserIsManager(request) || currentUserIsAppDeveloper) {
            //can edit appversion
            const transaction = await db.transaction()

            try {
                const {
                    maxDhisVersion,
                    minDhisVersion,
                    demoUrl,
                    version,
                } = request.payload

                await updateAppVersion(
                    {
                        uuid: versionUuid,
                        maxDhisVersion,
                        minDhisVersion,
                        demoUrl,
                        version,
                    },
                    db
                )

                transaction.commit()
                //Legacy return format
                //{"message":"Version with id xxxxxxxx updated","httpStatus":"OK","httpStatusCode":200}
                return {
                    message: `Version with id ${versionUuid} updated`,
                    httpStatus: 'OK',
                    httpStatusCode: 200,
                }
            } catch (err) {
                throw Boom.internal(
                    `Could not update appversion: ${err.message}`
                )
            }
        }

        throw Boom.unauthorized()
    },
}
