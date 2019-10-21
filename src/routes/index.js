const { flatten } = require('../utils')

const verifyKnexBehaviour = {
    //authenticated endpoint returning all apps no matter which status they have
    method: 'get',
    path: '/knex',
    handler: async (request, h) => {
        const db = h.context.db
        const transaction = await db.transaction()

        const row = await db
            .insert()
            .select(['app.id', 'name'])
            .from('app')
            .innerJoin('app_version', { 'app.id': 'app_version.app_id' })
            .innerJoin('app_version_localised', {
                'app_version_localised.app_version_id': 'app_version.id',
            })
            .where({ 'app.uuid': request.params.appUuid, language_code: 'en' })

        if (row.length > 0) {
            const updated = await knex('app_status')
                .where({ app_id: row[0].id })
                .update({ status })

            return {
                message: `Status changed for app: ${row[0].name}`,
                httpStatus: 'OK',
                httpStatusCode: 200,
            }
        }

        return Boom.badImplementation()
    },
}

const routes = flatten([
    require('./v1'),
    require('./v2'),
    [verifyKnexBehaviour],
])

module.exports = routes
