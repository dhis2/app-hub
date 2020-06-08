import * as actions from '../constants/actionTypes'
import * as actionCreators from './actionCreators'
import { combineEpics, ofType } from 'redux-observable'
import { Auth } from '../api/api'
import { history } from '../utils/history'
import * as api from '../api/api'
import {
    concatMap,
    switchMap,
    mergeAll,
    debounceTime,
    catchError,
    filter,
    distinctUntilChanged,
} from 'rxjs/operators'
import { of, from, merge } from 'rxjs'
import { startAsyncValidation, stopAsyncValidation } from 'redux-form'
import { validateOrganisation } from '../components/form/UploadAppFormStepper'
import * as userSelectors from '../selectors/userSelectors'

const loadAppsAll = action$ =>
    action$.pipe(
        ofType(actions.APPS_ALL_LOAD),
        concatMap(() => {
            return api
                .getAllApps()
                .then(apps => actionCreators.appsAllLoaded(apps))
                .catch(error =>
                    actionCreators.actionErrorCreator(
                        actions.APPS_ALL_ERROR,
                        error
                    )
                )
        })
    )

const loadAppsApproved = action$ =>
    action$.pipe(
        ofType(actions.APPS_APPROVED_LOAD),
        concatMap(() => {
            return api
                .getApprovedApps()
                .then(apps => actionCreators.loadedApprovedApps(apps))
                .catch(error =>
                    actionCreators.actionErrorCreator(
                        actions.APPS_APPROVED_ERROR,
                        error
                    )
                )
        })
    )

const loadApp = action$ =>
    action$.pipe(
        ofType(actions.APP_LOAD),
        concatMap(action => {
            const { appId, useAuth } = action.payload
            return api
                .getApp(appId, useAuth)
                .then(app => actionCreators.loadAppSuccess(app))
                .catch(error => ({
                    type: actions.APP_ERROR,
                    payload: error,
                }))
        })
    )

/**
 * Optimistic action
 * @param action$
 */
const setAppApproval = action$ =>
    action$.pipe(
        ofType(actions.SET_APPROVAL_APP),
        concatMap(action => {
            const {
                app: { id },
                status,
            } = action.payload
            const { id: transactionID } = action.meta.optimistic
            return api
                .setAppApproval(id, status)
                .then(() =>
                    actionCreators.commitOrRevertOptimisticAction(
                        actionCreators.setAppApprovalSuccess(action.payload),
                        transactionID
                    )
                )
                .catch(error =>
                    actionCreators.commitOrRevertOptimisticAction(
                        actionCreators.actionErrorCreator(
                            actions.SET_APPROVAL_APP_ERROR,
                            error
                        ),
                        transactionID
                    )
                )
        })
    )

const deleteApp = action$ =>
    action$.pipe(
        ofType(actions.APP_DELETE),
        concatMap(action => {
            const { id } = action.meta.optimistic
            return api
                .deleteApp(action.payload.app.id)
                .then(() =>
                    actionCreators.commitOrRevertOptimisticAction(
                        actionCreators.deleteAppSuccess(action.payload.app),
                        id
                    )
                )
                .catch(error =>
                    actionCreators.commitOrRevertOptimisticAction(
                        actionCreators.actionErrorCreator(
                            actions.APP_DELETE_ERROR,
                            error
                        ),
                        id
                    )
                )
        })
    )

const user = action$ =>
    action$.pipe(
        ofType(actions.USER_LOAD),
        concatMap(() => {
            return [
                new Promise((resolve, reject) => {
                    Auth.lock.getProfile(Auth.getToken(), (error, profile) => {
                        if (error) {
                            reject(actionCreators.userError())
                        } else {
                            Auth.setProfile(profile)
                            resolve(actionCreators.userLoaded(profile))
                        }
                    })
                }),
                of({
                    type: actions.ME_LOAD,
                }),
            ]
        }),
        mergeAll()
    )

const userApps = action$ =>
    action$.pipe(
        ofType(actions.USER_APPS_LOAD),
        concatMap(() => {
            return api
                .getUserApps()
                .then(apps => actionCreators.userAppsLoaded(apps))
                .catch(error => ({
                    type: actions.USER_APPS_ERROR,
                    payload: error,
                }))
        })
    )

const newVersion = action$ =>
    action$.pipe(
        ofType(actions.APP_VERSION_ADD),
        concatMap(action => {
            return api
                .createNewVersion(action.payload.appId, action.payload)
                .then(version =>
                    actionCreators.addAppVersionSuccess(
                        version,
                        action.payload.appId
                    )
                )
                .catch(error => ({
                    type: actions.APP_VERSION_ADD_ERROR,
                    payload: error,
                }))
        })
    )

const newApp = action$ =>
    action$.pipe(
        ofType(actions.APP_ADD),
        concatMap(action => {
            return api
                .createApp(action.payload)
                .catch(response => {
                    if (response.status === 400) {
                        return response.json()
                    }
                    return {
                        type: actions.APP_ADD_ERROR,
                        payload: response,
                    }
                })
                .then(json => {
                    if (json.statusCode && json.statusCode === 400) {
                        return {
                            type: actions.APP_ADD_ERROR,
                            payload: { message: json.message },
                        }
                    } else {
                        history.push('/user')
                        return actionCreators.addAppSuccess(json)
                    }
                })
        })
    )

/**
 * Optimistic action
 * @param action$
 */

const editApp = action$ =>
    action$.pipe(
        ofType(actions.APP_EDIT),
        concatMap(action => {
            const { app, data } = action.payload
            const { id } = action.meta.optimistic
            return api
                .updateApp(app.id, data)
                .then(() =>
                    actionCreators.commitOrRevertOptimisticAction(
                        actionCreators.editAppSuccess(app, data),
                        id
                    )
                )
                .catch(error =>
                    actionCreators.commitOrRevertOptimisticAction(
                        actionCreators.actionErrorCreator(
                            actions.APP_EDIT_ERROR,
                            error
                        ),
                        id
                    )
                )
        })
    )

/**
 * Optimistic action
 * @param action$
 */
const deleteVersion = action$ =>
    action$.pipe(
        ofType(actions.APP_VERSION_DELETE),
        concatMap(action => {
            const { appId, version } = action.payload
            const { id } = action.meta.optimistic
            return api
                .deleteVersion(appId, version.id)
                .then(() =>
                    actionCreators.commitOrRevertOptimisticAction(
                        actionCreators.deleteAppVersionSuccess(
                            version,
                            action.payload.appId
                        ),
                        id
                    )
                )
                .catch(error =>
                    actionCreators.commitOrRevertOptimisticAction(
                        actionCreators.actionErrorCreator(
                            actions.APP_VERSION_DELETE_ERROR,
                            error
                        ),
                        id
                    )
                )
        })
    )

const addImage = action$ =>
    action$.pipe(
        ofType(actions.APP_IMAGE_ADD),
        concatMap(action => {
            const { appId, image } = action.payload
            return api
                .createNewImage(appId, image)
                .then(response =>
                    actionCreators.addImageToAppSuccess(appId, response)
                )
                .catch(error => ({
                    type: actions.APP_IMAGE_ADD_ERROR,
                    payload: error,
                }))
        })
    )

const addMultipleImages = action$ =>
    action$.pipe(
        ofType(actions.APP_IMAGES_ADD),
        concatMap(action => {
            const { appId, images } = action.payload
            let successCount = 0
            const promises = images.map((image, i) => {
                return api
                    .createNewImage(appId, image)
                    .then(response => {
                        successCount++
                        return actionCreators.addImageToAppSuccess(
                            appId,
                            response
                        )
                    })
                    .catch(error =>
                        actionCreators.actionErrorCreator(
                            actions.APP_IMAGE_ADD_ERROR,
                            {
                                ...image,
                                fieldIndex: i,
                                message: error,
                            }
                        )
                    )
            })
            const allCompleted = Promise.all(promises).then(imageActions => {
                if (successCount != images.length) {
                    return actionCreators.actionErrorCreator(
                        actions.APP_IMAGES_ADD_ERROR
                    )
                }
                return actionCreators.addMultipleImagesToAppSuccess(
                    appId,
                    imageActions
                )
            })
            return [...promises, allCompleted]
            //return from([...promises, allCompleted]).pipe(mergeAll())
        }),
        mergeAll()
    )

/**
 * Optimistic action
 * @param action$
 */
const deleteImage = action$ =>
    action$.pipe(
        ofType(actions.APP_IMAGE_DELETE),
        concatMap(action => {
            const { appId, imageId } = action.payload
            const { id } = action.meta.optimistic
            return api
                .deleteImage(appId, imageId)
                .then(() =>
                    actionCreators.commitOrRevertOptimisticAction(
                        actionCreators.deleteImageFromAppSuccess(
                            appId,
                            imageId
                        ),
                        id
                    )
                )
                .catch(error =>
                    actionCreators.commitOrRevertOptimisticAction(
                        actionCreators.actionErrorCreator(
                            actions.APP_IMAGE_DELETE_ERROR,
                            error
                        ),
                        id
                    )
                )
        })
    )

/**
 * Optimistic action
 * @param action$
 */
const editImage = action$ =>
    action$.pipe(
        ofType(actions.APP_IMAGE_EDIT),
        concatMap(action => {
            const { appId, imageId, data } = action.payload
            const { id } = action.meta.optimistic
            return api
                .updateImage(appId, imageId, data)
                .then(() =>
                    actionCreators.commitOrRevertOptimisticAction(
                        actionCreators.editImageSuccess(appId, imageId, data),
                        id
                    )
                )
                .catch(error =>
                    actionCreators.commitOrRevertOptimisticAction(
                        actionCreators.actionErrorCreator(
                            actions.APP_IMAGE_EDIT_ERROR,
                            error
                        ),
                        id
                    )
                )
        })
    )

/**
 * Optimistic action
 * @param action$
 */
const editVersion = action$ =>
    action$.pipe(
        ofType(actions.APP_VERSION_EDIT),
        concatMap(action => {
            const { appId, version } = action.payload
            const versionObj = {
                demoUrl: version.demoUrl,
                maxDhisVersion: version.maxDhisVersion,
                minDhisVersion: version.minDhisVersion,
                version: version.version,
                channel: version.channel,
            }

            const { id } = action.meta.optimistic
            return api
                .updateVersion(appId, version.id, versionObj)
                .then(() =>
                    actionCreators.commitOrRevertOptimisticAction(
                        actionCreators.editAppVersionSuccess(appId, versionObj),
                        id
                    )
                )
                .catch(error =>
                    actionCreators.commitOrRevertOptimisticAction(
                        actionCreators.actionErrorCreator(
                            actions.APP_VERSION_EDIT_ERROR,
                            error,
                            { retryAction: action }
                        ),
                        id
                    )
                )
        })
    )

const loadChannels = action$ =>
    action$.pipe(
        ofType(actions.CHANNELS_LOAD_BEGIN),
        concatMap(() => {
            return api
                .getAllChannels()
                .then(channels => actionCreators.loadChannelsSuccess(channels))
                .catch(error => actionCreators.channelError(error))
        })
    )

/**
 * Gets organisation by name
 *
 * Need to have validation here, as the validation is based upon the
 * results and thus we cannot use regular promise validation.
 * Async validation is used to prevent form-submission and clicking continue
 * We are also using synchronous validation for orgs that have been fetched earlier
 */
const searchOrganisation = (action$, state$) =>
    action$.pipe(
        ofType(actions.ORGANISATIONS_SEARCH),
        filter(action => !!action.payload.name),
        distinctUntilChanged(
            (prev, curr) => prev.payload.name === curr.payload.name
        ),
        debounceTime(250),
        switchMap(action => {
            return merge(
                of(startAsyncValidation('uploadAppForm')),
                from(api.searchOrganisations(action.payload.name)).pipe(
                    switchMap(orgs => {
                        const memberOfOrgs =
                            state$.value.user.organisations.list
                        const validateError = validateOrganisation(
                            action.payload.name,
                            orgs,
                            memberOfOrgs
                        )
                        const error = validateError
                            ? { developer: { developerOrg: validateError } }
                            : undefined
                        return [
                            {
                                type: actions.ORGANISATIONS_SEARCH_SUCCESS,
                                payload: {
                                    list: orgs,
                                },
                            },
                            stopAsyncValidation('uploadAppForm', error),
                        ]
                    }),
                    catchError(e => {
                        return [
                            actions.actionErrorCreator(
                                actions.ORGANISATIONS_SEARCH_ERROR,
                                e
                            ),
                            stopAsyncValidation('uploadAppForm'),
                        ]
                    })
                )
            )
        })
    )

const loadMe = action$ =>
    action$.pipe(
        ofType(actions.ME_LOAD),
        switchMap(() =>
            api
                .getMe()
                .then(response => ({
                    type: actions.ME_LOAD_SUCCESS,
                    payload: response,
                }))
                .catch(e => ({
                    type: actions.ME_LOAD_ERROR,
                    payload: e,
                }))
        )
    )

const loadOrganisations = (action$, state$) =>
    action$.pipe(
        ofType(actions.ORGANISATIONS_LOAD),
        switchMap(action => {
            const filters = action.payload.filters || {}
            if (action.payload.currentUser) {
                const currentUserId = userSelectors.getUserId(state$.value)
                filters.user = currentUserId
            }

            return api
                .getOrganisations(filters)
                .then(response => ({
                    type: actions.ORGANISATIONS_LOAD_SUCCESS,
                    payload: {
                        list: response,
                    },
                }))
                .catch(e => ({
                    type: actions.ORGANISATIONS_LOAD_ERROR,
                    payload: e,
                }))
        })
    )

export default combineEpics(
    loadAppsAll,
    loadAppsApproved,
    loadApp,
    setAppApproval,
    deleteApp,
    user,
    userApps,
    newVersion,
    newApp,
    deleteVersion,
    editApp,
    addImage,
    editImage,
    deleteImage,
    editVersion,
    addMultipleImages,
    loadChannels,
    searchOrganisation,
    loadMe,
    loadOrganisations
)
