const { getCurrentUserFromRequest } = require('../../security')
const { ApiKey } = require('../../services/')

module.exports = [
    {
<<<<<<< HEAD
        method: 'POST',
        path: '/v2/key',
        config: {
            auth: 'token', // you cannot generate a new token using API-key
=======
        method: 'GET',
        path: '/v2/key',
        config: {
            auth: 'token',
>>>>>>> next
            tags: ['api', 'v2'],
        },
        handler: async (request, h) => {
            const { db } = h.context
            const { id: userId } = await getCurrentUserFromRequest(request, db)

<<<<<<< HEAD
            const apiKey = ApiKey.createApiKeyForUser(userId, db)
=======
            const apiKey = await ApiKey.getApiKeyByUserId(userId, db)

            return {
                hasApiKey: !!apiKey,
                createdAt: apiKey && apiKey.created_at,
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
>>>>>>> next
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

<<<<<<< HEAD
            ApiKey.deleteApiKeyForUser(userId, db)
=======
            await ApiKey.deleteApiKeyForUser(userId, db)
>>>>>>> next

            return h.response('API key revoked').code(200)
        },
    },
]
