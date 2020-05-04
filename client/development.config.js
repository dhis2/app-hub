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
    ui: {
        dhisVersions: ['2.34', '2.33', '2.32', '2.31', '2.30', '2.29', '2.28'],
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
