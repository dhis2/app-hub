import { joinUrlPath, queryParametersToQueryString } from './utils'

const defaultFetchOptions = {
    method: 'GET',
}

export default class AppHubAPI {
    /**
     * @param {*} apiOptions
     * @param {*} apiOptions.baseUrl baseUrl to use
     * @param {*} apiOptions.apiVersion apiVersion to use, appended to baseUrl
     * @param {*} defaultFetchOptions default options passed to fetch
     */
    constructor(apiOptions, fetchOptions = defaultFetchOptions) {
        const { baseUrl, apiVersion } = apiOptions
        this.apiUrl = joinUrlPath(baseUrl, apiVersion)
        this.defaultFetchOptions = fetchOptions
    }

    async getAccessToken() {
        throw new Error('function should not be called before it is overidden.')
    }

    setAccessTokenFunc(func) {
        this.getAccessToken = func
    }

    async getAuthHeaders() {
        const headers = {}
        const accessToken = await this.getAccessToken()
        headers['Authorization'] = `Bearer ${accessToken}`
        return headers
    }
    /**
     *
     * @param {*} path url to fetch, apiUrl is prepended unless apiOptions.external is true
     * @param {*} apiOptions options
     * @param {*} apiOptions.external don't prepend apiUrl
     * @param {*} apiOptions.params query-parameters to include in the request
     * @param {*} apiOptions.useAuth send auth headers, using auth-object
     * @param {*} fetchOptions options passed to fetch
     */
    async request(
        path,
        { useAuth = false, external = false, params = {} } = {},
        fetchOptions
    ) {
        const options = {
            ...this.defaultFetchOptions,
            ...fetchOptions,
        }
        if (useAuth) {
            const authHeaders = await this.getAuthHeaders()
            options.headers = { ...options.headers, ...authHeaders }
        }

        const baseUrl = external ? '' : this.apiUrl
        let url = joinUrlPath(baseUrl, path)

        if (Object.keys(params).length > 0) {
            url = `${url}?${queryParametersToQueryString(params)}`
        }

        return fetch(url, options).then(response => {
            const contentType = response.headers.get('content-type')
            let result
            if (contentType.includes('application/json')) {
                result = response.json()
            } else {
                result = response.text()
            }
            return result.then(result =>
                response.ok ? Promise.resolve(result) : Promise.reject(result)
            )
        })
    }
}
