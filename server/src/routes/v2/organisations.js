const Boom = require('@hapi/boom')
const Bounce = require('@hapi/bounce')
const { wrapError, UniqueViolationError } = require('db-errors')
const JWT = require('jsonwebtoken')
const getUserByEmail = require('../../data/getUserByEmail')
const OrgModel = require('../../models/v2/Organisation')
const {
    currentUserIsManager,
    getCurrentUserFromRequest,
} = require('../../security')
const { Organisation } = require('../../services')
const { getAppsInOrganisation } = require('../../services/organisation')
const Joi = require('../../utils/CustomJoi')
// const debug = require('debug')('apphub:server:routes:handlers:organisations')
const getServerUrl = require('../../utils/getServerUrl')
const {
    convertAppsToApiV1Format,
} = require('../v1/apps/formatting/convertAppsToApiV1Format')

module.exports = [
    {
        method: 'GET',
        path: '/v2/organisations',
        config: {
            tags: ['api', 'v2'],
            response: {
                schema: Joi.array()
                    .items(
                        OrgModel.externalDefinition.fork('users', (s) =>
                            s.forbidden()
                        )
                    )
                    .label('Organisations'),
            },
            validate: {
                query: Joi.object({
                    name: Joi.filter().description(
                        'The name of the organisation'
                    ),
                    slug: Joi.filter().description(
                        'The slug of the organisation'
                    ),
                    owner: Joi.filter(Joi.string().guid())
                        .operator(Joi.valid('eq'))
                        .description(
                            'The uuid of the owner of the organisations'
                        ),
                    user: Joi.filter(Joi.string().guid())
                        .operator(Joi.valid('eq'))
                        .description(
                            'The uuid of the user to get organisations for'
                        ),
                    email: Joi.filter().description(
                        'The email of the organisation'
                    ),
                }),
            },
            plugins: {
                queryFilter: {
                    enabled: true,
                    rename: OrgModel.dbDefinition,
                },
            },
        },
        handler: async (request, h) => {
            const { db } = h.context
            const filters = request.plugins.queryFilter
            const orgs = await Organisation.find({ filters }, db)
            return orgs
        },
    },
    {
        method: 'GET',
        path: '/v2/organisations-with-apps',
        config: {
            auth: false,
            tags: ['api', 'v2'],
            cache: {
                expiresIn: 24 * 3600 * 1000,
            },
        },
        handler: async (request, h) => {
            const { db } = h.context
            const { rows: orgs } = await Organisation.getOrganisationsWithApps(
                db
            )
            return orgs
        },
    },
    {
        method: 'GET',
        path: '/v2/organisations/{orgIdOrSlug}',
        config: {
            auth: 'token',
            validate: {
                params: Joi.object({
                    orgIdOrSlug: Joi.string().required(),
                }),
            },
            tags: ['api', 'v2'],
            response: {
                schema: OrgModel.externalDefinition.label(
                    'OrganisationWithUsers'
                ),
            },
        },
        handler: async (request, h) => {
            const { db } = h.context
            const { orgIdOrSlug } = request.params
            const { includeApps, includeUsers = true } = request.query

            const isUuid =
                Joi.string().uuid().validate(orgIdOrSlug).error === undefined

            let organisation
            if (isUuid) {
                organisation = await Organisation.findOne(
                    orgIdOrSlug,
                    includeUsers,
                    db
                )
            } else {
                organisation = await Organisation.findOneBySlug(
                    orgIdOrSlug,
                    includeUsers,
                    db
                )
            }

            if (includeApps) {
                const apps = await getAppsInOrganisation(orgIdOrSlug, db)
                organisation.apps = convertAppsToApiV1Format(apps, request)
            }

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
                    email: OrgModel.definition.extract('email'),
                }),
            },
            tags: ['api', 'v2'],
            response: {
                schema: Joi.object({
                    id: Joi.string().uuid(),
                }),
            },
        },

        handler: async (request, h) => {
            const { db } = h.context

            const { id: userId } = await getCurrentUserFromRequest(request, db)
            //TODO: should everyone be able to create new organisations?

            const createOrgAndAddUser = async (trx) => {
                const organisation = await Organisation.create(
                    {
                        userId,
                        name: request.payload.name,
                        email: request.payload.email,
                    },
                    trx
                )
                await Organisation.addUserById(organisation.id, userId, trx)
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
                    email: OrgModel.definition.extract('email'),
                    owner: OrgModel.definition.extract('owner'),
                    description: OrgModel.definition.extract('description'),
                }).min(1),
                params: Joi.object({
                    orgId: OrgModel.definition.extract('id').required(),
                }),
            },
            response: {
                schema: OrgModel.definition,
            },
        },
        handler: async (request, h) => {
            const { db } = h.context
            const { id: userId } = await getCurrentUserFromRequest(request, db)
            const isManager = currentUserIsManager(request)

            const updateObj = request.payload

            const updateOrganisation = async (trx) => {
                const organisation = await Organisation.findOne(
                    request.params.orgId,
                    false,
                    trx
                )
                if (organisation.owner !== userId && !isManager) {
                    throw Boom.forbidden(
                        'You do not have permissions to update this organisation'
                    )
                }
                await Organisation.update(organisation.id, updateObj, db)
                return Organisation.findOne(request.params.orgId, false, db)
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
                    email: Joi.string().email().required(),
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

            const addUserToOrganisation = async (trx) => {
                const org = await Organisation.findOne(
                    request.params.orgId,
                    true,
                    trx
                )

                const isManager = currentUserIsManager(request)
                const isMember = org.users.findIndex((u) => u.id === id) > -1
                const canAdd = org.owner === id || isMember || isManager

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
                    try {
                        await Organisation.addUserById(
                            org.id,
                            userToAdd.id,
                            trx
                        )
                    } catch (e) {
                        const wrapped = wrapError(e)
                        if (wrapped instanceof UniqueViolationError) {
                            throw Boom.conflict(
                                'User is already a member of that organisation.'
                            )
                        }
                        throw e
                    }
                    return userToAdd
                } else {
                    throw Boom.conflict(`User with email not found.`)
                }
            }

            return db.transaction(addUserToOrganisation)
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

            const removeUserFromOrganisation = async (trx) => {
                const org = await Organisation.findOne(
                    request.params.orgId,
                    true,
                    trx
                )

                const isManager = currentUserIsManager(request)
                const isMember = org.users.findIndex((u) => u.id === id) > -1
                const canRemove = org.owner === id || isMember || isManager

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

            await db.transaction(removeUserFromOrganisation)

            return {
                statusCode: 200,
            }
        },
    },
    {
        method: 'POST',
        path: '/v2/organisations/{orgId}/invitation',
        config: {
            auth: 'token',
            tags: ['api', 'v2'],
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                    skipSend: Joi.boolean().default(false),
                }),
                params: Joi.object({
                    orgId: OrgModel.definition.extract('id').required(),
                }),
            },
        },
        handler: async (request, h) => {
            const { db } = h.context
            const currentUser = await getCurrentUserFromRequest(request)

            const org = await Organisation.findOne(
                request.params.orgId,
                true,
                db
            )
            const isMember = await Organisation.hasUser(
                org.id,
                currentUser.id,
                db
            )
            const isManager = currentUserIsManager(request)
            const canAdd = org.owner === currentUser.id || isMember || isManager

            if (!canAdd) {
                throw Boom.forbidden('You do not have permission to add users')
            }

            const { emailService } = request.services(true)
            const { decoded, token } = Organisation.generateInvitationToken(
                {
                    organisation: org,
                    user: currentUser,
                },
                request.payload.email
            )

            let baseUrl = getServerUrl(request)
            if (process.env.NODE_ENV === 'development') {
                // use referrer as frontend might be running in webpack
                baseUrl = request.info.referrer || baseUrl
            }
            baseUrl = baseUrl.replace(
                /\/(api)*$/, // replace trailing /api and /
                ''
            )
            const link = `${baseUrl}/verify/org?invitationToken=${token}`

            request.logger.info(
                `User ${currentUser.id}: Sending organisation (${org.name}) invitation to ${decoded.emailTo}`
            )

            if (!request.payload.skipSend) {
                await emailService.sendOrganisationInvitation(
                    {
                        emailTo: decoded.emailTo,
                        organisation: org.name,
                        fromName: currentUser.name,
                    },
                    link
                )
            }

            return {
                token,
                link,
            }
        },
    },
    {
        // accept invitation-endpoint
        method: 'POST',
        path: '/v2/organisations/invitation/{token}',
        config: {
            auth: 'token',
            tags: ['api', 'v2'],
            validate: {
                params: Joi.object({
                    token: Joi.string().required(),
                }),
            },
        },
        handler: async (request, h) => {
            const { id } = await getCurrentUserFromRequest(request)
            const { db } = h.context
            const { token } = request.params
            const secret = h.context.config.server.jwtSecret
            let payload

            try {
                payload = JWT.verify(token, secret)
            } catch (e) {
                request.logger.error(e)
                if (e instanceof JWT.TokenExpiredError) {
                    throw Boom.badRequest('Invitation has expired')
                }
                throw Boom.badRequest('Invalid token')
            }
            try {
                await Organisation.addUserById(payload.sub, id, db)
            } catch (e) {
                Bounce.ignore(wrapError(e), UniqueViolationError)
                throw Boom.conflict(
                    'You are already a member of that organisation'
                )
            }

            return h
                .response({
                    organisation: {
                        id: payload.sub,
                        name: payload.organisation,
                    },
                })
                .code(200)
        },
    },
]
