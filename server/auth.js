const Auth0ManagementClient = require('auth0').ManagementClient

const client = new Auth0ManagementClient({
    domain: 'dhis2.eu.auth0.com',
    clientId: 'K4fVnj443Sqid3Xl9yBVTYw9BEjPx3gl',
    clientSecret:
        'NM_QKgyzshjVf6bRclF3o5_4t4cMxzgWVdP-65SpfJ5voDvop9NyMzpzfgxU8zno',
    scope: 'read:users',
})

const getUserInfo = async () => {
    const userInfo = await client.getUser({
        id: 'google-oauth2|113670017457105817746',
    })
    console.log(userInfo)
}

getUserInfo()
