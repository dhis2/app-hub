import config from '../../../config'
import { getAuth } from '../utils/AuthService'

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

export function getAllApps() {
    return fromApi('apps/all', true)
}

export function getApprovedApps() {
    return fromApi('apps')
}

export function getApp(appId, auth) {
    return fromApi('apps/' + appId, auth || false)
}

export function getUser() {
    return fromApi('users/me', true)
}

export function getUserApps() {
    return fromApi('apps/myapps', true)
}

export function setAppApproval(appId, status) {
    return fromApi(
        'apps/' + appId + '/approval?status=' + status,
        true,
        postOpts
    )
}

export function createApp(payload) {
    return fromApi('apps', true, createAppUploadOptions(payload))
}

export function createNewVersion(appId, payload) {
    return fromApi(
        'apps/' + appId + '/versions',
        true,
        createUploadVersionOptions(payload)
    )
}

export function createNewImage(appId, payload) {
    return fromApi(
        'apps/' + appId + '/images',
        true,
        createUploadImageOptions(payload)
    )
}
export function deleteVersion(appId, versionId) {
    return fromApi('apps/' + appId + '/versions/' + versionId, true, deleteOpts)
}
export function updateVersion(appId, versionId, payload) {
    return fromApi(`apps/${appId}/versions/${versionId}`, true, {
        ...baseOptions,
        ...updateOpts,
        body: JSON.stringify(payload),
    })
}

export function deleteApp(appId) {
    return fromApi('apps/' + appId, true, deleteOpts)
}

export function deleteImage(appId, imageId) {
    return fromApi('apps/' + appId + '/images/' + imageId, true, deleteOpts)
}

export function updateApp(appId, payload) {
    return fromApi('apps/' + appId, true, {
        ...baseOptions,
        ...updateOpts,
        body: JSON.stringify(payload),
    })
}

export function updateImage(appId, imageId, payload) {
    return fromApi('apps/' + appId + '/images/' + imageId, true, {
        ...baseOptions,
        ...updateOpts,
        body: JSON.stringify(payload),
    })
}

export function createReview(appId, payload) {
    return fromApi(`apps/${appId}/reviews`, true, {
        ...baseOptions,
        ...postOpts,
        body: JSON.stringify(payload),
    })
}

export function deleteReview(appId, reviewId) {
    return fromApi(`apps/${appId}/reviews/${reviewId}`, true, deleteOpts)
}

export function fromApi(url, auth = false, extraOpts) {
    const headers = getAuthHeaders()
    if (auth && extraOpts) {
        extraOpts.headers = { ...headers, ...extraOpts.headers }
    } else if (auth) {
        extraOpts = { headers }
    }
    const opts = { ...baseOptions, ...extraOpts }
    return fetch(baseURL + url, opts)
        .then(response => (response.ok ? response : Promise.reject(response)))
        .then(response => response.json())
}

export function getAuthHeaders() {
    const headers = {}
    headers['Authorization'] = 'Bearer ' + getAuth().getToken()
    return headers
}

export function createAppUploadOptions(data) {
    const fileInput = data.file
    const imageInput = data.image
    const form = new FormData()
    const jsonPart = new Blob([JSON.stringify(data.app)], {
        type: 'application/json',
    })
    form.append('file', fileInput, fileInput.name)
    form.append('app', jsonPart)
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
    }
    const dataFile = data.file
    const form = new FormData()
    const jsonPart = new Blob([JSON.stringify(jsonData)], {
        type: 'application/json',
    })

    form.append('file', dataFile, dataFile.name)
    form.append('version', jsonPart)

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
    const jsonPart = new Blob([JSON.stringify(jsonData)], {
        type: 'application/json',
    })

    form.append('file', dataFile, dataFile.name)
    form.append('image', jsonPart)

    const fetchOptions = {
        method: 'POST',
        body: form,
    }
    return fetchOptions
}
