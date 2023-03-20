const Boom = require('@hapi/boom')
const AppVersionModel = require('../../models/v2/AppVersion')
const {
    withPagingResultSchema,
    withPagingQuerySchema,
} = require('../../query/Pager')
const Joi = require('../../utils/CustomJoi')
const App = require('../../services/app')
const { AppStatus } = require('../../enums')

const CHANNELS = ['stable', 'development', 'canary']

module.exports = [
    {
        method: 'GET',
        path: '/v2/appVersions/{appVersionId}',
        config: {
            tags: ['api', 'v2'],
            response: {
                modify: true,
                schema: AppVersionModel.externalDefinition,
            },
            validate: {
                params: Joi.object({
                    appVersionId: Joi.string()
                        .guid({ version: 'uuidv4' })
                        .required(),
                }),
            },
        },
        handler: async (request, h) => {
            const { db } = h.context
            const { appVersionId } = request.params
            const { appVersionService } = request.services(true)

            const setDownloadUrl =
                appVersionService.createSetDownloadUrl(request)

            const version = await appVersionService.findOne(appVersionId, db)
            await checkVersionAccess(version, request, db)

            setDownloadUrl(version)
            return version
        },
    },
    {
        method: 'GET',
        path: '/v2/apps/{appId}/versions',
        config: {
            tags: ['api', 'v2'],
            response: {
                sample: 0, // schema used for swagger, don't check responses
                schema: withPagingResultSchema(AppVersionModel.def),
            },
            validate: {
                params: Joi.object({
                    appId: Joi.string().required(),
                }),
                query: withPagingQuerySchema(
                    Joi.object({
                        version: Joi.filter(Joi.string()).description(
                            'Filter by version of the app'
                        ),
                        channel: Joi.filter(
                            Joi.stringArray().items(Joi.valid(...CHANNELS))
                        ).description('Filter by channel of the version'),
                        minDhisVersion: Joi.filter(Joi.string()),
                        maxDhisVersion: Joi.filter(Joi.string()),
                    })
                ),
            },
            plugins: {
                pagination: {
                    enabled: true,
                },
                queryFilter: {
                    enabled: true,
                    rename: AppVersionModel.dbDefinition,
                },
            },
        },
        handler: async (request, h) => {
            const { db } = h.context
            const { appId } = request.params
            const filters = request.plugins.queryFilter
            const pager = request.plugins.pagination
            const { appVersionService } = request.services(true)

            const setDownloadUrl =
                appVersionService.createSetDownloadUrl(request)

            const versions = await appVersionService.findByAppId(
                appId,
                { pager, filters },
                db
            )

            versions.result.map(setDownloadUrl)

            return h.response(versions)
        },
    },
]

async function checkVersionAccess(version, request, db) {
    // check if the user is allowed to see the app
    if (version.status !== AppStatus.APPROVED) {
        const user = request.getUser()
        const canSeeApp =
            user &&
            (user.isManager ||
                (await App.canEditApp(user.id, version.appId, db)))

        if (!canSeeApp) {
            // TODO: should this return a 404 instead of a 403? (to avoid leaking info)
            throw Boom.forbidden()
        }
    }
}
