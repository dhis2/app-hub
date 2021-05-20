import { joinUrlPath, queryParametersToQueryString } from './utils'

const defaultFetchOptions = {
    method: 'GET',
}

export default class AppHubAPI {
    /**
     * @param {*} apiOptions
     * @param {*} apiOptions.baseUrl baseUrl to use
     * @param {*} apiOptions.apiVersion apiVersion to use, appended to baseUrl
     * @param {AuthService} apiOptions.auth AuthService-instance with getAccessToken function set.
     * @param {*} fetchOptions default options passed to fetch

     */
    constructor(apiOptions, fetchOptions = defaultFetchOptions) {
        const { baseUrl, apiVersion, auth } = apiOptions
        this.apiUrl = joinUrlPath(baseUrl, apiVersion)
        this.defaultFetchOptions = fetchOptions
        this.auth = auth
    }

    async getAuthHeaders() {
        const headers = {}
        const accessToken = await this.auth.getAccessToken()
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

        if (params && Object.keys(params).length > 0) {
            url = `${url}?${queryParametersToQueryString(params)}`
        }

        const response = await fetch(url, options)
        const contentType = response.headers.get('content-type')
        const isJson = contentType.includes('application/json')
        if (!response.ok) {
            if (isJson) {
                const json = await response.json()
                throw new Error(json.message || json.error)
            }
            throw new Error(response.statusText)
        }
        return await (isJson ? response.json() : response.text())
    }
}
