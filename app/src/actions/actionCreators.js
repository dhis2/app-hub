import * as actions from '../constants/actionTypes';
import {REVERT, COMMIT} from 'redux-optimistic-ui';

const optimisticActionCreator = action => ({
    ...action,
    meta: {...action.meta, isOptimistic: true}
})

export const commitOrRevertOptimisticAction = (action, transactionID, error = false) => {
    if(action.error) {
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

export const setAppApproval = payload => (
    optimisticActionCreator(createActionCreator(actions.SET_APPROVAL_APP)({
        ...payload
    }))
)

export const setAppApprovalSuccess = payload => ({
    type: actions.SET_APPROVAL_APP_SUCCESS,
    payload
})

export const userLoad = () => ({
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

export const deleteImageFromAppSuccess = (appId, imageId) => {
    return createActionCreator(actions.APP_IMAGE_DELETE_SUCCESS)({
        appId,
        imageId
    })
}

export const deleteAppVersion = (version, appId) => {
    return optimisticActionCreator(createActionCreator(actions.APP_VERSION_DELETE)({
        version,
        appId
    }))
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
    return optimisticActionCreator(createActionCreator(actions.APP_DELETE)({
        app
    }));
}

export const deleteAppSuccess = (app) => {

    return createActionCreator(actions.APP_DELETE_SUCCESS)({
        app
    })
}

//TODO: add signature to these
export const userLoaded = (profile) => {

    return createActionCreator(actions.USER_LOADED)({
        profile
    });
}
export const userError = createActionCreator(actions.USER_ERROR);
export const userAppsLoad = createActionCreator(actions.USER_APPS_LOAD);
export const userAppsLoaded = createActionCreator(actions.USER_APPS_LOADED);

export const userAuthenticated = createActionCreator(actions.USER_AUTHENTICATED);
export const userLogout = createActionCreator(actions.USER_LOGOUT);

export const loadUserApp = (appId) => {
    return createActionCreator(actions.APP_LOAD)({
        ...appId,
        useAuth: true
    });
}

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
export const createActionError = (type, error, meta) => {
    return createActionCreator(type)(error, meta, true);
}

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
export function openDialog(dialogType, dialogprops) {
    return {
        type: actions.OPEN_DIALOG,
        payload: {
            dialogprops: {...dialogprops},
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