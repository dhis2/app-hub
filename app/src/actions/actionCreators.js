import * as actions from '../constants/actionTypes';
import {REVERT, COMMIT} from 'redux-optimistic-ui';

//OPTIMISTIC-ACTION HANDLERS


/**
 * Action-enhancer that produces an optimistic action
 * by adding optimistic meta properties
 * @param action
 */
const optimisticActionCreator = action => ({
    ...action,
    meta: {...action.meta, isOptimistic: true}
})

/**
 * Commit or revert an optimistic action that has been handled by the server
 * @param action to handle
 * @param transactionID of the optimistic-action
 * @param error: override error in action.error, willr evert the action
 * @returns action with enhanced properties so that redux-optimistic-ui can handle the reverted or commited action
 */
export const commitOrRevertOptimisticAction = (action, transactionID, error = false) => {
    if (action.error) {
        error = true;
    }
    return {
        ...action,
        meta: {
            ...action.meta,
            optimistic: error ? {type: REVERT, id: transactionID} : {type: COMMIT, id: transactionID}
        }
    }
}

export const commitOptimisticAction = (action, transactionID) => {
    return {
        ...action,
        meta: {
            ...action.meta,
            optimistic: {type: COMMIT, id: transactionID}
        }
    }
}

export const revertOptimisticAction = (action, transactionID) => {
    return {
        ...action,
        meta: {
            ...action.meta,
            optimistic: {type: REVERT, id: transactionID}
        }
    }
}


//ACTION-CREATORS


export const loadAllApps = createActionCreator(actions.APPS_ALL_LOAD);

export const appsAllLoaded = createActionCreator(actions.APPS_ALL_LOADED);


export const loadApprovedApps = createActionCreator(actions.APPS_APPROVED_LOAD);

export const loadedApprovedApps = createActionCreator(actions.APPS_APPROVED_LOADED);

export const setAppApproval = payload => (
    optimisticActionCreator(createActionCreator(actions.SET_APPROVAL_APP)({
        ...payload
    }))
)

export const setAppApprovalSuccess = payload => (
    createActionCreator(actions.SET_APPROVAL_APP_SUCCESS)({
        ...payload
    })
)

export const userLoad = createActionCreator(actions.USER_LOAD);

export const addAppVersion = (version, file, appId) => (
    createActionCreator(actions.APP_VERSION_ADD)({
        version,
        file,
        appId
    })
)

export const addApp = (app, file, image) => (
    createActionCreator(actions.APP_ADD)({
        app,
        file,
        image
    })
)

export const editApp = (app, data) => (
    optimisticActionCreator(createActionCreator(actions.APP_EDIT)({
        app,
        data
    }))
)

export const editImage = (appId, imageId, data) => (
    optimisticActionCreator(createActionCreator(actions.APP_IMAGE_EDIT)({
        appId,
        imageId,
        data
    }))
)

export const editImageSuccess = (appId, imageId, data) => (
    createActionCreator(actions.APP_IMAGE_EDIT_SUCCESS)({
        appId,
        imageId,
        data,
    })
)

export const editImageLogo = (appId, imageId, logo) => (
    createActionCreator(actions.APP_IMAGE_EDIT)({
        appId,
        imageId,
        data: {
            logo,
        },
    })
)

export const editAppVersion = (appId, version) => (
    optimisticActionCreator(createActionCreator(actions.APP_VERSION_EDIT)({
        appId,
        version
    })));

export const editAppVersionSuccess = (appId, version) => {
    return createActionCreator(actions.APP_VERSION_EDIT_SUCCESS)({
        appId,
        version
    })
}

export const addAppSuccess = (app) => (
    createActionCreator(actions.APP_ADD_SUCCESS)({
        app
    })
)

/**
 *
 * @param appId for image to belong to
 * @param image of shape:
 * image: {
 *      image: {
 *          caption,
 *          description,
 *          logo
 *          }
 *      file: imageFile
 * }
 */
export const addImageToApp = (appId, image) => (
    createActionCreator(actions.APP_IMAGE_ADD)({
        appId,
        image
    })
)

export const addImageToAppSuccess = (appId, image) => (
    createActionCreator(actions.APP_IMAGE_ADD_SUCCESS)({
        appId,
        image
    })
)

export const deleteImageFromApp = (appId, imageId) => (
    optimisticActionCreator(createActionCreator(actions.APP_IMAGE_DELETE)({
        appId,
        imageId
    }))
)

export const deleteImageFromAppSuccess = (appId, imageId) => (
    createActionCreator(actions.APP_IMAGE_DELETE_SUCCESS)({
        appId,
        imageId
    })
)

export const deleteAppVersion = (version, appId) => (
    optimisticActionCreator(createActionCreator(actions.APP_VERSION_DELETE)({
        version,
        appId
    })))

export const deleteAppVersionSuccess = (version, appId) => {
    return createActionCreator(actions.APP_VERSION_DELETE_SUCCESS)({
        version,
        appId
    })
}
export const addAppVersionSuccess = (version, appId) => (
    createActionCreator(actions.APP_VERSION_ADD_SUCCESS)({
        version,
        appId
    })
)

export const editAppSuccess = (app, data) => (
    createActionCreator(actions.APP_EDIT_SUCCESS)({
        app,
        data
    })
)

export const deleteApp = (app) => (
    optimisticActionCreator(createActionCreator(actions.APP_DELETE)({
        app
    }))
)

export const deleteAppSuccess = (app) => (
    createActionCreator(actions.APP_DELETE_SUCCESS)({
        app
    })
)

export const userLoaded = (profile) => (
    createActionCreator(actions.USER_LOADED)({
        profile
    })
)

export const userError = createActionCreator(actions.USER_ERROR);
export const userAppsLoad = createActionCreator(actions.USER_APPS_LOAD);
export const userAppsLoaded = createActionCreator(actions.USER_APPS_LOADED);

export const userAuthenticated = createActionCreator(actions.USER_AUTHENTICATED);
export const userLogout = createActionCreator(actions.USER_LOGOUT);

export const loadUserApp = (appId) => (
    createActionCreator(actions.APP_LOAD)({
        ...appId,
        useAuth: true
    })
)

export const loadApp = createActionCreator(actions.APP_LOAD);
export const loadAppSuccess = createActionCreator(actions.APP_LOADED);
export const appError = createActionCreator(actions.APP_ERROR);

/**
 *
 * @param type of action
 * @param error payload
 * @param meta object to use in action.
 * meta.retryAction: action that can be dispatched to retry the action that failed.
 * @returns {action}
 */
export const createActionError = (type, error, meta) => (
    createActionCreator(type)(error, meta, true)
)

/**
 * Generic action-creator
 * @param type of action
 * @returns FSA-complient action
 */
function createActionCreator(type) {
    return (payload, meta, error) => {
        if (payload == null) {
            payload = {};
        }
        return {
            type,
            payload,
            meta,
            error
        };
    }
}


export const emptySnackbar = createActionCreator(actions.SNACKBAR_EMPTY);

/**
 * openDialog - Action creator helper method for creating dialogs
 *
 * @param  {string} dialogType  The type of dialog to open
 * @param  {object} dialogprops The props passed to the dialog
 * @return {object}             Dialog action
 */
export const openDialog = (dialogType, dialogprops) => (
    createActionCreator(actions.OPEN_DIALOG)({
        dialogprops: {...dialogprops},
        dialogType,
    })
)

/**
 * closeDialog - Action creator helper method for handling dialogs
 *
 * @param  {string} dialogType  The type of dialog to close
 * @return {object}             Dialog action
 */
export const closeDialog = createActionCreator(actions.CLOSE_DIALOG)
