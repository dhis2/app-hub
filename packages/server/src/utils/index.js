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

const createBackingStorageInstance = require('./createBackingStorageInstance')

const saveFile = (path, filename, buffer) =>
    createBackingStorageInstance().saveFile(path, filename, buffer)
const getFile = (path, filename) =>
    createBackingStorageInstance().getFile(path, filename)
const deleteFile = (path, filename) =>
    createBackingStorageInstance().deleteFile(path, filename)
const deleteDir = path => createBackingStorageInstance().deleteDir(path)

module.exports = {
    flatten,
    saveFile,
    getFile,
    deleteFile,
    deleteDir,
}
