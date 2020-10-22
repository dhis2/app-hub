const debug = require('debug')('apphub:server:security:createUserValidation')
const Boom = require('@hapi/boom')

const { createUser } = require('../data')

const createUserValidationFunc = (db, audience) => {
    return async decoded => {
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
                        const trx = await db.transaction()
                        try {
                            user = await createUser(
                                {
                                    email,
                                    name,
                                },
                                trx
                            )

                            debug(
                                `created user with id ${user.id} for email ${user.email}`
                            )

                            await trx('user_external_id').insert({
                                user_id: user.id,
                                external_id: decoded.sub,
                            })

                            await trx.commit()
                        } catch (err) {
                            debug('error creating user', err)
                            await trx.rollback()
                            throw Boom.internal(err)
                        }
                    } else {
                        debug('user exists via e-mail: ', user)
                    }
                }

                returnObj.credentials.userId = user.id
            } else if (decoded.sub === `${audience}@clients`) {
                //If we get here we're dealing with an M2M API authenticated user
                const [apiUser] = await db('users')
                    .select('users.*')
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
