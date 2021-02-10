const Boom = require('@hapi/boom')
const Bounce = require('@hapi/bounce')
const { v4: uuidv4 } = require('uuid')
const crypto = require('crypto')
const { wrapError, UniqueViolationError } = require('db-errors')
const { getCurrentUserFromRequest } = require('../../security')
module.exports = [
    {
        method: 'POST',
        path: '/v2/key',
        config: {
            auth: 'token',
            tags: ['api', 'v2'],
        },
        handler: async (request, h) => {
            const { db } = h.context
            const { id: userId } = await getCurrentUserFromRequest(request, db)

            const apiKey = uuidv4()
            const hashedHex = crypto
                .createHash('sha256')
                .update(apiKey)
                .digest('hex')
            console.log(hashedHex)
            const createKeyTrx = async trx => {
                try {
                    await trx('user_api_key').insert({
                        api_key: hashedHex,
                        user_id: userId,
                    })
                } catch (e) {
                    const wrapped = wrapError(e)
                    Bounce.ignore(wrapped, UniqueViolationError)
                    throw Boom.conflict('Only one API-key per user')
                }
            }

            await db.transaction(createKeyTrx)
            return {
                apiKey,
                hashedHex,
            }
        },
    },
]
