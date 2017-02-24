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

export const appVersionAdd = (version,file,appId) => {
    return {
        type: actions.APP_VERSION_ADD,
        payload: {
            version,
            file,
            appId
        }

    }
}
export const appVersionAdded = createActioncreator(actions.APP_VERSION_ADD_SUCCESS);

export const userLoaded = createActioncreator(actions.USER_LOADED);
export const userAppsLoad = createActioncreator(actions.USER_APPS_LOAD);
export const userAppsLoaded = createActioncreator(actions.USER_APPS_LOADED);

export const appLoad = createActioncreator(actions.APP_LOAD);
export const appLoaded = createActioncreator(actions.APP_LOADED);
export const appError = createActioncreator(actions.APP_ERROR);

function createActioncreator(type) {
    return (payload) => ({
        type,
        payload
    });
}



/**
 * openDialog - Action creator helper method for creating dialogs
 *
 * @param  {string} dialogType  The type of dialog to open
 * @param  {object} dialogprops The props passed to the dialog
 * @return {object}             Dialog action
 */
export function openDialog(dialogType, dialogprops) {
    return {
        type: actions.OPEN_DIALOG,
        payload: {
            dialogprops: { ...dialogprops },
            dialogType,
        },

    };
}

/**
 * closeDialog - Action creator helper method for handling dialogs
 *
 * @param  {string} dialogType  The type of dialog to close
 * @return {object}             Dialog action
 */
export function closeDialog() {
    return {
        type: actions.CLOSE_DIALOG,
    };
}