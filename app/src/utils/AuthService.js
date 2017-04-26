import Auth0Lock from 'auth0-lock'
import { isTokenExpired } from './jwtHelper';
import * as apiConstants from '../../config';
import { BrowserRouter } from 'react-router-dom';
import History from './history';
import * as constants from '../../config';
import store from '../store';
export default class AuthService {
    constructor(clientId, domain) {
        // Configure Auth0
        this.parsed = false;
        this.lock = new Auth0Lock(clientId, domain, {
            auth: {
                redirectUrl: constants.AUTH_REDIRECT_URL,
                responseType: 'token',
                params: {
                    scope: 'openid roles user_id',
                },

            }
        })
        this.lock.on('hash_parsed', () => this.parsed = true);
        // Add callback for lock `authenticated` event
        this.lock.on('authenticated', this._doAuthentication.bind(this))
        // binds login functions to keep this context
        this.login = this.login.bind(this)
    }

    _doAuthentication(authResult) {
        // Saves the user token
        this.setToken(authResult.idToken)
        store.dispatch({type: "USER_AUTHENTICATED"})
    }

    isHashParsed() {
        return this.parsed;
    }

    login() {
        // Call the show method to display the widget.
        this.lock.show()
    }

    isLoggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken();
        return !!token && !isTokenExpired(token);
    }

    isManager() {
        const profile = this.getProfile();
        if(profile) {
            return profile.roles.includes('ROLE_MANAGER');
        }
        return null;
    }

    setProfile(profile) {
        localStorage.setItem('profile', profile);
    }

    getProfile() {
        return localStorage.getItem('profile');
    }

    setToken(idToken) {
        // Saves user token to local storage
        localStorage.setItem('id_token', idToken)
    }

    setAccessToken(accessToken) {
        localStorage.setItem('access_token', accessToken);
    }

    getToken() {
        // Retrieves the user token from local storage
        return localStorage.getItem('id_token');
    }

    getAccessToken() {
        return localStorage.getItem(('access_token'));
    }

    logout() {
        // Clear user token and profile data from local storage
        localStorage.removeItem('id_token');
        History.push("/")
    }
}
let auth;
export function getAuth() {
    if (auth)
       return auth;

    auth = new AuthService(apiConstants.AUTH0ClientId, apiConstants.AUTH0Domain);
    return auth;
}