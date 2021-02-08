const defaultConfig = require('./default.config')

module.exports = {
    api: {
        baseURL: 'http://localhost:3000/api/',
    },
    auth0: {
        clientID: 'BTJ3iwPLO6hDC5w7JYWPlGd6461VNu81',
        domain: 'dhis2.eu.auth0.com',
    },
    routes: {
        baseAppName: '/',
    },
    ui: defaultConfig.ui
}
