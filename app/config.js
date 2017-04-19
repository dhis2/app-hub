
//used when NODE_ENV is 'development'
const dev = {
    BASE_APP_NAME: '',
    API_BASE_URL: 'http://localhost:3098/api/',
    API_REDIRECT_URL: 'http://localhost:9000/user',
}

//used when NODE_ENV is not 'development'
const prod = {

    /* Basename for routes.
    If this app is hosted at http://hostname/app this should be '/app' */
    BASE_APP_NAME: '/dhis-appstore',

    /* Base URL for the API.
       Should be absolute path to the api endpoint.
       Note the trailing '/' */
    API_BASE_URL: 'http://localhost:8080/dhis-appstore/api/',

    /* Redirect URL to use by auth0, note that you need to allow this url
       on the auth0 side as well. */
    API_REDIRECT_URL: 'http://localhost:8080/dhis-appstore/user',

}

//Map to Translate API names to display-names
export const appTypesToUI = {
    APP_STANDARD: 'Standard',
    APP_DASHBOARD: 'Dashboard',
    APP_TRACKER_DASHBOARD: 'Tracker Dashboard'
}

//Map to translate API status of apps to display-names
export const appStatusToUI = {
    NOT_APPROVED: 'Rejected',
    PENDING: 'Pending',
    APPROVED: 'Approved',
}

export const DHISVersions = ['2.26', '2.25', '2.24', '2.23', '2.22', '2.21'];

export const AUTH0ClientId = 'BTJ3iwPLO6hDC5w7JYWPlGd6461VNu81';
export const AUTH0Domain = 'dhis2.eu.auth0.com';


export const API_BASE_URL = process.env.NODE_ENV === 'development' ?
    dev.API_BASE_URL: prod.API_BASE_URL;

export const AUTH_REDIRECT_URL = process.env.NODE_ENV === 'development' ?
    dev.API_REDIRECT_URL : prod.API_REDIRECT_URL;

export const BASE_APP_NAME = process.env.NODE_ENV === 'development' ?
    dev.BASE_APP_NAME : prod.BASE_APP_NAME;

