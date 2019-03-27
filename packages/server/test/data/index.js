
const { expect } = require('code')

const { lab } = require('../index')

const { it, describe } = lab

const { addAppVersionMediaAsync, getAppsByUuidAsync, createAppAsync } = require('@data')

describe('@data::addAppVersionMediaAsync', () => {

    it('Should throw an error if config object does not pass validation', async () => {

        await expect(addAppVersionMediaAsync({}, null, null)).to.reject(Error, 'ValidationError: child "appVersionId" fails because ["appVersionId" is required]')
    })
})


describe('@data::getAppsByUuidAsync', () => {

    it('should require uuid parameter', async () => {

        await expect(getAppsByUuidAsync(null, 'sv', null)).to.reject(Error, `Missing parameter 'uuid'`)
    })

    it('should require languagecode parameter', async () => {

        await expect(getAppsByUuidAsync('1234', null, null)).to.reject(Error, `Missing parameter 'languageCode'`)
    })

    it('should require dbConnection parameter', async () => {

        await expect(getAppsByUuidAsync('1234', 'sv', null)).to.reject(Error, `Missing parameter 'dbConnection'`)
    })
})

describe('@data::createAppAsync', () => {

    it('should require userId parameter and it to be a number', async () => {

        await expect(createAppAsync({}, null, null)).to.reject(Error)

        await expect(createAppAsync({ userId: '' }, null, null)).to.reject(Error)
    })

    it('should require userId parameter and it to be a number', async () => {

        const config = {
            userId: 1
        }

        await expect(createAppAsync(config, null, null)).to.reject(Error)

        await expect(createAppAsync({ ...config, orgId: '' }, null, null)).to.reject(Error)

        await expect(createAppAsync({ ...config, orgId: 1 }, null, null)).to.resolve(Error)
    })
})

/*
describe('Test validations parameter objects', () => {

    const addAppVersionToChannelAsync = require('@data/addAppVersionToChannelAsync')

    const knex = require('knex')
    const mockKnex = require('mock-knex')

    const db = knex({
        client: 'postgres'
    })

    //const tracker = mockKnex.getTracker()
    mockKnex.mock(db)

    //tracker.install()
    /*tracker.on('query', (query) => {
        expect(query.transacting).to.be.false()
        resolve()
    })*/

/*    it('should fail if not sending all required parameters', (flags) => {

        return new Promise((resolve) => {
            db.transaction(async (trx) => {

                const result = await addAppVersionToChannelAsync({
                    appVersionId: 1,
                    createdByUserId: 1,
                    channelName: 'A',
                    minDhisVersion : 'B',
                    maxDhisVersion: ''
                }, db, trx)

                expect(result).to.not.be.null()
                resolve()
            })
        })
    })*/
/*})*/


