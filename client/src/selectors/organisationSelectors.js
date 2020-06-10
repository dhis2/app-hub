import { getUserOrganisationIds } from './userSelectors'

export const getOrganisationById = (state, id) => state.organisations.byId[id]

export const getOrganisations = state => state.organisations.byId

export const getOrganisationsList = state =>
    Object.values(getOrganisations(state))

export const getUserOrganisationsList = state => {
    const allOrgs = getOrganisationsList(state)
    const userOrgIds = getUserOrganisationIds(state)
    return allOrgs.filter(org => userOrgIds.includes(org.id))
}
