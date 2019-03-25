/**
 * This returns true if the request is authenticated (e.g. contains a valid token)
 * @param {*} request 
 */
const isAuthenticated = (request) => {

    try {
        return request.auth.isAuthenticated
    } catch (err) {
        return false
    }
}

/**
 * Returns true if the JWT/user for the request contains a role with the specified name
 * @param {*} request 
 * @param {*} role 
 */
const hasRole = (request, role) => {

    try {
        return request.auth.credentials.payload.roles.indexOf(role) !== -1
    } catch ( err ) {
        return false
    }
}

const canDeleteApp = (request, hapi) => isAuthenticated(request) && hasRole(request, 'ROLE_ADMIN')
const canChangeAppStatus = (request, hapi) => isAuthenticated(request) && hasRole(request, 'ROLE_ADMIN')
const canCreateAppVersion = (request, hapi) => isAuthenticated(request)
const canCreateApp = (request, hapi) => isAuthenticated(request)
const canSeeAllApps = (request, hapi) => isAuthenticated(request) && hasRole(request, 'ROLE_ADMIN')

module.exports = {
    canDeleteApp,
    canChangeAppStatus,
    canCreateApp,
    canCreateAppVersion,
    canSeeAllApps
}
