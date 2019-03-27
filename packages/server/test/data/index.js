
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

    it('should require orgId parameter and it to be a number', async () => {

        const config = {
            userId: 1
        }

        await expect(createAppAsync(config, null, null)).to.reject(Error)

        await expect(createAppAsync({ ...config, orgId: '' }, null, null)).to.reject(Error)

    })
})
