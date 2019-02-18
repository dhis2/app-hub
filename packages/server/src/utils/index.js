const AWS = require('aws-sdk')
var fs = require('fs')

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


class AppFileHandler {

}
class AWSFileHandler extends AppFileHandler {
    constructor(region, bucketName) {
        super()
        this.region = region
        this.bucketName = bucketName
        this._s3api = null;
    }

    get api() {
        if ( this._s3api === null ) {
            this._s3api = new AWS.S3({
                apiVersion: '2006-03-01',
                region: this.region
            });
        }
        return this._s3api
    }

    generateKey(path, filename) {
        return `${path}/${filename}`
    }

    saveFile(path, filename, buffer) {
        console.log(`Uploading file to ${this.bucketName} :: ${path}/${filename}`)
        const objectParams = {
            Bucket: this.bucketName, 
            Key: this.generateKey(path, filename),
            Body: buffer
        }
        return this.api.putObject(objectParams).promise()
    }

    getFile(path, filename) {
        return this.api.getObject({
            Bucket: this.bucketName, 
            Key: this.generateKey(path, filename)
        }).promise()
    }

    deleteFile(path, filename) {
        return this.api.deleteObject({
            Bucket: this.bucketName, 
            Key: this.generateKey(path, filename)
        }).promise()
    }
}

module.exports = {
    flatten, AWSFileHandler
}
