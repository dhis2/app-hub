const { getCurrentUserFromRequest } = require('../../security')
const { Organisation } = require('../../services')
const { Filters } = require('../../utils/Filter')

module.exports = [
    {
        method: 'GET',
        path: '/v2/me',
        config: {
            auth: 'token',
            tags: ['api', 'v2'],
        },
        handler: async (request, h) => {
            const { db } = h.context
            const { id: userId } = await getCurrentUserFromRequest(request, db)

            const filters = Filters.createFromQueryFilters(
                {
                    user: `eq:${userId}`,
                },
                {
                    user: 'user_id',
                }
            )

            const organisations = (
                await Organisation.find({ filters }, h.context.db)
            ).map((org) => org.id)

            return {
                organisations,
                userId,
            }
        },
    },
]
