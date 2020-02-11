const Boom = require('@hapi/boom')
const Joi = require('../../utils/CustomJoi')
const {
    canCreateApp,
    getCurrentAuthStrategy,
    getCurrentUserFromRequest,
} = require('../../security')
const getUserByEmail = require('../../data/getUserByEmail')
const { Organisation } = require('../../services')
const OrgModel = require('../../models/v2/Organisation')
const debug = require('debug')('apphub:routes:handlers:organisations')

module.exports = [
    {
        method: 'GET',
        path: '/v2/organisations',
        config: {
            tags: ['api', 'v2'],
            response: {
                //  schema: Joi.array().items(OrgModel.externalDefintion),
                //modify: true,
            },
            validate: {
                query: Joi.object({
                    name: Joi.filter().value(Joi.string()),
                    owner: Joi.filter(),
                    user: Joi.filter(Joi.string().guid()),
                }), //.rename('owner', 'created_by_user_id'),
            },
            plugins: {
                queryFilter: {
                    enabled: true,
                },
            },
        },
        handler: async (request, h) => {
            const { db } = h.context
            const filters = request.plugins.queryFilter
            debug(filters)
            //get all orgs, no filtering
            //TODO: add filtering
            const orgs = await Organisation.find({ filters }, h.context.db)
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

            const createOrgAndAddUser = async trx => {
                const organisation = await Organisation.create(
                    { userId, name: request.payload.name },
                    trx
                )
                const query = await Organisation.addUserById(
                    organisation.id,
                    userId,
                    trx
                )
                return organisation
            }

            const organisation = await db.transaction(createOrgAndAddUser)

            return h
                .response(organisation)
                .created(`/v2/organisations/${organisation.id}`)
        },
    },
    {
        method: 'PATCH',
        path: '/v2/organisations/{orgId}',
        config: {
            auth: 'token',
            tags: ['api', 'v2'],
            validate: {
                payload: Joi.object({
                    name: OrgModel.definition.extract('name'),
                    owner: OrgModel.definition.extract('owner'),
                }),
                params: Joi.object({
                    orgId: OrgModel.definition.extract('id').required(),
                }),
            },
        },
        handler: async (request, h) => {
            const { db } = h.context
            const { id: userId } = await getCurrentUserFromRequest(request, db)

            const updateObj = request.payload

            const updateOrganisation = async trx => {
                const organisation = await Organisation.findOne(
                    request.params.orgId,
                    false,
                    trx
                )
                if (organisation.owner !== userId) {
                    throw Boom.forbidden(
                        'You do not have permissions to update this organisation'
                    )
                }
                await Organisation.update(organisation.id, updateObj, db)
                return {
                    id: organisation.id,
                }
            }

            const transaction = await db.transaction(updateOrganisation)
            return h.response(transaction).code(200)
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

            const addUserToOrganisation = async trx => {
                const org = await Organisation.findOne(
                    request.params.orgId,
                    true,
                    trx
                )

                const isMember = org.users.findIndex(u => u.id === id) > -1
                const canAdd = org.owner === id || isMember

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
                    throw Boom.conflict(`User with email not found.`)
                }
            }

            const transaction = await db.transaction(addUserToOrganisation)
            return {
                statusCode: 200,
            }
        },
    },
    {
        method: 'DELETE',
        path: '/v2/organisations/{orgId}/user',
        config: {
            auth: 'token',
            tags: ['api', 'v2'],
            validate: {
                payload: Joi.object({
                    user: OrgModel.definition.extract('id').required(),
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

            const userIdToRemove = request.payload.user

            const removeUserFromOrganisation = async trx => {
                const org = await Organisation.findOne(
                    request.params.orgId,
                    true,
                    trx
                )
                const isMember = org.users.findIndex(u => u.id === id) > -1
                const canRemove = org.owner === id || isMember

                if (org.owner === userIdToRemove) {
                    throw Boom.conflict(
                        'Cannot remove the owner of the organisation'
                    )
                }
                if (!canRemove) {
                    throw Boom.forbidden(
                        'You do not have permission to remove users'
                    )
                }
                const deletedRes = await Organisation.removeUser(
                    org.id,
                    userIdToRemove,
                    trx
                )
                if (deletedRes < 1) {
                    throw Boom.conflict(
                        'User not found or not a member of organisation'
                    )
                }
            }

            const transaction = await db.transaction(removeUserFromOrganisation)

            return {
                statusCode: 200,
            }
        },
    },
]
