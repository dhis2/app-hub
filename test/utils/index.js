const { expect, fail } = require('code')

const { lab } = (exports.lab = require('../index'))

const { it, describe } = lab

const { flatten } = require('../../src/utils')

describe('@utils::AWSFileHandler', () => {
    const region = 'my-region'
    const bucket = 'a-bucket'

    const AWSFileHandler = require('../../src/utils/AWSFileHandler')
    const fileHandler = new AWSFileHandler(region, bucket)

    it('should generate a key combined with a /', () => {
        const key = fileHandler.generateKey('a', 'b')
        expect(key).to.equal('a/b')
    })

    it('should return an instance of AWS.S3 using apiVersion 2006-03-01 and region as instansiated ', () => {
        const api = fileHandler.api

        expect(api.config.apiVersion).to.equal('2006-03-01')
        expect(api.config.region).to.equal(region)
    })
})

describe('@utils::flatten', () => {
    it('should flatten 2-dimensional array', () => {
        const arr = [[1, 2], [3, 4]]
        const expected = [1, 2, 3, 4]

        const flat = flatten(arr)

        expect(flat).to.be.an.array()

        flat.every((val, i) => {
            expect(val).to.equal(expected[i])
        })
    })

    it('should flatten 1 and 2 mixed -dimensional array', () => {
        const arr = [1, 2, [3, 4], 5, 6]
        const expected = [1, 2, 3, 4, 5, 6]

        const flat = flatten(arr)

        expect(flat).to.be.an.array()

        flat.every((val, i) => {
            expect(val).to.equal(expected[i])
        })
    })
})

describe('@utils::LocalFileSystemHandler', () => {
    const LocalFileSystemHandler = require('../../src/utils/LocalFileSystemHandler')

    it('should contain the same contents on disk after upload as the original', async () => {
        const path = require('path')
        const fs = require('fs')

        const handler = new LocalFileSystemHandler()
        const testFile = path.join(__dirname, 'testfile.json')

        const testFileBuffer = await fs.promises.readFile(testFile)

        try {
            const destinationFilename = 'the-uploaded-file.json'
            const destinationPath = 'test-directory'

            //save the file
            await handler.saveFile(
                destinationPath,
                destinationFilename,
                testFileBuffer
            )

            //then compare it to the original
            const uploadedFileData = await fs.promises.readFile(
                path.join(
                    handler.directory,
                    destinationPath,
                    destinationFilename
                )
            )
            expect(uploadedFileData.toString()).to.equal(
                testFileBuffer.toString()
            )
        } catch (err) {
            fail(
                `should not get an error saving file to disk, got error: ${err.message}`
            )
        }
    })

    it('should throw an error if trying to save a file outside the upload root directory', async () => {
        const handler = new LocalFileSystemHandler()

        await expect(
            handler.saveFile('../whatever', 'file', Buffer.from('foobar'))
        ).to.reject(Error)
    })

    it('should not allow getting a file outside of the upload directory root', async () => {
        const handler = new LocalFileSystemHandler()

        await expect(handler.getFile('/etc', 'passwd')).to.reject(Error)
    })
})
