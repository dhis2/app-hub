//const { find: findAPIKey } = require('../services/apiKey')
const Boom = require('@hapi/boom')
const Bounce = require('@hapi/bounce')
const debug = require('debug')('apphub:server:security:apiKeyValidation')
const crypto = require('crypto')

const createApiKeyValidationFunc = db => {
    return async (apiKey, request, h) => {
        debug('Validate api-key')
        const credentials = {}
        try {
            const hashedKey = crypto
                .createHash('sha256')
                .update(apiKey)
                .digest('hex')

            const user = await db('users')
                .select('users.*')
                .innerJoin('user_api_key', 'user_api_key.user_id', 'users.id')
                .where({
                    api_key: hashedKey,
                })
                .first()

            if (!user) {
                throw Boom.unauthorized()
            }
            credentials.email = user.email
            credentials.userId = user.id
            credentials.roles = []

            return {
                isValid: true,
                credentials,
            }
        } catch (e) {
            Bounce.rethrow(e, 'system')
            return { isValid: false }
        }
    }
}

module.exports = createApiKeyValidationFunc
