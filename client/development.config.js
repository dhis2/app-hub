module.exports = {
    api: {
        baseURL: 'http://localhost:3000/api/',
    },
    auth0: {
        audience: 'apps.dhis2.org/api',
        clientID: 'M7fOVRQlS4xI0Sf928IXXeLxBxRs4nQN',
        clientIDOld: 'BTJ3iwPLO6hDC5w7JYWPlGd6461VNu81',
        domain: 'dhis2.eu.auth0.com',
    },
    routes: {
        baseAppName: '/',
    },
    ui: {
        dhisVersions: [
            '2.35',
            '2.34',
            '2.33',
            '2.32',
            '2.31',
            '2.30',
            '2.29',
            '2.28',
        ],
        appStatusToDisplayName: {
            NOT_APPROVED: 'Rejected',
            PENDING: 'Pending',
            APPROVED: 'Approved',
        },
        appTypeToDisplayName: {
            APP: 'Standard',
            DASHBOARD_WIDGET: 'Dashboard',
            TRACKER_DASHBOARD_WIDGET: 'Tracker Dashboard',
        },
    },
}
