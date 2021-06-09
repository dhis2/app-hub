export default class AuthService {
    setProfile(profile) {
        localStorage.setItem('profile', JSON.stringify(profile))
    }

    getProfile() {
        return localStorage.getItem('profile')
    }

    getAccessTokenSilently() {
        throw new Error(
            'Should not be called before overidden by setAccessTokenSilentlyFunc'
        )
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
