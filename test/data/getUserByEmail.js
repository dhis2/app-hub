const Lab = require('@hapi/lab')

// prepare environment
const { it, describe } = (exports.lab = Lab.script())

const { expect } = require('@hapi/code')

const knexConfig = require('../../knexfile')
const db = require('knex')(knexConfig)

describe('@data::getUserByEmail', () => {
    const getUserByEmail = require('../../src/data/getUserByEmail')

    it('should require the db connection parameter', async () => {
        await expect(getUserByEmail('erik@dhis2.org')).to.reject(
            Error,
            `Missing parameter 'knex'`
        )
    })

    it('should return null if email is null', async () => {
        const user = await getUserByEmail(null, db)
        expect(user).to.be.null()
    })

    it('should return null if email is empty', async () => {
        const user = await getUserByEmail('', db)
        expect(user).to.be.null()
    })

    it('should return null if email is undefined', async () => {
        const user = await getUserByEmail(undefined, db)
        expect(user).to.be.null()
    })

    it('should return the user if found', async () => {
        const user = await getUserByEmail('erik@dhis2.org', db)

        expect(user).to.not.be.null()
        expect(user.email).to.equal('erik@dhis2.org')
    })

    it('should return null if not found', async () => {
        const user = await getUserByEmail('fdsa@dhis2.org', db)

        expect(user).to.be.null()
    })
})
