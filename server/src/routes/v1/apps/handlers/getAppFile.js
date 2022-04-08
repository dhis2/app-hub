const Boom = require('@hapi/boom')
const debug = require('debug')('apphub:server:routes:handlers:v1:getAppFile')
const { getOrganisationAppsByUserId } = require('../../../../data')
const { AppStatus } = require('../../../../enums')
const {
    currentUserIsManager,
    getCurrentUserFromRequest,
} = require('../../../../security')
const { getFile } = require('../../../../utils')

module.exports = {
    method: 'GET',
    path: '/v1/apps/download/{organisation_slug}/{appver_slug}_{app_version}.zip',
    config: {
        auth: { strategy: 'token', mode: 'try' },
        tags: ['api', 'v1'],
    },
    handler: async (request, h) => {
        request.logger.info('In handler %s', request.path)

        const { organisation_slug, appver_slug, app_version } = request.params

        const knex = h.context.db
        const { appVersionService } = request.services(true)

        const isAdmin = currentUserIsManager(request)
        let user = null
        try {
            user = await getCurrentUserFromRequest(request)
        } catch (err) {
            //no user in request, anonymous
            debug('no user in request')
        }

        let appRows = null

        if (!user) {
            //anonymous, only allow downloading approved apps
            appRows = await knex.select().from('apps_view').where({
                organisation_slug,
                appver_slug,
                version: app_version,
                status: AppStatus.APPROVED,
                language_code: 'en',
            })
        } else if (isAdmin) {
            //no filter on status if admin
            appRows = await knex.select().from('apps_view').where({
                organisation_slug,
                appver_slug,
                version: app_version,
                language_code: 'en',
            })
        } else {
            //show all apps that a user has access to through it organisation connections
            debug('developer/user:', user)
            appRows = await getOrganisationAppsByUserId(user.id, knex)
            debug('appRows:', appRows)
        }

        const item = appRows[0]

        debug('item:', item)

        if (!item) {
            throw Boom.notFound()
        }

        //TODO: improve by streaming instead of first downloading then responding with the zip?
        //or pass out the aws url directly
        debug(`Fetching file from ${item.app_id}/${item.version_id}`)
        const file = await getFile(
            `${item.app_id}/${item.version_id}`,
            'app.zip'
        )

        try {
            appVersionService.incrementDownloadCount(item.version_id, knex)
        } catch (e) {
            request.logger.error('Failed to increment download', e)
        }

        return h
            .response(file.Body)
            .type('application/zip')
            .header(
                'Content-Disposition',
                `attachment; filename=${item.appver_slug}_${item.version}.zip;`
            )
            .header('Content-length', file.ContentLength)
    },
}
