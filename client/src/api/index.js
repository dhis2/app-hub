import useSWR from 'swr'
import AuthService from '../utils/AuthService'
import AppHubAPI from './AppHubAPI'
import config from 'config'

const baseURL = config.api.baseURL

const baseOptions = {
    method: 'GET',
}
const postOpts = {
    method: 'POST',
}

const deleteOpts = {
    method: 'DELETE',
}

const updateOpts = {
    method: 'PUT',
    headers: {
        'content-type': 'application/json',
    },
}

export const Auth = new AuthService()

export const apiV2 = new AppHubAPI({
    baseUrl: config.api.baseURL,
    apiVersion: 'v2',
    auth: Auth,
})

export const useQuery = (url, params, requestOpts) =>
    useSWR([url, params, requestOpts], (url, params, requestOpts) =>
        apiV2.request(url, { ...requestOpts, params })
    )

export const useQueryV1 = (url, options = { auth: false }) =>
    useSWR([url, options.auth], (url, auth) => fromApi(`v1/${url}`, auth))

export function getUser() {
    return fromApi('v1/users/me', true)
}

export function setAppApproval(appId, status) {
    return fromApi(
        'v1/apps/' + appId + '/approval?status=' + status,
        true,
        postOpts
    )
}

export function createApp({ file, logo, app }) {
    const form = new FormData()
    form.append('file', file, file.name)
    form.append('app', JSON.stringify(app))
    form.append('logo', logo, logo.name)

    return fromApi('v1/apps', true, {
        method: 'POST',
        body: form,
    })
}

export function createNewVersion(appId, payload) {
    return fromApi(
        'v1/apps/' + appId + '/versions',
        true,
        createUploadVersionOptions(payload)
    )
}

export function createNewImage(appId, payload) {
    return fromApi(
        'v1/apps/' + appId + '/images',
        true,
        createUploadImageOptions(payload)
    )
}
export function deleteVersion(appId, versionId) {
    return fromApi(
        'v1/apps/' + appId + '/versions/' + versionId,
        true,
        deleteOpts
    )
}
export function updateVersion(appId, versionId, payload) {
    return fromApi(`v1/apps/${appId}/versions/${versionId}`, true, {
        ...baseOptions,
        ...updateOpts,
        body: JSON.stringify(payload),
    })
}

export function deleteApp(appId) {
    return fromApi('v1/apps/' + appId, true, deleteOpts)
}

export function deleteImage(appId, imageId) {
    return fromApi('v1/apps/' + appId + '/images/' + imageId, true, deleteOpts)
}

export function updateApp(appId, payload) {
    return fromApi('v1/apps/' + appId, true, {
        ...baseOptions,
        ...updateOpts,
        body: JSON.stringify(payload),
    })
}

export function updateImage(appId, imageId, payload) {
    return fromApi('v1/apps/' + appId + '/images/' + imageId, true, {
        ...baseOptions,
        ...updateOpts,
        body: JSON.stringify(payload),
    })
}

export function createReview(appId, payload) {
    return fromApi(`v1/apps/${appId}/reviews`, true, {
        ...baseOptions,
        ...postOpts,
        body: JSON.stringify(payload),
    })
}

export function deleteReview(appId, reviewId) {
    return fromApi(`v1/apps/${appId}/reviews/${reviewId}`, true, deleteOpts)
}

export async function fromApi(url, auth = false, extraOpts) {
    const opts = { ...baseOptions, ...extraOpts }
    if (auth) {
        const authHeaders = await getAuthHeaders()
        opts.headers = { ...opts.headers, ...authHeaders }
    }

    return fetch(baseURL + url, opts)
        .then(async response => {
            if (!response.ok) {
                const contentType = response.headers.get('content-type')
                const isJson = contentType.includes('application/json')
                if (isJson) {
                    const json = await response.json()
                    throw new Error(json.message || json.error)
                }
                throw new Error(response.statusText)
            }
            return response
        })
        .then(response => response.json())
}

export async function getAuthHeaders() {
    const headers = {}
    const accessToken = await Auth.getAccessToken()
    headers['Authorization'] = 'Bearer ' + accessToken
    return headers
}

/**
 *
 * @param data - An object containing the data to create optiosn for
 * @param data.version - Object with the nested jsonpart of the request
 * @param data.file - The file to upload
 * @returns fetchOptions to be used in fetch
 */

export function createUploadVersionOptions(data) {
    const version = data.version
    const jsonData = {
        version: version.version,
        minDhisVersion: version.minDhisVersion || null,
        maxDhisVersion: version.maxDhisVersion || '',
        demoUrl: version.demoUrl || null,
        channel: version.channel,
    }
    const dataFile = data.file
    const form = new FormData()

    form.append('file', dataFile, dataFile.name)
    form.append('version', JSON.stringify(jsonData))

    const fetchOptions = {
        method: 'POST',
        body: form,
    }
    return fetchOptions
}

export function createUploadImageOptions(data) {
    const image = data.image
    const jsonData = {
        caption: image.caption || null,
        description: image.description || null,
        logo: image.logo || false,
    }
    const dataFile = data.file
    const form = new FormData()

    form.append('file', dataFile, dataFile.name)
    form.append('image', JSON.stringify(jsonData))

    const fetchOptions = {
        method: 'POST',
        body: form,
    }
    return fetchOptions
}

export function getMe() {
    return apiV2.request('me', { useAuth: true })
}

export function addOrganisationMember(orgId, email) {
    return apiV2.request(
        `organisations/${orgId}/invitation`,
        { useAuth: true },
        {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: {
                'content-type': 'application/json',
            },
        }
    )
}

export function acceptOrganisationInvitation(token) {
    return apiV2.request(
        `organisations/invitation/${token}`,
        { useAuth: true },
        { method: 'POST' }
    )
}

export function removeOrganisationMember(orgId, user) {
    return apiV2.request(
        `organisations/${orgId}/user`,
        { useAuth: true },
        {
            method: 'DELETE',
            body: JSON.stringify({ user }),
            headers: {
                'content-type': 'application/json',
            },
        }
    )
}

export function addOrganisation({ name, email }) {
    return apiV2.request(
        `organisations/`,
        { useAuth: true },
        {
            method: 'POST',
            body: JSON.stringify({ name, email }),
            headers: {
                'content-type': 'application/json',
            },
        }
    )
}

export function editOrganisation(id, { name, owner, email }) {
    return apiV2.request(
        `organisations/${id}`,
        {
            useAuth: true,
        },
        {
            method: 'PATCH',
            body: JSON.stringify({ name, owner, email }),
            headers: {
                'content-type': 'application/json',
            },
        }
    )
}

export function generateApiKey() {
    return apiV2.request(
        'key',
        { useAuth: true },
        {
            method: 'POST',
        }
    )
}

export function deleteApiKey() {
    return apiV2.request(
        'key',
        { useAuth: true },
        {
            method: 'DELETE',
        }
    )
}
