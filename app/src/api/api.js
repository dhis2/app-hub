import * as apiConstants from '../constants/apiConstants';
import { getAuth } from '../utils/AuthService';


const baseURL = apiConstants.API_BASE_URL;

const baseOptions = {
    credentials: 'include',
    method: 'GET'
}
const postOpts = {
    method: 'POST'
}

const deleteOpts = {
    method: 'DELETE'
}

export function getAllApps() {
    return fromApi('apps/all', true);
}

export function getApprovedApps() {
    return fromApi('apps')
}

export function getApp(appId) {
    return fromApi('apps/'+appId);
}

export function getUser() {
    return fromApi('users/me', true);
}

export function getUserApps() {
    return fromApi('apps/myapps', true)
}

export function setAppApproval(appId, status) {
    return fromApi('apps/'+appId+'/approval?status='+status, true, postOpts )
}

export function createApp(payload) {
    return fromApi('apps/', true, createAppUploadOptions(payload))
}

export function createNewVersion(appId, payload) {
    return fromApi('apps/'+appId+'/versions', true, createUploadVersionOptions(payload));
}

export function deleteVersion(appId, versionId) {
    return fromApi('apps/'+appId+'/versions/'+versionId, true, deleteOpts);
}

export function deleteApp(appId) {
    return fromApi('apps/'+appId, true, deleteOpts);
}


function fromApi(url, auth = false, extraOpts) {
    const headers = getAuthHeaders();
    const opts =  auth ? {headers, ...baseOptions, ...extraOpts} : {...baseOptions, ...extraOpts};
    console.log(opts)
    return fetch(baseURL+url,opts)
        .then(response => response.ok ? response : Promise.reject(response))
        .then(response => response.json())
}



function getAuthHeaders() {
    const headers = {};
    return headers['Authorization'] = 'Bearer ' + getAuth().getToken();
}



export function createAppUploadOptions(data) {
    const fileInput = data.file;
    const imageInput = data.image;
    let form = new FormData();
    const file = new Blob([fileInput], {type: 'multipart/form-data'})
    const image = new Blob([imageInput], {type: 'multipart/form-data'})
    const app = new Blob([JSON.stringify(data.app)], {type: 'application/json'})

    form.append('file', file, fileInput.name)
    form.append('app', app);
    if(imageInput) {
        form.append('imageFile', image, imageInput.name);
    }


    const fetchOptions = {
        credentials: 'include',
        method: 'POST',
        body: form
    };
    return fetchOptions;
}

/**
 *
 * @param data - An object containing the data to create optiosn for
 * @param data.version - Object with the nested jsonpart of the request
 * @param data.file - The file to upload
 * @returns fetchOptions to be used in fetch
 */

export function createUploadVersionOptions(data) {
    //validateAddVersion(data)
    const version = data.version;
    const jsonData = {
        version: version.version,
        minDhisVersion: version.minDhisVersion || null,
        maxDhisVersion: version.maxDhisVersion || null,

    }
    const dataFile = data.file;
    let form = new FormData();
    const file = new Blob([dataFile], {type: 'multipart/form-data'})
    const app = new Blob([JSON.stringify(jsonData)], {type: 'application/json'})

    form.append('file', file, dataFile.name)
    form.append('version', app);

    const fetchOptions = {
        credentials: 'include',
        method: 'POST',
        body: form
    };
    return fetchOptions;
}


