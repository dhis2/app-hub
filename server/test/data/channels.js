const Lab = require('@hapi/lab')

const { it, describe } = (exports.lab = Lab.script())

const { expect } = require('@hapi/code')

const knexConfig = require('../../knexfile')
const db = require('knex')(knexConfig)

describe('@data::channels', () => {
    const createChannel = require('../../src/data/createChannel')
    const renameChannel = require('../../src/data/renameChannel')
    const deleteChannel = require('../../src/data/deleteChannel')

    it('should create a channel named Test', async () => {
        const transaction = await db.transaction()

        const channel = await createChannel({ name: 'Test' }, transaction)

        expect(channel).to.not.be.null()
        expect(channel.id).to.exist()

        expect(channel.id).to.have.length(36) //uuid

        transaction.rollback()
    })

    it('should create a channel named Foo and then change name of it to Bar', async () => {
        const transaction = await db.transaction()

        const channel = await createChannel({ name: 'Foo' }, transaction)

        expect(channel).to.not.be.null()
        expect(channel.id).to.exist()
        expect(channel.name).to.equal('Foo')

        const changedChannel = await renameChannel(
            { name: 'Bar', id: channel.id },
            transaction
        )

        expect(changedChannel.id).to.equal(channel.id)
        expect(changedChannel.name).to.equal('Bar')

        transaction.rollback()
    })

    it('should require the parameter name to be passed', async () => {
        const transaction = await db.transaction()

        await expect(createChannel({}, transaction)).to.reject(
            Error,
            'ValidationError: "name" is required'
        )
    })

    it('should create a channel named Foo and delete it', async () => {
        let transaction = await db.transaction()

        const channel = await createChannel({ name: 'Foo' }, transaction)
        await transaction.commit()

        expect(channel).to.not.be.null()
        expect(channel.id).to.exist()
        expect(channel.name).to.equal('Foo')

        transaction = await db.transaction()
        const deleteResult = await deleteChannel(channel.id, transaction)

        expect(deleteResult).to.be.true()
    })
})
