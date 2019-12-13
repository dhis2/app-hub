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
const ErrorPlugin = require('../../src/plugins/errorMapper')

const Hapi = require('@hapi/hapi')

describe('ErrorPlugin', () => {
    let server
    before(async () => {
        server = Hapi.server({ port: 3001 })

        await server.register({ plugin: ErrorPlugin })

        server.route({
            method: 'GET',
            path: '/null',
            options: {
                response: {
                    failAction: (r, h, err) => {
                        throw err
                    },
                },
            },
            handler: () => {
                throw new NotFoundError('Item was not found!')
            },
        })
    })

    it('should return 404: not found ', async () => {
        const request = {
            method: 'GET',
            url: '/null',
        }
        const res = await server.inject(request)

        expect(res.result.statusCode).to.be.equal(404)
        expect(res.result.message).to.be.equal('Not found')
    })
})
