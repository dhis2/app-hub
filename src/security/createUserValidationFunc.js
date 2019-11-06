const debug = require('debug')('appstore:server:security:createUserValidation')
const Boom = require('@hapi/boom')
const uuid = require('uuid/v4')

const { createUser } = require('../data')

const createUserValidationFunc = (db, audience) => {
    return async (decoded, request) => {
        if (decoded && decoded.sub) {
            debug(`Valid user with external userId: ${decoded.sub}`, decoded)

            const { email, email_verified, name } = decoded

            const returnObj = { isValid: true, credentials: decoded }

            if (email_verified) {
                debug('email verified')
                let user = null
                try {
                    const users = await db('users')
                        .innerJoin(
                            'user_external_id',
                            'users.id',
                            'user_external_id.user_id'
                        )
                        .select('users.*')
                        .where({
                            email,
                            external_id: decoded.sub,
                        })

                    if (users && users.length === 1) {
                        user = users[0]
                        debug(`Found user: ${user.email} with id ${user.id}`)
                    }
                } catch (err) {
                    debug(err)
                }

                if (user === null) {
                    debug('user does not exist in db, create it')

                    //check if the user exists without checking external id
                    user = await db('users')
                        .where('email', email)
                        .first('id', 'email')

                    if (!user) {
                        //create the user if it doesn't exist
                        const transaction = await db.transaction()
                        try {
                            user = await createUser(
                                {
                                    email,
                                    name,
                                },
                                db,
                                transaction
                            )

                            debug(
                                `created user with id ${user.id} for email ${user.email}`
                            )

                            await db('user_external_id')
                                .transacting(transaction)
                                .insert({
                                    user_id: user.id,
                                    external_id: decoded.sub,
                                })

                            await transaction.commit()
                        } catch (err) {
                            debug('error creating user', err)
                            await transaction.rollback()
                            throw Boom.internal(err)
                        }
                    } else {
                        debug('user exists via e-mail: ', user)
                    }
                }

                returnObj.credentials.userId = user.id
                returnObj.credentials.uuid = user.uuid
            } else if (decoded.sub === `${audience}@clients`) {
                //If we get here we're dealing with an M2M API authenticated user
                const [apiUser] = await db('users')
                    .select()
                    .innerJoin(
                        'user_external_id',
                        'user_external_id.user_id',
                        'users.id'
                    )
                    .where('external_id', `${audience}@clients`)

                debug('apiUser:', apiUser)

                if (!apiUser) {
                    throw Boom.internal('No M2M user mapped in database.')
                }

                try {
                    //Add the mapped user email to enable it to work through the rest of the permission system
                    returnObj.credentials.email = apiUser.email
                    returnObj.credentials.roles = [
                        'ROLE_MANAGER',
                        'ROLE_USER',
                        'ROLE_ADMIN',
                    ] //the M2M has full access (all roles)
                    returnObj.credentials.email_verified = true
                    returnObj.credentials.userId = apiUser.id
                    returnObj.credentials.uuid = apiUser.uuid
                } catch (err) {
                    throw Boom.internal(err)
                }
            }

            return returnObj
        }

        debug('Invalid user', decoded)
        return { isValid: false }
    }
}

module.exports = createUserValidationFunc
