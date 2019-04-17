
const Boom = require('boom')

const EditAppModel = require('@models/v1/in/EditAppModel')

const {
    getCurrentAuthStrategy,
    getCurrentUserFromRequest,
    currentUserIsManager
} = require('@security')

const  { createTransaction, updateApp, getAppsByUuid } = require('@data')

const userIsDeveloperOfAppWithUuid = async (params, db) => {
    try {
        const [firstApp] = await getAppsByUuid(params.uuid, 'en', db)
        return firstApp.developer_id === params.userId
    } catch ( err ) {
        return false
    }    
}

module.exports = {
    method: 'PUT',
    path: '/v1/apps/{appUuid}',
    config: {
        auth: getCurrentAuthStrategy(),
        tags: ['api', 'v1'],
        validate: {
            payload: EditAppModel.payloadSchema,
            failAction: (request, h, err) => {
                return err;
            }
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
            }
        },
    },
    handler: async (request, h) => {

        request.logger.info('In handler %s', request.path)


        const db = h.context.db

        const currentUser = await getCurrentUserFromRequest(request, db)
        const currentUserIsAppDeveloper = await userIsDeveloperOfAppWithUuid({ userId: currentUser.id, uuid: request.params.appUuid }, db)

        if ( currentUserIsManager(request) || currentUserIsAppDeveloper ) {
            //can edit app
            try {
                const { name, description, appType, developer, sourceUrl } = request.payload
                const transaction = await createTransaction(db)
                
                await updateApp({
                    uuid: request.params.appUuid,
                    userId: currentUser.id,
                    name,
                    description,
                    sourceUrl,
                    languageCode: 'en'
                }, db, transaction)

            } catch ( err ) {
                throw Boom.internal(err)
            }

        } else {
            throw Boom.unauthorized()
        }

        //What the old v1 api responds with on this endpoint if all works out
        return {
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'App updated'
        }
    }
}

