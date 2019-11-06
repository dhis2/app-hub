const debug = require('debug')('appstore:server:security')
/**
 * This returns true if the request is authenticated (e.g. contains a valid token)
 * @param {*} request
 */
const isAuthenticated = request => {
    try {
        return (
            getCurrentAuthStrategy() === false ||
            request.auth.isAuthenticated === true
        )
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
    //if no authentication is used assume all roles
    if (getCurrentAuthStrategy() === false) {
        return true
    }

    try {
        return request.auth.credentials.roles.indexOf(role) !== -1
    } catch (err) {
        return false
    }
}

/**
 * Checks if the user on the request has permissions to delete an app
 * @param {*} request
 * @param {*} hapi
 */
const canDeleteApp = (request, hapi) =>
    isAuthenticated(request) && hasRole(request, 'ROLE_MANAGER')

/**
 * Checks if the user on the request has permissions to change the status of an app
 * @param {*} request
 * @param {*} hapi
 */
const canChangeAppStatus = (request, hapi) =>
    isAuthenticated(request) && hasRole(request, 'ROLE_MANAGER')

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
const canSeeAllApps = (request, hapi) =>
    isAuthenticated(request) && hasRole(request, 'ROLE_MANAGER')

const currentUserIsManager = (request, hapi) =>
    isAuthenticated(request) && hasRole(request, 'ROLE_MANAGER')

/**
 * Returns the current auth strategy, for example 'jwt' if using auth0, false if no strategy
 */
const getCurrentAuthStrategy = () => {
    if (
        process.env.AUTH_STRATEGY !== undefined &&
        process.env.AUTH_STRATEGY !== ''
    ) {
        return process.env.AUTH_STRATEGY
    }

    return false
}

/**
 * Returns the auth strategy config in optional mode
 */
const getCurrentAuthStrategyOptional = () => {
    if (
        process.env.AUTH_STRATEGY === 'jwt' &&
        process.env.AUTH_STRATEGY !== ''
    ) {
        return {
            strategy: process.env.AUTH_STRATEGY,
            mode: 'try',
        }
    }

    return false
}

const getCurrentUserFromRequest = async (request, knex) => {
    return new Promise(async (resolve, reject) => {
        let user = null

        if (getCurrentAuthStrategy() === false) {
            //TODO: this might be done in a better way, but somehow we must know what to map to when we don't use any authentication
            //only to be used for test/dev and not in production where authentication should be used.
            user = {
                id: process.env.NO_AUTH_MAPPED_USER_ID,
            }
            const dbUser = await knex('users')
                .where('id', user.id)
                .first()
            if (!dbUser) {
                reject(
                    `Trying to use auth mapped to a user that doesnt exist with id: ${process.env.NO_AUTH_MAPPED_USER_ID}`
                )
                return
            }
        } else if (
            request !== null &&
            request.auth !== null &&
            request.auth.credentials !== null
        ) {
            user = {
                id: request.auth.credentials.userId,
                uuid: request.auth.credentials.uuid,
            }
            debug('Auth credentials', request.auth.credentials)
        } else {
            reject()
            return
        }

        resolve(user)
    })
}

module.exports = {
    canDeleteApp,
    canChangeAppStatus,
    canCreateApp,
    canCreateAppVersion,
    canSeeAllApps,
    createUserValidationFunc: require('./createUserValidationFunc'),
    getCurrentAuthStrategy,
    getCurrentAuthStrategyOptional,
    getCurrentUserFromRequest,
    currentUserIsManager,
}
