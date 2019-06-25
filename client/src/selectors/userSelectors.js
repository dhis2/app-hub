import { ensureState as reduxEnsureState } from 'redux-optimistic-ui'

//Alias this, as the state is only optimistic for appList
const ensureState = state => reduxEnsureState(state.user.appList)

export const getApp = (state, appId) => ensureState(state).byId[appId]

export const getUserInfo = state => state.user.userInfo

export const getUserProfile = state => getUserInfo(state).profile

export const getUserAppList = state => ensureState(state)

export const getAppLogo = (state, appId) => {
    const app = ensureState(state).byId[appId]
    if (!app) return null
    return app.images.filter(image => image.logo)[0] || null
}
