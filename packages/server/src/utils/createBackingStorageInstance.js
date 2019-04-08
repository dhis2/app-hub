const AWSFileHandler = require('./AWSFileHandler')
const LocalFileSystemHandler = require('./LocalFileSystemHandler')

/**
 * Factory function returning an instance of the backing file storage to be used
 */
const createBackingStorageInstance = () => {

    if ( process.env.AWS_ACCESS_KEY_ID
        && process.env.AWS_REGION
        && process.env.AWS_SECRET_ACCESS_KEY
        && process.env.AWS_BUCKET_NAME ) {
        //if all AWS config is provided use AWS S3 bucket
        return new AWSFileHandler(process.env.AWS_REGION, process.env.AWS_BUCKET_NAME)
    }

    //otherwise use local filesystem
    return new LocalFileSystemHandler()
}

module.exports = createBackingStorageInstance

