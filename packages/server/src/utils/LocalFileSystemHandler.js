
const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf');

/**
 * Store files in local file system (app-store/packages/server/upload)
 */
module.exports = class LocalFileSystemHandler {

    constructor() {
        this._uploadDirectory = __dirname + '/../../upload' //app-store/packages/server/upload
        this.createDirectoryIfNotExists(this._uploadDirectory)
    }

    get directory() {
        return this._uploadDirectory
    }

    createDirectoryIfNotExists(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true, mode: '0744' });
        }
    }


    saveFile(directoryPath, filename, buffer) {
        return new Promise((resolve, reject) => {
            try {
                this.verifyPath(directoryPath)
                this.createDirectoryIfNotExists(path.join(this._uploadDirectory, directoryPath))
            } catch ( err ) {
                reject(err)
                return
            }
            
            fs.writeFile(path.join(this._uploadDirectory, directoryPath, filename), buffer, (err) => {
                if ( err ) {
                    reject(err)
                } else {
                    resolve()
                }
            })
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
            } catch ( err ) {
                reject(err)
                return
            }

            fs.readFile(path.join(this._uploadDirectory, directoryPath, filename), (err, data) => {
                if ( err ) {
                    console.log(err)
                    reject(err)
                } else {
                    resolve({ Body:data })
                }
            })
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
            } catch ( err ) {
                reject(err)
                return
            }

            fs.unlink(path.join(directoryPath, filename), (err) => {
                if ( err ) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

    deleteDir(directoryPath) {
        return new Promise((resolve, reject) => {
            try {
                this.verifyPath(directoryPath)
            } catch ( err ) {
                reject(err)
                return
            }

            rimraf(path.join(this._uploadDirectory, directoryPath), (err) => {
                if ( err ) { 
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

    verifyPath(directoryPath) {
        if ( directoryPath.indexOf('..') !== -1 ) {
            throw new Error('Relative paths not allowed')
        }

        if ( directoryPath.indexOf('~') === 0 ) {
            throw new Error('Tilde not allowed in directoryPath')   //avoid reading from current user directory
        }

        if ( directoryPath.indexOf('/') === 0 ) {
            throw new Error('Absolute paths not allowed')   //not allowed at the moment at least.
        }
    }
}
