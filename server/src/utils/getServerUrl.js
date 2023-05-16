/**
 * Returns the server API url for the backend itself based on the request. If we're running behind a proxy, try to fetch the forwarded protocol
 * If { base: true } is passed, return the server base url (without /api)
 * @param {Object} request incoming hapijs request
 * @param {Object} options options objects
 * @param {boolean} options.base if true, return server base url (without /api)
 */
const getServerUrl = (request, { base } = { base: false }) => {
    const protocol =
        request.headers['x-forwarded-proto'] || request.server.info.protocol
    const host = request.headers['x-forwarded-host'] || request.info.hostname

    //port is of type string from headers but an integer from request.server.info.port
    let port = +request.headers['x-forwarded-port']

    if (!port) {
        //If served through a proxy or other NAT, we would need to get the exposed port for creating links
        //and not our internal port running on the web server
        try {
            //host can be for example 'localhost:3000'
            port = +request.info.host.split(':')[1]
        } catch (err) {
            port = request.server.info.port
        }
    }

    let portToUseInUrl = ''

    //only add port to the url if it differs from the protocol standard port 80 vs 443 to get prettier urls
    if (
        !isNaN(port) &&
        ((protocol === 'https' && port !== 443) ||
            (protocol === 'http' && port !== 80))
    ) {
        portToUseInUrl = `:${port}`
    }

    const apiPart = base ? '' : '/api'

    return `${protocol}://${host}${portToUseInUrl}${apiPart}`
}
module.exports = getServerUrl
