const Lab = require('@hapi/lab')
const { it, describe, before } = (exports.lab = Lab.script())
const { expect, fail } = require('@hapi/code')
const { flatten } = require('../../src/utils')
const {
    UniqueViolationError,
    ForeignKeyViolationError,
    NotNullViolationError,
    CheckViolationError,
    DBError,
    DataError,
    ConstraintViolationError,
} = require('db-errors')
const { NotFoundError } = require('../../src/utils/errors')
const ErrorMapperPlugin = require('../../src/plugins/errorMapper')
const Joi = require('@hapi/joi')
const Hapi = require('@hapi/hapi')

describe('ErrorMapperPlugin', () => {
    let server

    const registerRoutes = server => {
        server.route({
            method: 'GET',
            path: '/null',
            handler: () => {
                throw new NotFoundError('Item was not found!')
            },
        })

        server.route({
            method: 'POST',
            path: '/constraint',
            handler: () => {
                throw new ConstraintViolationError({
                    nativeError: new Error('Constraint violation!'),
                })
            },
        })

        server.route({
            method: 'POST',
            path: '/notNull',
            handler: () => {
                throw new NotNullViolationError({
                    nativeError: 'Cannot be null!',
                })
            },
        })

        server.route({
            method: 'POST',
            path: '/unique',
            handler: () => {
                throw new UniqueViolationError({
                    nativeError: new Error('Item already exists!'),
                })
            },
        })

        server.route({
            method: 'GET',
            path: '/pass',
            handler: () => {
                return 'Success!'
            },
        })

        server.route({
            method: 'GET',
            path: '/internal',
            handler: () => {
                throw new Error('An internal error')
            },
        })

        server.route({
            method: 'POST',
            path: '/validationInHandler',
            handler: () => {
                return Joi.attempt(
                    {
                        a: 5,
                    },
                    Joi.string()
                )
            },
        })
        server.route({
            method: 'POST',
            path: '/validation',
            config: {
                validate: {
                    payload: Joi.object(),
                },
            },
            handler: () => {
                return 'Success!'
            },
        })
    }
    describe('Default: preserveMessage=false', () => {
        before(async () => {
            server = Hapi.server({ port: 3001 })

            await server.register({ plugin: ErrorMapperPlugin })

            registerRoutes(server)
        })

        it('should ignore non-error', async () => {
            const res = await server.inject({
                method: 'GET',
                url: '/pass',
            })
            expect(res.statusCode).to.be.equal(200)
            expect(res.result).to.be.equal('Success!')
        })
        it('should ignore joi validation-errors', async () => {
            const res = await server.inject({
                method: 'POST',
                url: '/validation',
            })
            expect(res.statusCode).to.be.equal(400)
        })

        it('joi validation-errors should return 400-errors when returned from handlers', async () => {
            const res = await server.inject({
                method: 'POST',
                url: '/validationInHandler',
            })
            expect(res.statusCode).to.be.equal(400)
        })
        it('should ignore and rethrow internal errors', async () => {
            const res = await server.inject({
                method: 'GET',
                url: '/internal',
            })

            expect(res.statusCode).to.be.equal(500)
            expect(res.result.message).to.be.equal(
                'An internal server error occurred'
            )
        })
        it('should return 404: not found when NotFoundError is thrown', async () => {
            const request = {
                method: 'GET',
                url: '/null',
            }
            const res = await server.inject(request)

            expect(res.statusCode).to.be.equal(404)
            expect(res.result.message).to.be.equal('Not Found')
        })

        it('should return 400: bad request when ConstraintViolationError is thrown', async () => {
            const request = {
                method: 'POST',
                url: '/constraint',
            }
            const res = await server.inject(request)
            expect(res.statusCode).to.be.equal(400)
            expect(res.result.message).to.be.equal('Bad Request')
        })
    })

    describe('preserveMessage=true', () => {
        before(async () => {
            server = Hapi.server({ port: 3001 })

            await server.register({
                plugin: ErrorMapperPlugin,
                options: {
                    preserveMessage: true,
                },
            })
            registerRoutes(server)
        })
        it('should ignore non-error', async () => {
            const res = await server.inject({
                method: 'GET',
                url: '/pass',
            })

            expect(res.statusCode).to.be.equal(200)
            expect(res.result).to.be.equal('Success!')
        })

        it('should ignore and rethrow internal errors', async () => {
            const res = await server.inject({
                method: 'GET',
                url: '/internal',
            })

            expect(res.statusCode).to.be.equal(500)
            expect(res.result.message).to.be.equal(
                'An internal server error occurred'
            )
        })

        it('should return 404 with preserved message when NotFoundError is thrown', async () => {
            const request = {
                method: 'GET',
                url: '/null',
            }
            const res = await server.inject(request)

            expect(res.statusCode).to.be.equal(404)
            expect(res.result.message).to.be.equal('Item was not found!')
        })

        it('should return 400: bad request with preserved message when ConstraintViolationError is thrown', async () => {
            const request = {
                method: 'POST',
                url: '/constraint',
            }

            const res = await server.inject(request)
            expect(res.statusCode).to.be.equal(400)
            expect(res.result.message).to.be.equal('Constraint violation!')
        })

        it('should return 409: conflict with preserved message when UniqueViolationError is thrown', async () => {
            const request = {
                method: 'POST',
                url: '/unique',
            }

            const res = await server.inject(request)
            expect(res.statusCode).to.be.equal(409)
            expect(res.result.message).to.be.equal('Item already exists!')
        })
    })
})
