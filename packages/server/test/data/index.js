
const { expect } = require('code')

const { lab, db } = require('../index')

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

    it('should require orgId parameter and it to be a number', async () => {

        const config = {
            userId: 1
        }

        await expect(createAppAsync(config, null, null)).to.reject(Error)

        await expect(createAppAsync({ ...config, orgId: '' }, null, null)).to.reject(Error)

    })
})


describe('@data::getOrganisationAsync', () => {

    const { getOrganisationByUuidAsync, getOrganisationsByNameAsync } = require('@data')

    it('should throw an error passing invalid uuid', async () => {

        await expect(getOrganisationByUuidAsync('asdf', db)).to.reject(Error)
    })

    it('get the organisation with the specified uuid', async () => {

        const [dhis2Org] = await getOrganisationsByNameAsync('DHIS2', db)
        expect(dhis2Org).to.not.be.null()
        
        const dhis2OrgByUuid = await getOrganisationByUuidAsync(dhis2Org.uuid, db)
        expect(dhis2OrgByUuid).to.not.be.null()

        expect(dhis2Org.id).to.equal(dhis2OrgByUuid.id)
    })

    it('get the organisation named DHIS2', async () => {

        const [dhis2Org] = await getOrganisationsByNameAsync('DHIS2', db)

        expect(dhis2Org).to.not.be.null()
        expect(dhis2Org.name).to.equal('DHIS2')
    })
})

describe('@data::createOrganisationAsync', () => {

    const { deleteOrganisationAsync, createOrganisationAsync, getOrganisationsByNameAsync, createTransaction } = require('@data')

    it('should create an organisation and then delete it', async () => {

        let transaction = await createTransaction(db)

        const org = await createOrganisationAsync({
            userId: 1,
            name: 'Test create organisation åäöèé'
        }, db, transaction)

        await transaction.commit()

        expect(org.id).to.be.a.number().min(1)

        expect(org.uuid.length).to.be.equal(36)
        expect(org.slug).to.equal('test-create-organisation-aaoee')
        expect(org.name).to.equal('Test create organisation åäöèé')

        const [shouldExist] = await getOrganisationsByNameAsync(org.name, db)
        expect(shouldExist.id).to.be.equal(org.id)
        expect(shouldExist.uuid).to.be.equal(org.uuid)
        expect(shouldExist.name).to.be.equal(org.name)
        expect(shouldExist.slug).to.be.equal(org.slug)
        
        //Delete then try to fetch again.
        transaction = await createTransaction(db)
        const successfullyDeleted = await deleteOrganisationAsync({uuid: org.uuid}, db, transaction)
        transaction.commit()

        expect(successfullyDeleted).to.be.true()

        const organisationsWithName = await getOrganisationsByNameAsync(org.name, db)
        expect(organisationsWithName).to.be.empty()
    })
})


describe('@data::createUserAsync', () => {

    const { createUserAsync, createTransaction } = require('@data')

    it('should create a new user', async () => {

        let transaction = await createTransaction(db)

        const { id } = await createUserAsync({
            email: 'test@test.com'
        }, db, transaction)

        transaction.commit()

        expect(id).to.be.number().min(1)
    })

})


describe('@data::addUserToOrganisationAsync', () => {

    const { addUserToOrganisationAsync, createTransaction, getOrganisationsByNameAsync, createOrganisationAsync } = require('@data')

    it('should add a user to an organisation without throwing',  async () => {
        
        let transaction = await createTransaction(db)

        const org = await createOrganisationAsync({ userId: 1, name: 'A new organisation' }, db, transaction)
       
        await addUserToOrganisationAsync( { userId: 1, organisationId: org.id }, db, transaction )

        transaction.commit()
       
    })    
})