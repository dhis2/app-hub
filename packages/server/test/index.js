'use strict';

// load deps
const { expect } = require('code')
let lab = exports.lab = require('lab').script()
const { it, describe, before, beforeEach } = lab

// prepare environment
const { server, db } = require('../src/main.js')
const FormData = require('form-data')

console.log("Tests are running in env: " + process.env.NODE_ENV)



describe('Get all published apps [v1]', () => {

    it('should return some test-apps from seeded db', async() => {
        const injectOptions = {
            method: 'GET',
            url: '/v1/apps'
        }
    
        const response = await server.inject(injectOptions)
        expect(response.statusCode).to.equal(200)
    
        const apps = JSON.parse(response.payload)
        expect(apps).to.not.be.empty()
    })
})



describe('Get all published apps [v2]', () => {

    it('should just return a 501 not implemented for the moment being', async() => {
        const injectOptions = {
            method: 'GET',
            url: '/v2/apps'
        }
    
        const response = await server.inject(injectOptions)
        expect(response.statusCode).to.equal(501)
    
        const apps = JSON.parse(response.payload)
        expect(apps).to.not.be.empty()
    })
})
