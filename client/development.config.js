const defaultConfig = require('./default.config')

module.exports = {
    api: {
        baseURL: 'http://localhost:3000/api/',
    },
    auth0: {
        audience: 'apps.dhis2.org/api',
        clientID: 'M7fOVRQlS4xI0Sf928IXXeLxBxRs4nQN',
        domain: 'dhis2.eu.auth0.com',
    },
    routes: {
        baseAppName: '/',
    },
    ui: defaultConfig.ui
}
