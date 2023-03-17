const Boom = require('@hapi/boom')
const AppVersionModel = require('../../models/v2/AppVersion')
const {
    withPagingResultSchema,
    withPagingQuerySchema,
} = require('../../query/Pager')
const Joi = require('../../utils/CustomJoi')
const { Filters } = require('../../utils/Filter')
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
            auth: { strategy: 'token', mode: 'try' },
            response: {
                modify: true,
                schema: withPagingResultSchema(
                    AppVersionModel.externalDefinition
                ),
            },
            validate: {
                params: Joi.object({
                    appId: Joi.string().required(),
                }),
                query: withPagingQuerySchema(
                    Joi.object({
                        version: Joi.filter().description(
                            'Filter by version of the app'
                        ),
                        channel: Joi.filter(
                            Joi.stringArray().items(Joi.valid(...CHANNELS))
                        ).description('Filter by channel of the version'),
                        minDhisVersion: AppVersionModel.versionFilterSchema,
                        maxDhisVersion: AppVersionModel.versionFilterSchema,
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

            const result = await appVersionService.findByAppId(
                appId,
                { pager, filters },
                db
            )
            const versions = result.result

            if (versions && versions.length > 0) {
                await checkVersionAccess(versions[0], request, db)
            }

            versions.map(setDownloadUrl)

            return h.response(result)
        },
    },
]

async function checkVersionAccess(version, request, db) {
    const user = request.getUser()
    // check if the user is allowed to see the app
    if (version.status !== AppStatus.APPROVED) {
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
