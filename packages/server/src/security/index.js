const uuid = require('uuid/v4')
const Boom = require('boom')

/**
 * This returns true if the request is authenticated (e.g. contains a valid token)
 * @param {*} request
 */
const isAuthenticated = (request) => {

    try {
        return request.auth.isAuthenticated === true
    } catch (err) {
        return false
    }
}

/**
 * Returns true if the JWT/user for the request contains a role with the specified name
 * @param {*} request
 * @param {string} role
 */
const hasRole = (request, role) => {

    try {
        return request.auth.credentials.roles.indexOf(role) !== -1
    } catch ( err ) {
        return false
    }
}

/**
 * Checks if the user on the request has permissions to delete an app
 * @param {*} request
 * @param {*} hapi
 */
const canDeleteApp = (request, hapi) => isAuthenticated(request) && hasRole(request, 'ROLE_MANAGER')

/**
 * Checks if the user on the request has permissions to change the status of an app
 * @param {*} request
 * @param {*} hapi
 */
const canChangeAppStatus = (request, hapi) => isAuthenticated(request) && hasRole(request, 'ROLE_MANAGER')

/**
 * Checks if the user on the request has permissions to create an app version
 * @param {*} request
 * @param {*} hapi
 */
const canCreateAppVersion = (request, hapi) => isAuthenticated(request)

/**
 * Checks if the user on the request has permissions to create an app
 * @param {*} request
 * @param {*} hapi
 */
const canCreateApp = (request, hapi) => isAuthenticated(request)

/**
 * Checks if the user on the request has permissions to see all apps
 * @param {*} request
 * @param {*} hapi
 */
const canSeeAllApps = (request, hapi) => isAuthenticated(request) && hasRole(request, 'ROLE_MANAGER')


const createUserValidationFunc = (db, audience) => {

    return async (decoded, request) => {

        console.log('ValidateUser')
        if (decoded && decoded.sub) {
            console.log(`Valid user with external userId: ${decoded.sub}`)

            const { email, email_verified } = decoded

            const returnObj = { isValid: true, credentials: decoded }

            if ( email_verified ) {
                let user = null
                try {
                    const users = await db.select().from('users').where('email', email)
                    if ( users && users.length === 1 ) {
                        user = users[0]
                        console.log(`Found user: ${user.email} with id ${user.id}`)
                    } 
                } catch (err) {
                    console.log(err)
                }

                if ( user === null ) {
                    console.log('user does not exist in db, create it')
                    const newUuid = uuid()
                    const [id] = await db('users').insert({
                        email,
                        uuid: newUuid,
                    }).returning('id')
                    console.log(`created user with id ${id} for email ${email}`)

                    returnObj.credentials.userId = id
                    returnObj.credentials.uuid = newUuid
                } else {
                    returnObj.credentials.userId = user.id
                    returnObj.credentials.uuid = user.uuid
                }
            } else if ( decoded.sub === `${audience}@clients`) {

                //If we get here we're dealing with an M2M API authenticated user
                try {
                    const [apiUser] = await db.select()
                        .from('users')
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


module.exports = {
    canDeleteApp,
    canChangeAppStatus,
    canCreateApp,
    canCreateAppVersion,
    canSeeAllApps,
    createUserValidationFunc
}
