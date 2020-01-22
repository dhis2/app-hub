const Lab = require('@hapi/lab')

// prepare environment
const { it, describe } = (exports.lab = Lab.script())

const { expect } = require('@hapi/code')

const knexConfig = require('../../knexfile')
const db = require('knex')(knexConfig)

const users = require('../../seeds/mock/users')
const apps = require('../../seeds/mock/apps')

describe('@data::getAppDeveloperId', () => {
    const getAppDeveloperId = require('../../src/data/getAppDeveloperId')

    it('should return the correct developer id of an app', async () => {
        const devId = await getAppDeveloperId(apps[0].id, db)

        expect(devId).to.equal(users[1].id)
    })

    it('should return false if no app/dev is found', async () => {
        const devId = await getAppDeveloperId('boo', db)
        expect(devId).to.be.false()
    })
})
