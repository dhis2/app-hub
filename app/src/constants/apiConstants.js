
export const API_BASE_URL = 'localhost:3099/api/'

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


export const AUTH0ClientId = '';
export const AUTH0Domain = '';
