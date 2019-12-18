const Boom = require('@hapi/boom')
const Joi = require('@hapi/joi')
const {
    canCreateApp,
    getCurrentAuthStrategy,
    getCurrentUserFromRequest,
} = require('../../security')
const getUserByEmail = require('../../data/getUserByEmail')
const { Organisation } = require('../../services')
const OrgModel = require('../../models/v2/Organisation')

module.exports = [
    {
        method: 'GET',
        path: '/v2/organisations',
        config: {
            tags: ['api', 'v2'],
            response: {
                schema: Joi.array().items(OrgModel.externalDefintion),
                modify: true,
            },
        },
        handler: async (request, h) => {
            const { db } = h.context

            //get all orgs, no filtering
            //TODO: add filtering
            const orgs = await Organisation.find({}, h.context.db)
            return orgs
        },
    },
    {
        method: 'GET',
        path: '/v2/organisations/{orgId}',
        config: {
            auth: 'token',
            validate: {
                params: Joi.object({
                    orgId: OrgModel.definition.extract('id').required(),
                }),
            },
            tags: ['api', 'v2'],
            response: {
                schema: OrgModel.externalDefintion,
                modify: true,
            },
        },
        handler: async (request, h) => {
            const { db } = h.context
            const { orgId } = request.params
            const organisation = await Organisation.findOne(orgId, true, db)
            return organisation
        },
    },
    {
        method: 'POST',
        path: '/v2/organisations',
        config: {
            auth: 'token',
            validate: {
                payload: Joi.object({
                    name: OrgModel.definition.extract('name').required(),
                }),
            },
            tags: ['api', 'v2'],
            response: {
                schema: OrgModel.externalDefintion,
                modify: true,
            },
        },

        handler: async (request, h) => {
            const { db } = h.context

            const { id: userId } = await getCurrentUserFromRequest(request, db)
            const organisation = await Organisation.create(
                { userId, name: request.payload.name },
                db
            )
            return h
                .response(organisation)
                .created(`/v2/organisations/${organisation.id}`)
        },
    },
    {
        method: 'POST',
        path: '/v2/organisations/{orgId}/user',
        config: {
            auth: 'token',
            tags: ['api', 'v2'],
            validate: {
                payload: Joi.object({
                    email: Joi.string()
                        .email()
                        .required(),
                }),
                params: Joi.object({
                    orgId: OrgModel.definition.extract('id').required(),
                }),
            },
            // response: {
            //     status: {
            //         //TODO: add response statuses
            //     },
            // },
        },
        handler: async (request, h) => {
            const { db } = h.context
            const { id } = await getCurrentUserFromRequest(request, db)
            const userEmailToAdd = request.payload.email

            const addUserToOrganisation = async trx => {
                const org = await Organisation.findOne(
                    request.params.orgId,
                    true,
                    trx
                )

                const isMember = org.users.findIndex(u => u.id === id) > -1
                const canAdd = org.createdByUser === id || isMember

                if (!canAdd) {
                    throw Boom.forbidden(
                        'You do not have permission to add users'
                    )
                }

                const userToAdd = await getUserByEmail(
                    request.payload.email,
                    trx
                )
                if (userToAdd && userToAdd.id) {
                    await Organisation.addUserById(org.id, userToAdd.id, trx)
                    return userToAdd
                } else {
                    throw Boom.conflict(
                        `User with email '${userEmailToAdd} not found.`
                    )
                }
            }

            const transaction = await db.transaction(addUserToOrganisation)

            return {
                statusCode: 200,
            }
        },
    },
]
