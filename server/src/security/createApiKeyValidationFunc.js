const Boom = require('@hapi/boom')
const Bounce = require('@hapi/bounce')
const debug = require('debug')('apphub:server:security:apiKeyValidation')
const { getUserIdByApiKey } = require('../services/apiKey')

const getUserByApiKey = async (apiKey, trx) => {
    const userId = await getUserIdByApiKey(apiKey, trx)

    if (!userId) {
        return null
    }

    // TODO: this should probably be in some User-service
    const userInfo = await trx('users')
        .select()
        .where({ id: userId })
        .first()

    return userInfo
}

const createApiKeyValidationFunc = db => {
    return async apiKey => {
        debug('Validate api-key')
        const credentials = {}
        try {
            const user = await db.transaction(trx =>
                getUserByApiKey(apiKey, trx)
            )

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
            debug(e)
            return { isValid: false }
        }
    }
}

module.exports = createApiKeyValidationFunc
