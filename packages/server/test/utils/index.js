
const { expect } = require('code')
const { lab } = require('../index')

const { it, describe } = lab

const { AWSFileHandler, flatten } = require('@utils')

describe('@utils::AWSFileHandler', () => {

    const region = 'my-region'
    const bucket = 'a-bucket'
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

        const arr = [[1,2], [3,4]]
        const expected = [1,2,3,4]

        const flat = flatten(arr)

        expect(flat).to.be.an.array()

        flat.every((val, i) => {

            expect(val).to.equal(expected[i])
        })
    })

    it('should flatten 1 and 2 mixed -dimensional array', () => {

        const arr = [1, 2, [3,4], 5, 6]
        const expected = [1, 2, 3, 4, 5, 6]

        const flat = flatten(arr)

        expect(flat).to.be.an.array()

        flat.every((val, i) => {

            expect(val).to.equal(expected[i])
        })
    })
})