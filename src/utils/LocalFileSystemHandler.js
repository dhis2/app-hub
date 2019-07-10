const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')

/**
 * Store files in local file system (app-store/upload)
 */
module.exports = class LocalFileSystemHandler {
    constructor(uploadPath) {
        this._uploadDirectory = path.normalize(
            __dirname + (uploadPath || '/../../upload')
        ) //app-store/upload if no other is provided
        this.createDirectoryIfNotExists(this._uploadDirectory)
    }

    get directory() {
        return this._uploadDirectory
    }

    createDirectoryIfNotExists(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true, mode: '0744' })
        }
    }

    saveFile(directoryPath, filename, buffer) {
        return new Promise((resolve, reject) => {
            try {
                this.verifyPath(directoryPath)
                this.createDirectoryIfNotExists(
                    path.join(this._uploadDirectory, directoryPath)
                )
            } catch (err) {
                reject(err)
                return
            }

            fs.writeFile(
                path.join(this._uploadDirectory, directoryPath, filename),
                buffer,
                err => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                }
            )
        })
    }

    /**
     * Downloads the binary data for a file
     * @param {*} directoryPath
     * @param {*} filename
     */
    getFile(directoryPath, filename) {
        return new Promise((resolve, reject) => {
            try {
                this.verifyPath(directoryPath)
            } catch (err) {
                reject(err)
                return
            }

            fs.readFile(
                path.join(this._uploadDirectory, directoryPath, filename),
                (err, data) => {
                    if (err) {
                        reject(err)
                    } else {
                        //use the same format as AWS api, setting the file contents to the Body property
                        resolve({ Body: data })
                    }
                }
            )
        })
    }

    /**
     * Deletes a single file with the specified path and filename
     * @param {*} directoryPath
     * @param {*} filename
     */
    deleteFile(directoryPath, filename) {
        return new Promise((resolve, reject) => {
            try {
                this.verifyPath(directoryPath)
            } catch (err) {
                reject(err)
                return
            }

            fs.unlink(
                path.join(this._uploadDirectory, directoryPath, filename),
                err => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                }
            )
        })
    }

    deleteDir(directoryPath) {
        return new Promise((resolve, reject) => {
            try {
                this.verifyPath(directoryPath)
            } catch (err) {
                reject(err)
                return
            }

            rimraf(path.join(this._uploadDirectory, directoryPath), err => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

    verifyPath(directoryPath) {
        const fullPath = path.join(this._uploadDirectory, directoryPath)
        const normalized = path.normalize(fullPath)

        //Check that we're trying to use a path within/below the upload root
        if (normalized.indexOf(this._uploadDirectory) !== 0) {
            throw new Error('Invalid directory')
        }
    }
}
