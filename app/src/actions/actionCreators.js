import * as actions from '../constants/actionTypes';


export function appsAllLoad() {
    return {
        type: actions.APPS_ALL_LOAD
    }
}

export function appsAllLoaded(payload) {
    return {
        type: actions.APPS_ALL_LOADED,
        payload
    }
}

export function appsApprovedLoad() {
    return {
        type: actions.APPS_APPROVED_LOAD
    }
}

export function appsApprovedLoaded(payload) {
    return {
        type: actions.APPS_APPROVED_LOADED,
        payload
    }
}

export const approveApp = payload => ({
    type: actions.APPROVE_APP,
    payload
})

export const approveAppSuccess = payload => ({
    type: actions.APPROVE_APP_SUCCESS,
    payload
})

export const userLoad = () =>({
    type: actions.USER_LOAD
})

export const userLoaded = (payload) => ({
    type: actions.USER_LOADED,
    payload
})

export const userAppsLoad = () => ({
    type: actions.USER_APPS_LOAD
})

export const userAppsLoaded = (payload) => ({
    type: actions.USER_APPS_LOADED,
    payload
})
