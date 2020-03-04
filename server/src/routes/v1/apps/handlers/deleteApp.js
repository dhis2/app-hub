const Boom = require('@hapi/boom')
const Joi = require('@hapi/joi')

const debug = require('debug')('apphub:server:routes:v1:handlers:deleteApp')

const { deleteDir } = require('../../../../utils')
const defaultFailHandler = require('../../defaultFailHandler')

const { canDeleteApp } = require('../../../../security')
const getAppsById = require('../../../../data/getAppsById')
const deleteApp = require('../../../../data/deleteApp')

module.exports = {
    //authenticated endpoint returning all apps no matter which status they have
    method: 'DELETE',
    path: '/v1/apps/{appId}',
    config: {
        auth: 'token',
        tags: ['api', 'v1'],
        response: {
            status: {
                200: Joi.any(),
                500: Joi.any(),
            },
            failAction: defaultFailHandler,
        },
    },
    handler: async (request, h) => {
        debug(`deleteApp : ${request.params.appId}`)

        if (!canDeleteApp(request, h)) {
            throw Boom.unauthorized()
        }
        //todo: validate

        const knex = h.context.db

        const appId = request.params.appId
        const appRows = await getAppsById(appId, 'en', knex)

        const trx = await knex.transaction()
        try {
            await deleteApp(appId, knex, trx)
            await trx.commit()
            await deleteDir(appId)
        } catch (err) {
            await trx.rollback()
            throw Boom.internal(err)
        }

        return {
            message: 'Successfully deleted app',
            httpStatus: 'OK',
            httpStatusCode: 200,
        }
    },
}
