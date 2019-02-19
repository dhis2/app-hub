const Boom = require('boom')
const Joi = require('joi')

const AppModel = require('../../../../models/v1/out/App')
const AWSFileHandler = require('../../../../utils/AWSFileHandler')

const defaultFailHandler = require('../../defaultFailHandler')

module.exports = {
    //unauthenticated endpoint returning the approved app for the specified uuid
    method: 'GET',
    path: '/v1/apps/{app_uuid}/icon',
    config: {
        auth: false,
        tags: ['api', 'v1'],
        response: {
            status: {
                200: Joi.array().items(AppModel.def),
                500: Joi.string()
            },
            failAction: defaultFailHandler
        },
    },
    handler: async (request, h) => {
        request.logger.info('In handler %s', request.path)

        const fileHandler = new AWSFileHandler(process.env.AWS_REGION,
                                                process.env.AWS_BUCKET_NAME)

        const { app_uuid } = request.params

        return await fileHandler.getFile(app_uuid, icon)
    }
}