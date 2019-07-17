const debug = require('debug')('appstore:server:utils:AWSFileHandler')
const AWS = require('aws-sdk')

/**
 * Store files in an AWS S3 bucket
 */
module.exports = class AWSFileHandler {
    constructor(region, bucketName) {
        this.region = region
        this.bucketName = bucketName
        this._s3api = null
    }

    get api() {
        if (this._s3api === null) {
            this._s3api = new AWS.S3({
                apiVersion: '2006-03-01',
                region: this.region,
            })
        }

        return this._s3api
    }

    generateKey(path, filename) {
        return `${path}/${filename}`
    }

    saveFile(path, filename, buffer) {
        debug(`Uploading file to ${this.bucketName} :: ${path}/${filename}`)
        const objectParams = {
            Bucket: this.bucketName,
            Key: this.generateKey(path, filename),
            Body: buffer,
        }
        return this.api.putObject(objectParams).promise()
    }

    /**
     * Downloads the binary data for a file
     * @param {*} path
     * @param {*} filename
     */
    getFile(path, filename) {
        return this.api
            .getObject({
                Bucket: this.bucketName,
                Key: this.generateKey(path, filename),
            })
            .promise()
    }

    /**
     * Deletes a single file with the specified path and filename
     * @param {*} path
     * @param {*} filename
     */
    deleteFile(path, filename) {
        return this.api
            .deleteObject({
                Bucket: this.bucketName,
                Key: this.generateKey(path, filename),
            })
            .promise()
    }

    async deleteDir(path) {
        const objectsInPath = await this.api
            .listObjectsV2({ Bucket: this.bucketName, Prefix: path })
            .promise()

        if (objectsInPath.Contents.length === 0) {
            await this.api
                .deleteObject({
                    Bucket: this.bucketName,
                    Key: path,
                })
                .promise()
        } else {
            const deleteParams = {
                Bucket: this.bucketName,
                Delete: {
                    Objects: [],
                },
            }

            objectsInPath.Contents.forEach(obj => {
                debug('Will try to delete: ', obj.Key)
                deleteParams.Delete.Objects.push({ Key: obj.Key })
            })

            await this.api.deleteObjects(deleteParams).promise()

            if (objectsInPath.IsTruncated) {
                debug('Did not get all objects first time, call it again')
                await this.deleteDir(path)
            }
        }
    }
}
