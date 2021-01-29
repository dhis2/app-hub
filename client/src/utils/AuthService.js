import Zero from 'auth0-lock'
import { isTokenExpired } from './jwtHelper'
import History from './history'
import store from '../store'
import Theme from '../styles/theme'
import logo from '../assets/img/dhis2.svg'

export default class AuthService {
    
    login() {
        // Call the show method to display the widget.
        this.lock.show()
    }

    isLoggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken()
        return !!token && !isTokenExpired(token)
    }

    setProfile(profile) {
        localStorage.setItem('profile', JSON.stringify(profile))
    }

    getProfile() {
        return localStorage.getItem('profile')
    }

    getAccessTokenSilently() {
        throw new Error('Should not be called before overidden by setAccessTokenSilentlyFunc')
    }

    setAccessTokenFunc(func) {
        this.getAccessTokenSilently = func 
    }

    async getAccessToken() {
        return this.getAccessTokenSilently()
    }

    logout() {
        // Clear user token and profile data from local storage
        localStorage.removeItem('profile')
    }
}
