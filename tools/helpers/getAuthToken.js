const request = require('request-promise-native')

module.exports = async () => {
    const url = 'https://dhis2.eu.auth0.com/oauth/token'
    const payload = JSON.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_SECRET,
        audience: process.env.AUTH0_AUDIENCE,
        grant_type: 'client_credentials',
    })
    const tokenResponse = await request.post({
        url,
        headers: {
            'Content-Type': 'application/json',
        },
        body: payload,
    })

    const tokenJson = JSON.parse(tokenResponse)

    return tokenJson.access_token
}
