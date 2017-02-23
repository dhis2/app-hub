import * as actions from '../constants/actionTypes';

export function appsAllLoad() {
    return {
        type: actions.APPS_ALL_LOAD
    }
}

export const appsAllLoaded = createActioncreator(actions.APPS_ALL_LOADED);


export function appsApprovedLoad() {
    return {
        type: actions.APPS_APPROVED_LOAD
    }
}

export const appsApprovedLoaded = createActioncreator(actions.APPS_APPROVED_LOADED);
export const setAppApproval = payload => ({
    type: actions.SET_APPROVAL_APP,
    payload
})

export const setAppApprovalSuccess = payload => ({
    type: actions.SET_APPROVAL_APP_SUCCESS,
    payload
})

export const userLoad = () =>({
    type: actions.USER_LOAD
})

export const userLoaded = createActioncreator(actions.USER_LOADED);
export const userAppsLoad = createActioncreator(actions.USER_APPS_LOAD);
export const userAppsLoaded = createActioncreator(actions.USER_APPS_LOADED);

function createActioncreator(type) {
    return (payload) => ({
        type,
        payload
    });
}