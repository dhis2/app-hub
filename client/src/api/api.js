import config from '../../config'
import AuthService from '../utils/AuthService'
import AppHubAPI from './AppHubAPI'

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

// This hack is needed to prevent Auth0-Lock to initialize which sends requests that hang in test
export let Auth
if (process.NODE_ENV !== 'test') {
    Auth = new AuthService(config.auth0.clientID, config.auth0.domain)
} else {
    Auth = {}
}

const apiV2 = new AppHubAPI({
    baseUrl: config.api.baseURL,
    apiVersion: 'v2',
    auth: Auth,
})

export function getAllApps() {
    return fromApi('v1/apps/all', true)
}

export function getApprovedApps() {
    return fromApi('v1/apps?channel=All')
}

export function getApp(appId, auth) {
    return fromApi('v1/apps/' + appId, auth || false)
}

export function getUser() {
    return fromApi('v1/users/me', true)
}

export function getUserApps() {
    return fromApi('v1/apps/myapps', true)
}

export function setAppApproval(appId, status) {
    return fromApi(
        'v1/apps/' + appId + '/approval?status=' + status,
        true,
        postOpts
    )
}

export function createApp(payload) {
    return fromApi('v1/apps', true, createAppUploadOptions(payload))
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

export function fromApi(url, auth = false, extraOpts) {
    const headers = getAuthHeaders()

    const opts = { ...baseOptions, ...extraOpts }
    if (auth && opts.headers) {
        opts.headers = { ...headers, ...opts.headers }
    } else if (auth) {
        opts.headers = headers
    }

    return fetch(baseURL + url, opts)
        .then(response => (response.ok ? response : Promise.reject(response)))
        .then(response => response.json())
}

export function getAuthHeaders() {
    const headers = {}
    headers['Authorization'] = 'Bearer ' + Auth.getToken()
    return headers
}

export function createAppUploadOptions(data) {
    const fileInput = data.file
    const imageInput = data.image
    const form = new FormData()
    form.append('file', fileInput, fileInput.name)
    form.append('app', JSON.stringify(data.app))
    if (imageInput && imageInput.name) {
        form.append('imageFile', imageInput, imageInput.name)
    }

    const fetchOptions = {
        method: 'POST',
        body: form,
    }
    return fetchOptions
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
        maxDhisVersion: version.maxDhisVersion || null,
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

export function getAllChannels() {
    return apiV2.request('channels')
}

export function searchOrganisations(name) {
    return apiV2.request('organisations', {
        params: {
            name: `ilike:%${name}%`,
        },
    })
}

export function getMe() {
    return apiV2.request('me', { useAuth: true })
}

export function getOrganisations(filters) {
    return apiV2.request('organisations', { params: filters })
}

export function getOrganisation(orgId) {
    return apiV2.request(`organisations/${orgId}`, { useAuth: true })
}

export function addOrganisationMember(orgId, email) {
    return apiV2.request(
        `organisations/${orgId}/user`,
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
