const Lab = require('@hapi/lab')

const { it, describe } = (exports.lab = Lab.script())

const { expect } = require('@hapi/code')

const knexConfig = require('../../knexfile')
const db = require('knex')(knexConfig)

describe('@data::channels', () => {
    const createChannel = require('../../src/data/createChannel')
    const renameChannel = require('../../src/data/renameChannel')

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

        transaction.rollback()
    })

    it('should create a channel named Foo and then change name of it to Bar', async () => {
        const transaction = await db.transaction()

        const channel = await createChannel({ name: 'Foo' }, db, transaction)

        expect(channel).to.not.be.null()
        expect(channel.uuid).to.exist()
        expect(channel.id).to.exist()
        expect(channel.name).to.equal('Foo')

        const changedChannel = await renameChannel(
            { name: 'Bar', uuid: channel.uuid },
            db,
            transaction
        )

        expect(changedChannel.id).to.equal(channel.id)
        expect(changedChannel.uuid).to.equal(channel.uuid)
        expect(changedChannel.name).to.equal('Bar')

        transaction.rollback()
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
