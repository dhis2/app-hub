const request = require('request-promise-native')

const url = 'https://dhis2.eu.auth0.com/oauth/token'

const getM2MAuthToken = async () => {
    const payload = JSON.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_SECRET,
        audience: process.env.AUTH0_AUDIENCE,
        grant_type: 'client_credentials',
    })
    console.log(payload)
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

const getManagementAuthToken = async () => {
    const payload = JSON.stringify({
        client_id: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
        client_secret: process.env.AUTH0_MANAGEMENT_SECRET,
        audience: process.env.AUTH0_MANGAGEMENT_AUDIENCE,
        grant_type: 'client_credentials',
    })

    const tokenResponse = await request.post({
        url,
        headers: { 'content-type': 'application/json' },
        body: payload,
    })

    return JSON.parse(tokenResponse).access_token
}

module.exports = {
    getM2MAuthToken,
    getManagementAuthToken,
}
