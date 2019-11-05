/***
 * Returns the server url for the backend itself based on the request. If we're running behind a proxy, try to fetch the forwarded protocol
 * @param {object} request incoming hapijs request
 */
const getServerUrl = request => {
    const protocol =
        request.headers['x-forwarded-proto'] || request.server.info.protocol
    const host = request.headers['x-forwarded-host'] || request.info.hostname

    //port is of type string from headers but an integer from request.server.info.port
    const port = +(
        request.headers['x-forwarded-port'] || request.server.info.port
    )

    let portToUseInUrl = ''

    //only add port to the url if it differs from the protocol standard port 80 vs 443 to get prettier urls
    if (
        !isNaN(port) &&
        ((protocol === 'https' && port !== 443) ||
            (protocol === 'http' && port !== 80))
    ) {
        portToUseInUrl = `:${port}`
    }

    return `${protocol}://${host}${portToUseInUrl}/api`
}

module.exports = getServerUrl
