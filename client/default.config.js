module.exports = {
    api: {
        baseURL: '/api/',
    },
    auth0: {
        audience: 'apps.dhis2.org/api',
        clientID: 'M7fOVRQlS4xI0Sf928IXXeLxBxRs4nQN',
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
        appChannelToDisplayName: {
            Stable: 'Stable',
            Development: 'Development',
            Canary: 'Canary',
        },
        defaultAppChannel: 'Stable'
    },
}
