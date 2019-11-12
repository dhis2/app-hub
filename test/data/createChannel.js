const Lab = require('@hapi/lab')

const { it, describe } = (exports.lab = Lab.script())

const { expect } = require('@hapi/code')

const knexConfig = require('../../knexfile')
const db = require('knex')(knexConfig)

describe('@data::createChannel', () => {
    const createChannel = require('../../src/data/createChannel')

    it('should create a channel named Test', async () => {
        const transaction = await db.transaction()

        const channel = await createChannel({ name: 'Test' }, db, transaction)

        expect(channel).to.not.be.null()
        expect(channel.uuid).to.exist()
        expect(channel.id).to.exist()

        expect(channel.uuid).to.have.length(36) //uuid
        expect(channel.id)
            .to.be.a.number()
            .greaterThan(0)
    })

    it('should require the parameter name to be passed', async () => {
        const transaction = await db.transaction()

        await expect(createChannel({}, db, transaction)).to.reject(
            Error,
            'ValidationError: "name" is required'
        )
    })

    it('should require a transaction to be passed in', async () => {
        await expect(createChannel({ name: 'Test' }, db)).to.reject(
            Error,
            'No transaction passed to function'
        )
    })
})
