const uuid = require('uuid/v4')

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
        return request.auth.credentials.payload.roles.indexOf(role) !== -1
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


const createUserValidationFunc = (db) => {

    return async (decoded, request) => {

        console.log('ValidateUser')
        if (decoded && decoded.sub) {
            console.log('Valid user')

            console.dir(decoded)
            const { email, email_verified } = decoded

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
                    const [id] = await db('users').insert({
                        email,
                        uuid: uuid(),
                    }).returning('id')
                    console.log(`created user with id ${id} for email ${email}`)
                }
            }

            return { isValid: true }
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
