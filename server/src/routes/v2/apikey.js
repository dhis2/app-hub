const { getCurrentUserFromRequest } = require('../../security')
const { ApiKey } = require('../../services/')

module.exports = [
    {
        method: 'POST',
        path: '/v2/key',
        config: {
            auth: 'token', // you cannot generate a new token using API-key
            tags: ['api', 'v2'],
        },
        handler: async (request, h) => {
            const { db } = h.context
            const { id: userId } = await getCurrentUserFromRequest(request, db)

            const apiKey = ApiKey.createApiKeyForUser(userId, db)
            return {
                apiKey,
            }
        },
    },
    {
        method: 'DELETE',
        path: '/v2/key',
        config: {
            auth: {
                strategies: ['token', 'api-key'],
            },
            tags: ['api', 'v2'],
        },
        handler: async (request, h) => {
            const { db } = h.context
            const { id: userId } = await getCurrentUserFromRequest(request, db)

            ApiKey.deleteApiKeyForUser(userId, db)

            return h.response('API key revoked').code(200)
        },
    },
]
