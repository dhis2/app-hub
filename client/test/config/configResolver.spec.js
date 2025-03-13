/* eslint-disable no-undef */
import merge from 'lodash/merge'
import ConfigImport, { getConfig } from '../../config/configResolver'
import DirectDefaultConfig from '../../default.config.js'
const defaultConfigPath = '../../config/'
const Config = ConfigImport.default

describe('ConfigResolver', () => {
    describe('exports', () => {
        beforeAll(() => {})

        afterAll(() => {})

        it('should export the default config object as if it was imported directly', () => {
            expect(Config).toEqual(DirectDefaultConfig)
        })

        it('should return the same object-reference if imported multiple times', () => {
            const newConfig = require(defaultConfigPath.concat(
                'configResolver.js'
            )).default
            expect(newConfig).toBe(Config)
            expect(newConfig).toEqual(DirectDefaultConfig)
        })
    })

    describe('getConfig()', () => {
        const override = {
            routes: { baseAppName: 'baseAppName' },
            ui: { dhisVersions: ['3.34'] },
        }
        const addition = {
            another: 'setting',
        }
        let configOverride

        let loadOverrideFileStub, loadProdFileStub, loadDevFileStub

        let prodConfig
        let devConfig
        let prevConfig
        beforeAll(() => {
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
            expect(configOverride).not.toEqual(DirectDefaultConfig)

            loadOverrideFileStub = jest.fn()
            loadOverrideFileStub.mockImplementationOnce(() => configOverride)

            loadProdFileStub = jest.fn()
            loadProdFileStub
                .mockImplementationOnce(() => DirectDefaultConfig)
                .mockImplementationOnce(() => prodConfig)

            loadDevFileStub = jest.fn()
            loadDevFileStub
                .mockImplementationOnce(() => DirectDefaultConfig)
                .mockImplementationOnce(() => devConfig)
        })

        afterAll(() => {})

        beforeEach(() => {
            prevConfig = Config
            getConfig.config = Config
        })

        afterEach(() => {
            getConfig.config = prevConfig
        })

        it('should return the default config object as if it was imported directly', () => {
            expect(getConfig()).toEqual(DirectDefaultConfig)
        })

        it('should should return the same as default export', () => {
            expect(getConfig()).toEqual(Config)
        })

        it('should return the same object-reference as default export', () => {
            expect(getConfig()).toBe(Config)
        })

        it('should return the same object and object-reference if called multiple times', () => {
            expect(getConfig()).toBe(Config)
            expect(getConfig()).toBe(getConfig())
            expect(getConfig()).toBe(Config)
        })

        it('should store last config on the function if its not already', () => {
            getConfig.config = null
            const conf = getConfig()
            expect(conf).toEqual(DirectDefaultConfig)
            expect(getConfig.config).toEqual(conf)
        })

        it('should merge the default.config.js with config.js, and override if exists', () => {
            ConfigImport.__Rewire__('loadFile', loadOverrideFileStub)
            getConfig.config = null

            const conf = getConfig()

            expect(conf).not.toEqual(DirectDefaultConfig)
            expect(DirectDefaultConfig.routes.baseAppName).toEqual('/')
            expect(conf.routes.baseAppName).toBe('baseAppName')
            //should deep merge
            expect(
                Object.keys(conf.ui).every((k) =>
                    Object.prototype.hasOwnProperty.call(DirectDefaultConfig, k)
                )
            )
            expect(
                DirectDefaultConfig.ui.dhisVersions.every((v) =>
                    conf.ui.dhisVersions.includes(v)
                )
            )
            expect(
                conf.ui.dhisVersions.every((v) =>
                    override.ui.dhisVersions.includes(v)
                )
            )

            expect(DirectDefaultConfig).not.toHaveProperty('another')
            expect(conf).toMatchObject(expect.objectContaining(addition))

            ConfigImport.__ResetDependency__('loadFile')
        })

        it("should override with production.config.js if NODE_ENV = 'production", () => {
            ConfigImport.__Rewire__('loadFile', loadProdFileStub)
            getConfig.config = null
            const prevEnv = process.env.NODE_ENV
            process.env.NODE_ENV = 'production'

            const conf = getConfig()
            expect(conf.api.baseURL).toBe(prodConfig.api.baseURL)

            expect(conf).not.toEqual(DirectDefaultConfig)

            expect(conf.auth0).toEqual(DirectDefaultConfig.auth0)
            expect(conf.ui).toEqual(DirectDefaultConfig.ui)
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
            expect(conf.api).toEqual(devConfig.api)

            expect(conf).not.toEqual(DirectDefaultConfig)
            //should keep the same properties that are not overriden
            expect(conf.ui).toEqual(DirectDefaultConfig.ui)
            expect(conf.auth0).toEqual(DirectDefaultConfig.auth0)
            ConfigImport.__ResetDependency__('loadFile')
            process.env.NODE_ENV = prevEnv
        })
    })
})
