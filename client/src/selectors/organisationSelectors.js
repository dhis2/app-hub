import { createSelector } from 'reselect'
import { getFormSubmitErrors } from 'redux-form'
import { getUserOrganisationIds, getUserId, isManager } from './userSelectors'

export const getOrganisationById = (state, id) => getOrganisations(state)[id]

export const getOrganisationBySlug = (state, slug) =>
    getOrganisationsList(state).find(org => org.slug === slug)

export const getOrganisations = state => state.organisations.byId

export const getOrganisationsList = state =>
    Object.values(getOrganisations(state))

// list of organisations that user is member of
export const getUserOrganisationsList = state => {
    const allOrgs = getOrganisationsList(state)
    const userOrgIds = getUserOrganisationIds(state)
    return allOrgs.filter(org => userOrgIds.includes(org.id))
}

// list of organisations that user have rights to view
// eg. full list of orgs for managers
export const getAuthorizedOrganisationsList = state => {
    return isManager(state)
        ? getOrganisationsList(state)
        : getUserOrganisationsList(state)
}

export const hasAccessToOrganisation = (state, orgId) => {
    return getAuthorizedOrganisationsList(state).findIndex(
        org => org.id === orgId
    )
}

export const isOwner = (state, orgId) => {
    const userId = getUserId(state)
    return getOrganisationById(state, orgId).owner.id === userId
}

export const isMember = (state, orgId) => {
    return getUserOrganisationIds(state).includes(orgId)
}

export const canEditOrganisation = (state, orgId) =>
    isOwner(state, orgId) || isManager(state)

export const getOrgMembers = (state, orgId) =>
    getOrganisationById(state, orgId).users || []

export const getSortedOrgMembers = createSelector(
    (state, orgId) => getOrganisationById(state, orgId).owner,
    (state, orgId) => getOrgMembers(state, orgId),
    (orgOwner, members) =>
        [...members].sort((a, b) => {
            if (a.id === orgOwner.id) {
                return -1
            }
            if (b.id === orgOwner.id) {
                return 1
            }
        })
)
