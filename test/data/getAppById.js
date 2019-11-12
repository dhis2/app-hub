const Lab = require('@hapi/lab')

// prepare environment
const { it, describe } = (exports.lab = Lab.script())

const { expect } = require('@hapi/code')

const knexConfig = require('../../knexfile')
const db = require('knex')(knexConfig)

describe('@data::getAppById', () => {
    const getAppById = require('../../src/data/getAppById')

    it('should require the appId parameter', async () => {
        await expect(getAppById(undefined, 'en', db)).to.reject(
            Error,
            `Missing parameter 'appId'`
        )
    })

    it('should require the languageCode parameter', async () => {
        await expect(getAppById(1, undefined, db)).to.reject(
            Error,
            `Missing parameter 'languageCode'`
        )
    })

    it('should require the db connection parameter knex', async () => {
        await expect(getAppById(1, 'en', undefined)).to.reject(
            Error,
            `Missing parameter 'knex'`
        )
    })
})
