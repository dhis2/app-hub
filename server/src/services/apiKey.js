const Boom = require('@hapi/boom')
const Bounce = require('@hapi/bounce')
const { v4: uuidv4 } = require('uuid')
const crypto = require('crypto')
const { wrapError, UniqueViolationError } = require('db-errors')

const userApiKeyTable = 'user_api_key'

const generateApiKey = () => {
    const apiKey = uuidv4()
    const hashedKey = hashKey(apiKey)

    return { apiKey, hashedKey }
}

const hashKey = (apiKey) =>
    crypto.createHash('sha256').update(apiKey).digest('hex')

const createApiKeyForUser = async (userId, knex) => {
    const { apiKey, hashedKey } = generateApiKey()

    try {
        await knex(userApiKeyTable).insert({
            hashed_api_key: hashedKey,
            user_id: userId,
        })

        return apiKey
    } catch (e) {
        const wrapped = wrapError(e)
        Bounce.ignore(wrapped, UniqueViolationError)
        throw Boom.conflict('Only one API-key per user')
    }
}

const getUserIdByApiKey = async (apiKey, knex) => {
    const hashedKey = hashKey(apiKey)
    const res = await knex(userApiKeyTable)
        .select('user_id')
        .where({
            hashed_api_key: hashedKey,
        })
        .first()

    return res && res.user_id
}

const getApiKeyByUserId = async (userId, knex) => {
    return knex(userApiKeyTable)
        .select('hashed_api_key', 'created_at')
        .where({
            user_id: userId,
        })
        .first()
}

const deleteApiKeyForUser = async (userId, knex) => {
    const deletedRows = await knex(userApiKeyTable)
        .where({ user_id: userId })
        .delete()

    if (deletedRows !== 1) {
        throw Boom.conflict('User does not have an API key')
    }

    return deletedRows
}

module.exports = {
    createApiKeyForUser,
    deleteApiKeyForUser,
    generateApiKey,
    getUserIdByApiKey,
    getApiKeyByUserId,
    hashKey,
}
