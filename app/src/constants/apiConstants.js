
export const API_BASE_URL = 'http://localhost:8080/dhis-appstore/api/';
export const AUTH_REDIRECT_URL = 'http://localhost:8080/user';
export const BASE_APP_NAME = 'dhis-appstore';

export const appTypesToUI = {
    APP_STANDARD: 'Standard',
    APP_DASHBOARD: 'Dashboard',
    APP_TRACKER_DASHBOARD: 'Tracker Dashboard'
}

export const appStatusToUI = {
    NOT_APPROVED: 'Rejected',
    PENDING: 'Pending',
    APPROVED: 'Approved',
}

export const appSchema = {
    appName: '',
    description: '',
    developer: {
        developerName: '',
        developerEmail: ''
    },
    versions: [{version: '',
        minDhisVersion: '',
        maxDhisVersion: ''
    }]

}

export const DHISVersions = ['2.26', '2.25', '2.24', '2.23', '2.22', '2.21'];

export const AUTH0ClientId = 'BTJ3iwPLO6hDC5w7JYWPlGd6461VNu81';
export const AUTH0Domain = 'dhis2.eu.auth0.com';
