import { getUserOrganisationIds, getUserId, isManager } from './userSelectors'
import { getFormSubmitErrors } from 'redux-form'

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
    return getAuthorizedOrganisationsList.findIndex(org => org.id === orgId)
}

export const isOwner = (state, orgId) => {
    const userId = getUserId(state)
    return getOrganisationById(state, orgId).owner === userId
}

export const isMember = (state, orgId) => {
    return getUserOrganisationIds(state).includes(orgId)
}

export const canEditOrganisation = (state, orgId) => isOwner(state, orgId) || isManager(state)