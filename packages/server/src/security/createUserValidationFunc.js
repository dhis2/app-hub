const Boom = require('boom')
const uuid = require('uuid/v4')

const { createUser } = require('@data')

const createUserValidationFunc = (db, audience) => {

    return async (decoded, request) => {

        console.log('ValidateUser')
        if (decoded && decoded.sub) {
            console.log(`Valid user with external userId: ${decoded.sub}`)
            console.log(decoded)

            const { email, email_verified, name } = decoded

            const returnObj = { isValid: true, credentials: decoded }

            if ( email_verified ) {
                let user = null
                try {
                    const users = await db('users').select().where('email', email)
                    if ( users && users.length === 1 ) {
                        user = users[0]
                        console.log(`Found user: ${user.email} with id ${user.id}`)
                    } 
                } catch (err) {
                    console.log(err)
                }

                if ( user === null ) {
                    console.log('user does not exist in db, create it')
                    user = await createUser({
                        email,
                        name
                    })
                    console.log(`created user with id ${user.id} for email ${user.email}`)
                    await db('user_external_id')
                        .insert({
                            user_id: user.id,
                            external_id: decoded.sub
                        })
                } 

                returnObj.credentials.userId = user.id
                returnObj.credentials.uuid = user.uuid

            } else if ( decoded.sub === `${audience}@clients`) {

                //If we get here we're dealing with an M2M API authenticated user
                try {
                    const [apiUser] = await db('users').select()
                        .innerJoin('user_external_id', 'user_external_id.user_id', 'users.id')
                        .where('external_id', `${audience}@clients`)

                    //Add the mapped user email to enable it to work through the rest of the permission system
                    returnObj.credentials.email = apiUser.email
                    returnObj.credentials.roles = ['ROLE_MANAGER', 'ROLE_USER', 'ROLE_ADMIN']   //the M2M has full access (all roles)
                    returnObj.credentials.email_verified = true
                    returnObj.credentials.userId = apiUser.id
                    returnObj.credentials.uuid = apiUser.uuid
                } catch ( err ) {
                    throw Boom.internal(err)
                }

            }

            return returnObj
        }

        console.log('Invalid user')
        return { isValid: false }
    }
}

module.exports = createUserValidationFunc
