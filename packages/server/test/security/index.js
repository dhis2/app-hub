
const { expect } = require('code')

const { lab } = exports.lab = require('../index')

const { it, describe } = lab

const { canDeleteApp, canChangeAppStatus, canSeeAllApps } = require('@security')

describe('@security::canDeleteApp', () => {

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
        expect(result).to.be.true()
    })

    it('Should return false if request isAuthenticated is undefined', () => {

        const fakeRequest = {}
        const result = canDeleteApp(fakeRequest, null)
        expect(result).to.be.false()
    })

    it('Should return false if request is null', () => {

        const fakeRequest = null
        const result = canDeleteApp(fakeRequest, null)
        expect(result).to.be.false()
    })


    it('Should return false if looking for a role when current auth doesnt have any', () => {

        const fakeRequest = {
            auth: {
                isAuthenticated: true,
                credentials: {
                    payload: {
                        roles: null
                    }
                }
            }
        }
        const result = canDeleteApp(fakeRequest, null)
        expect(result).to.be.false()
    })

})



describe('@security::canChangeAppStatus', () => {

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

        const result = canChangeAppStatus(fakeRequest, null)
        expect(result).to.be.true()
    })
})



describe('@security::canSeeAllApps', () => {

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

        const result = canSeeAllApps(fakeRequest, null)
        expect(result).to.be.true()
    })
})





