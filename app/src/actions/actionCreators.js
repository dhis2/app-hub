import * as actions from '../constants/actionTypes';

export function loadAllApps() {
    return {
        type: actions.APPS_ALL_LOAD
    }
}

export const appsAllLoaded = createActionCreator(actions.APPS_ALL_LOADED);


export function loadApprovedApps() {
    return {
        type: actions.APPS_APPROVED_LOAD
    }
}

export const loadedApprovedApps = createActionCreator(actions.APPS_APPROVED_LOADED);
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

export const addAppVersion = (version, file, appId) => {
    return {
        type: actions.APP_VERSION_ADD,
        payload: {
            version,
            file,
            appId
        }

    }
}
export const addApp = (app, file, image) => {
    return createActionCreator(actions.APP_ADD)({
        app,
        file,
        image
    })
}
export const editApp = (app, data) => (
    createActionCreator(actions.APP_EDIT)({
        app,
        data
    })
)
export const addAppSuccess = (app) => (
    createActionCreator(actions.APP_ADD_SUCCESS)({
        app
    })
)

export const deleteAppVersion = (version, appId) => {
    return createActionCreator(actions.APP_VERSION_DELETE)({
        version,
        appId
    })
}

export const deleteAppVersionSuccess = (version, appId) => {
    return createActionCreator(actions.APP_VERSION_DELETE_SUCCESS)({
        version,
        appId
    })
}
export const addAppVersionSuccess = (version, appId) => {

    return createActionCreator(actions.APP_VERSION_ADD_SUCCESS)({
        version,
        appId
    });
}

export const editAppSuccess = (app, data) => {

    return createActionCreator(actions.APP_EDIT_SUCCESS)({
        app,
        data
    });
}

export const deleteApp = (app) => {
    return createActionCreator(actions.APP_DELETE)({
        app
    });
}

export const deleteAppSuccess = (app) => {

    return createActionCreator(actions.APP_DELETE_SUCCESS)({
        app
    })
}

//TODO: add signature to these
export const userLoaded = createActionCreator(actions.USER_LOADED);
export const userAppsLoad = createActionCreator(actions.USER_APPS_LOAD);
export const userAppsLoaded = createActionCreator(actions.USER_APPS_LOADED);

export const appLoad = createActionCreator(actions.APP_LOAD);
export const appLoaded = createActionCreator(actions.APP_LOADED);
export const appError = createActionCreator(actions.APP_ERROR);

function createActionCreator(type) {
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