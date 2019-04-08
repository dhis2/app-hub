

function flatten(arr, result = []) {
    for (let i = 0, length = arr.length; i < length; i++) {
        const value = arr[i]

        if (Array.isArray(value)) {
            flatten(value, result)
        } else {
            result.push(value)
        }
    }

    return result
}

const getCurrentUserFromRequest = (request, knex) => {

    let user = null

    if ( request !== null && request.auth !== null && request.auth.credentials !== null ) {
        user = {
            id: request.auth.credentials.userId,
            email: request.auth.credentials.email,
            uuid: request.auth.credentials.uuid
        }
    }

    return user
}

const createBackingStorageInstance = require('./createBackingStorageInstance')

const saveFile = (path, filename, buffer) => createBackingStorageInstance().saveFile(path, filename, buffer)
const getFile = (path, filename) => createBackingStorageInstance().getFile(path, filename)
const deleteFile = (path, filename) => createBackingStorageInstance().deleteFile(path, filename)
const deleteDir = (path) => createBackingStorageInstance().deleteDir(path)

module.exports = {
    flatten, 
    getCurrentUserFromRequest,
    saveFile,
    getFile,
    deleteFile,
    deleteDir
}