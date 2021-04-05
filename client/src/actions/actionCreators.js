import { REVERT, COMMIT } from 'redux-optimistic-ui'
import * as actions from '../constants/actionTypes'

//OPTIMISTIC-ACTION HANDLERS

/**
 * Action-enhancer that produces an optimistic action
 * by adding optimistic meta properties
 * @param action
 */
const optimisticActionCreator = action => ({
    ...action,
    meta: { ...action.meta, isOptimistic: true },
})

/**
 * Commit or revert an optimistic action that has been handled by the server
 * @param action to handle
 * @param transactionID of the optimistic-action
 * @param error: override error in action.error, will revert the action
 * @returns action with enhanced properties so that redux-optimistic-ui can handle the reverted or committed action
 */
export const commitOrRevertOptimisticAction = (
    action,
    transactionID,
    error = false
) => {
    if (action.error) {
        error = true
    }
    return {
        ...action,
        meta: {
            ...action.meta,
            optimistic: error
                ? { type: REVERT, id: transactionID }
                : { type: COMMIT, id: transactionID },
        },
    }
}

export const commitOptimisticAction = (action, transactionID) => {
    return {
        ...action,
        meta: {
            ...action.meta,
            optimistic: { type: COMMIT, id: transactionID },
        },
    }
}

export const revertOptimisticAction = (action, transactionID) => {
    return {
        ...action,
        meta: {
            ...action.meta,
            optimistic: { type: REVERT, id: transactionID },
        },
    }
}

//ACTION-CREATORS

export const loadAllApps = actionCreator(actions.APPS_ALL_LOAD)

export const appsAllLoaded = actionCreator(actions.APPS_ALL_LOADED)

export const setAppApproval = (appID, status) =>
    optimisticActionCreator(
        actionCreator(actions.SET_APPROVAL_APP)({
            appID,
            status,
        })
    )

export const setAppApprovalSuccess = payload =>
    actionCreator(actions.SET_APPROVAL_APP_SUCCESS)({
        ...payload,
    })

export const loadUser = actionCreator(actions.USER_LOAD)

export const addAppVersion = (version, file, appId) =>
    actionCreator(actions.APP_VERSION_ADD)({
        version,
        file,
        appId,
    })

export const addApp = (app, file, image) =>
    actionCreator(actions.APP_ADD)({
        app,
        file,
        image,
    })

export const editApp = (app, data) =>
    optimisticActionCreator(
        actionCreator(actions.APP_EDIT)({
            app,
            data,
        })
    )

export const editImage = (appId, imageId, data) =>
    optimisticActionCreator(
        actionCreator(actions.APP_IMAGE_EDIT)({
            appId,
            imageId,
            data,
        })
    )

export const editImageSuccess = (appId, imageId, data) =>
    actionCreator(actions.APP_IMAGE_EDIT_SUCCESS)({
        appId,
        imageId,
        data,
    })

export const editImageLogo = (appId, imageId, logo) =>
    optimisticActionCreator(
        actionCreator(actions.APP_IMAGE_EDIT)({
            appId,
            imageId,
            data: {
                logo,
            },
        })
    )

export const editAppVersion = (appId, version) =>
    optimisticActionCreator(
        actionCreator(actions.APP_VERSION_EDIT)({
            appId,
            version,
        })
    )

export const editAppVersionSuccess = (appId, version) =>
    actionCreator(actions.APP_VERSION_EDIT_SUCCESS)({
        appId,
        version,
    })

export const addAppSuccess = app =>
    actionCreator(actions.APP_ADD_SUCCESS)({
        app,
    })

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
export const addImageToApp = (appId, image) =>
    actionCreator(actions.APP_IMAGE_ADD)({
        appId,
        image,
    })

export const addMultipleImagesToApp = (appId, images) =>
    actionCreator(actions.APP_IMAGES_ADD)({
        appId,
        images,
    })

export const addMultipleImagesToAppSuccess = (appId, images) =>
    actionCreator(actions.APP_IMAGES_ADD_SUCCESS)({
        appId,
        images,
    })

export const addImageToAppSuccess = (appId, image) =>
    actionCreator(actions.APP_IMAGE_ADD_SUCCESS)({
        appId,
        image,
    })

export const deleteImageFromApp = (appId, imageId) =>
    optimisticActionCreator(
        actionCreator(actions.APP_IMAGE_DELETE)({
            appId,
            imageId,
        })
    )

export const deleteImageFromAppSuccess = (appId, imageId) =>
    actionCreator(actions.APP_IMAGE_DELETE_SUCCESS)({
        appId,
        imageId,
    })

export const deleteAppVersion = (version, appId) =>
    optimisticActionCreator(
        actionCreator(actions.APP_VERSION_DELETE)({
            version,
            appId,
        })
    )

export const deleteAppVersionSuccess = (version, appId) =>
    actionCreator(actions.APP_VERSION_DELETE_SUCCESS)({
        version,
        appId,
    })

export const addAppVersionSuccess = (version, appId) =>
    actionCreator(actions.APP_VERSION_ADD_SUCCESS)({
        version,
        appId,
    })

export const editAppSuccess = (app, data) =>
    actionCreator(actions.APP_EDIT_SUCCESS)({
        app,
        data,
    })

export const deleteApp = app =>
    optimisticActionCreator(
        actionCreator(actions.APP_DELETE)({
            app,
        })
    )

export const deleteAppSuccess = app =>
    actionCreator(actions.APP_DELETE_SUCCESS)({
        app,
    })

export const userLoaded = profile =>
    actionCreator(actions.USER_LOAD_SUCCESS)({
        profile,
    })

export const userLoadError = actionCreator(actions.USER_LOAD_ERROR)

export const loadUserApps = actionCreator(actions.USER_APPS_LOAD)
export const userAppsLoaded = actionCreator(actions.USER_APPS_LOADED)

export const loadUserApp = appId =>
    actionCreator(actions.APP_LOAD)({
        ...appId,
        useAuth: true,
    })

export const loadApp = actionCreator(actions.APP_LOAD)
export const loadAppSuccess = actionCreator(actions.APP_LOADED)
export const appError = actionCreator(actions.APP_ERROR)

export const loadChannels = actionCreator(actions.CHANNELS_LOAD_BEGIN)
export const loadChannelsSuccess = actionCreator(actions.CHANNELS_LOAD_SUCCESS)
export const channelError = actionCreator(actions.CHANNELS_LOAD_ERROR)

/**
 *
 * @param type of action
 * @param error payload
 * @param meta object to use in action.
 * meta.retryAction: action that can be dispatched to retry the action that failed.
 * @returns {action}
 */
export const actionErrorCreator = (type, error, meta) =>
    actionCreator(type)(error, meta, true)

/**
 * Generic action-creator
 * @param type of action
 * @returns {object} FSA-compliant action
 */
function actionCreator(type) {
    return (payload, meta, error) => {
        if (payload == null) {
            payload = {}
        }
        return {
            type,
            payload,
            meta,
            error,
        }
    }
}

export const emptySnackbar = actionCreator(actions.SNACKBAR_EMPTY)

/**
 * openDialog - Action creator helper method for creating dialogs
 *
 * @param  {string} dialogType  The type of dialog to open
 * @param  {object} dialogprops The props passed to the dialog
 * @return {object}             Dialog action
 */
export const openDialog = (dialogType, dialogprops) =>
    actionCreator(actions.OPEN_DIALOG)({
        dialogprops: { ...dialogprops },
        dialogType,
    })

/**
 * closeDialog - Action creator helper method for handling dialogs
 *
 * @param  {string} dialogType  The type of dialog to close
 * @return {object}             Dialog action
 */
export const closeDialog = actionCreator(actions.CLOSE_DIALOG)

export const searchOrganisation = actionCreator(actions.ORGANISATIONS_SEARCH)

export const getMe = actionCreator(actions.ME_LOAD)

export const loadCurrentUserOrganisations = () =>
    actionCreator(actions.ORGANISATIONS_LOAD)({
        currentUser: true,
    })

export const loadAllOrganisations = () =>
    actionCreator(actions.ORGANISATIONS_LOAD)()

export const loadOrganisation = orgId =>
    actionCreator(actions.ORGANISATION_LOAD)({
        orgId,
    })

export const addOrganisationMember = (orgId, email) =>
    actionCreator(actions.ORGANISATION_MEMBER_ADD)({ orgId, email })

export const removeOrganisationMember = (orgId, userId) =>
    actionCreator(actions.ORGANISATION_MEMBER_REMOVE)({ orgId, userId })

export const addOrganisation = orgObject =>
    actionCreator(actions.ORGANISATION_ADD)(orgObject)

export const editOrganisation = (orgId, editObject) =>
    actionCreator(actions.ORGANISATION_EDIT)({ orgId, ...editObject })
