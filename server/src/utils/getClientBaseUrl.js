const getServerUrl = require('./getServerUrl')

const getClientBaseUrl = request => {
    let baseUrl = getServerUrl(request)
    if (process.env.NODE_ENV === 'development') {
        // use referrer as frontend might be running in webpack
        baseUrl = request.info.referrer || baseUrl
    }
    baseUrl = baseUrl.replace(
        /\/(api)*$/, // replace trailing /api and /
        ''
    )

    return baseUrl
}

module.exports = {
    getClientBaseUrl,
}
