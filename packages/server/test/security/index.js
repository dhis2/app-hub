
const { expect } = require('code')
const { lab } = require('../index')

const { it, describe, beforeEach, afterEach, before, after } = lab

const { canDeleteApp } = require('@security')

describe('Security utils', () => {

    it('Should return true if request is authenticated and has the role ROLE_MANAGER', () => {

        const fakeRequest = {
            auth: {
                isAuthenticated: true,
                credentials: {
                    payload: {
                        roles: ['ROLE_MANAGER']
                    }
                }
            }
        }

        const result = canDeleteApp(fakeRequest, null)
        console.log(result)

        expect(result).to.be.true()
    })

    it('Should return false if request isAuthenticated is undefined', () => {

        const fakeRequest = {}

        const result = canDeleteApp(fakeRequest, null)

        expect(result).to.be.false()
    })

})
