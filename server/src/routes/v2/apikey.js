const { getCurrentUserFromRequest } = require('../../security')
const { ApiKey } = require('../../services/')

module.exports = [
    {
        method: 'GET',
        path: '/v2/key',
        config: {
            auth: 'token',
            tags: ['api', 'v2'],
        },
        handler: async (request, h) => {
            const { db } = h.context
            const { id: userId } = await getCurrentUserFromRequest(request, db)

            const apiKey = await ApiKey.getApiKeyByUserId(userId, db)

            return {
                hasApiKey: !!apiKey,
            }
        },
    },
    {
        method: 'POST',
        path: '/v2/key',
        config: {
            auth: 'token', // you cannot generate a new key using API-key
            tags: ['api', 'v2'],
        },
        handler: async (request, h) => {
            const { db } = h.context
            const { id: userId } = await getCurrentUserFromRequest(request, db)

            const apiKey = await ApiKey.createApiKeyForUser(userId, db)
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

            await ApiKey.deleteApiKeyForUser(userId, db)

            return h.response('API key revoked').code(200)
        },
    },
]
