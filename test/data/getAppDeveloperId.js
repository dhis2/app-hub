const Lab = require('@hapi/lab')

// prepare environment
const { it, describe } = (exports.lab = Lab.script())

const { expect } = require('@hapi/code')

const knexConfig = require('../../knexfile')
const db = require('knex')(knexConfig)

describe('@data::getAppDeveloperId', () => {
    const getAppDeveloperId = require('../../src/data/getAppDeveloperId')

    it('should return the correct developer id of an app', async () => {
        const { uuid } = await db('app')
            .select('uuid')
            .where('id', 1)
            .first()
        const devId = await getAppDeveloperId(uuid, db)

        //first app in the seed/test db has developer_user_id = 2
        expect(devId).to.equal(2)
    })

    it('should return false if no app/dev is found', async () => {
        const devId = await getAppDeveloperId('boo', db)
        expect(devId).to.be.false()
    })
})
