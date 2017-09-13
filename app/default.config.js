module.exports = {
    api: {
        baseURL: "https://play.dhis2.org/appstore/api/",
        redirectURL: "https://play.dhis2.org/appstore/user"
    },
    auth0: {
        clientID: "BTJ3iwPLO6hDC5w7JYWPlGd6461VNu81",
        domain: "dhis2.eu.auth0.com"
    },
    routes: {
        baseAppName: "/appstore"
    },
    ui: {
        dhisVersions: [
            "2.28",
            "2.27",
            "2.26",
            "2.25",
            "2.24",
            "2.23",
            "2.22",
            "2.21"
        ],
        appStatusToDisplayName: {
            NOT_APPROVED: "Rejected",
            PENDING: "Pending",
            APPROVED: "Approved"
        },
        appTypeToDisplayName: {
            APP_STANDARD: "Standard",
            APP_DASHBOARD: "Dashboard",
            APP_TRACKER_DASHBOARD: "Tracker Dashboard"
        }
    }
};
