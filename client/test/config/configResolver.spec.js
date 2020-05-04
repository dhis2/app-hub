/* eslint-disable no-undef */
import ConfigImport, { getConfig } from '../../config/configResolver'
import DirectDefaultConfig from '../../default.config.js'
import merge from 'lodash/merge'
const defaultConfigPath = '../../config/'
const Config = ConfigImport.default

describe('ConfigResolver', () => {
    describe('exports', () => {
        before(() => {})

        after(() => {})

        it('should export the default config object as if it was imported directly', () => {
            expect(Config).to.deep.equal(DirectDefaultConfig)
        })

        it('should return the same object-reference if imported multiple times', () => {
            const newConfig = require(defaultConfigPath.concat(
                'configResolver.js'
            )).default
            expect(newConfig).to.equal(Config)
            expect(newConfig).to.deep.equal(DirectDefaultConfig)
        })
    })

    describe('getConfig()', () => {
        const override = {
            routes: { baseAppName: 'baseAppName' },
            ui: { dhisVersions: ['2.34'] },
        }
        const addition = {
            another: 'setting',
        }
        let configOverride

        let loadOverrideFileStub, loadProdFileStub, loadDevFileStub

        let prodConfig
        let devConfig
        let prevConfig
        before(() => {
            configOverride = merge({}, DirectDefaultConfig, override, addition)
            prodConfig = {
                api: {
                    baseURL: 'https://apps.dhis2.org/api/',
                },
            }
            devConfig = {
                api: {
                    baseURL: 'https://localhost:8080/apphub/api/',
                    redirectURL: 'https://localhost:8080/apphub/user/',
                },
            }
            //sanity check
            expect(configOverride).to.not.deep.equal(DirectDefaultConfig)
            loadOverrideFileStub = sinon.stub().returns(configOverride)

            loadProdFileStub = sinon
                .stub()
                .onFirstCall()
                .returns(DirectDefaultConfig)
                .onSecondCall()
                .returns(prodConfig)
            loadDevFileStub = sinon
                .stub()
                .onFirstCall()
                .returns(DirectDefaultConfig)
                .onSecondCall()
                .returns(devConfig)
        })

        after(() => {})

        beforeEach(() => {
            prevConfig = Config
            getConfig.config = Config
        })

        afterEach(() => {
            getConfig.config = prevConfig
        })

        it('should return the default config object as if it was imported directly', () => {
            expect(getConfig()).to.deep.equal(DirectDefaultConfig)
        })

        it('should should return the same as default export', () => {
            expect(getConfig()).to.deep.equal(Config)
        })

        it('should return the same object-reference as default export', () => {
            expect(getConfig()).to.equal(Config)
        })

        it('should return the same object and object-reference if called multiple times', () => {
            expect(getConfig()).to.equal(Config)
            expect(getConfig()).to.equal(getConfig())
            expect(getConfig()).to.equal(Config)
        })

        it('should store last config on the function if its not already', () => {
            getConfig.config = null
            const conf = getConfig()
            expect(conf).to.deep.equal(DirectDefaultConfig)
            expect(getConfig.config).to.be.equal(conf)
        })

        it('should merge the default.config.js with config.js, and override if exists', () => {
            ConfigImport.__Rewire__('loadFile', loadOverrideFileStub)
            getConfig.config = null

            const conf = getConfig()

            expect(conf).to.not.deep.equal(DirectDefaultConfig)
            expect(DirectDefaultConfig.routes.baseAppName).to.be.equal('/')
            expect(conf.routes.baseAppName).to.equal('baseAppName')
            //should deep merge
            expect(conf.ui).to.deep.equal(DirectDefaultConfig.ui)

            expect(DirectDefaultConfig).to.not.have.property('another')
            expect(conf)
                .to.be.an('object')
                .that.includes(addition)

            ConfigImport.__ResetDependency__('loadFile')
        })

        it("should override with production.config.js if NODE_ENV = 'production", () => {
            ConfigImport.__Rewire__('loadFile', loadProdFileStub)
            getConfig.config = null
            const prevEnv = process.env.NODE_ENV
            process.env.NODE_ENV = 'production'

            const conf = getConfig()
            expect(conf.api.baseURL).to.equal(prodConfig.api.baseURL)

            expect(conf).to.not.deep.equal(DirectDefaultConfig)

            expect(conf)
                .to.have.property('auth0')
                .that.is.deep.equal(DirectDefaultConfig.auth0)
            expect(conf)
                .to.have.property('ui')
                .that.is.deep.equal(DirectDefaultConfig.ui)
            ConfigImport.__ResetDependency__('loadFile')
            process.env.NODE_ENV = prevEnv
        })

        it("should override with development.config.js if NODE_ENV = 'development", () => {
            ConfigImport.__Rewire__('loadFile', loadDevFileStub)
            const prevEnv = process.env.NODE_ENV

            getConfig.config = null
            process.env.NODE_ENV = 'development'
            const conf = getConfig()
            //should override api object
            expect(conf.api).to.deep.equal(devConfig.api)

            expect(conf).to.not.deep.equal(DirectDefaultConfig)
            //should keep the same properties that are not overriden
            expect(conf.ui).to.deep.equal(DirectDefaultConfig.ui)
            expect(conf.auth0).to.deep.equal(DirectDefaultConfig.auth0)
            ConfigImport.__ResetDependency__('loadFile')
            process.env.NODE_ENV = prevEnv
        })
    })
})
