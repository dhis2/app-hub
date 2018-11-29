import * as actions from "../constants/actionTypes";
import * as actionCreators from "./actionCreators";
import { combineEpics } from "redux-observable";
import { getAuth } from "../utils/AuthService";
import { history } from "../utils/history";
import * as api from "../api/api";
import { REVERT, COMMIT } from "redux-optimistic-ui";
import { of, map, concatMap, mergeAll, from} from 'rxjs/operators';
import { ofType } from "redux-observable";

const loadAppsAll = action$ =>
    action$.pipe(
        ofType(actions.APPS_ALL_LOAD),
        concatMap(action => {
            return api
                .getAllApps()
                .then(apps => actionCreators.appsAllLoaded(apps))
                .catch(error =>
                    actionCreators.actionErrorCreator(actions.APPS_ALL_ERROR, error)
                );
        }));

const loadAppsApproved = action$ =>
    action$.pipe(
        ofType(actions.APPS_APPROVED_LOAD),
        concatMap(action => {
            return api
                .getApprovedApps()
                .then(apps => actionCreators.loadedApprovedApps(apps))
                .catch(error =>
                    actionCreators.actionErrorCreator(
                        actions.APPS_APPROVED_ERROR,
                        error
                    )
                );
        }));

const loadApp = action$ =>
    action$.pipe(
        ofType(actions.APP_LOAD),
        concatMap(action => {
        const { appId, useAuth } = action.payload;
        return api
            .getApp(appId, useAuth)
            .then(app => actionCreators.loadAppSuccess(app))
            .catch(error => ({
                type: actions.APP_ERROR,
                payload: error
            }));
    }));

/**
 * Optimistic action
 * @param action$
 */
const setAppApproval = action$ =>
    action$.pipe(
        ofType(actions.SET_APPROVAL_APP),
        concatMap(action => {
        const { app: { id }, status } = action.payload;
        const { id: transactionID } = action.meta.optimistic;
        return api
            .setAppApproval(id, status)
            .then(resp =>
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
            );
    }));

const deleteApp = action$ =>
    action$.pipe(
        ofType(actions.APP_DELETE),
        concatMap(action => {
        const { id } = action.meta.optimistic;
        return api
            .deleteApp(action.payload.app.id)
            .then(resp =>
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
            );
    }));

const user = action$ =>
    action$.pipe(
        ofType(actions.USER_LOAD),
        concatMap(action => {
        const auth = getAuth();
        return new Promise((resolve, reject) => {
            auth.lock.getProfile(auth.getToken(), (error, profile) => {
                if (error) {
                    reject(actionCreators.userError());
                } else {
                    auth.setProfile(profile);
                    resolve(actionCreators.userLoaded(profile));
                }
            });
        });
    }));

const userApps = action$ =>
    action$.pipe(
        ofType(actions.USER_APPS_LOAD),
        concatMap(action => {
        return api
            .getUserApps()
            .then(apps => actionCreators.userAppsLoaded(apps))
            .catch(error => ({
                type: actions.USER_APPS_ERROR,
                payload: error
            }));
    }));

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
                payload: error
            }));
    }));

const newApp = action$ =>
    action$.pipe(
        ofType(actions.APP_ADD),
        concatMap(action => {
        return api
            .createApp(action.payload)
            .then(app => {
                history.push("/user");
                return actionCreators.addAppSuccess(app);
            })
            .catch(error => ({
                type: actions.APP_ADD_ERROR,
                payload: error
            }));
    }));

/**
 * Optimistic action
 * @param action$
 */

const editApp = action$ =>
    action$.pipe(
        ofType(actions.APP_EDIT),
        concatMap(action => {
        const { app, data } = action.payload;
        const { id } = action.meta.optimistic;
        return api
            .updateApp(app.id, data)
            .then(resp =>
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
            );
    }));

/**
 * Optimistic action
 * @param action$
 */
const deleteVersion = action$ =>
    action$.pipe(
        ofType(actions.APP_VERSION_DELETE),
    concatMap(action => {
        const { appId, version } = action.payload;
        const { id } = action.meta.optimistic;
        return api
            .deleteVersion(appId, version.id)
            .then(response =>
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
            );
    }));

const addImage = action$ =>
    action$.pipe(
        ofType(actions.APP_IMAGE_ADD),
        concatMap(action => {
        const { appId, image } = action.payload;
        return api
            .createNewImage(appId, image)
            .then(response =>
                actionCreators.addImageToAppSuccess(appId, response)
            )
            .catch(error => ({
                type: actions.APP_IMAGE_ADD_ERROR,
                payload: error
            }));
    }));

const addMultipleImages = action$ =>
    action$.pipe(
        ofType(actions.APP_IMAGES_ADD),
        concatMap(action => {
        const { appId, images } = action.payload;
        let successCount = 0;
        const promises = images.map((image, i) => {
            return api
                .createNewImage(appId, image)
                .then(response => {
                    successCount++;
                    return actionCreators.addImageToAppSuccess(appId, response);
                })
                .catch(error =>
                    actionCreators.actionErrorCreator(
                        actions.APP_IMAGE_ADD_ERROR,
                        {
                            ...image,
                            fieldIndex: i,
                            message: error
                        }
                    )
                );
        });
        const allCompleted = Promise.all(promises).then(imageActions => {
            if (successCount != images.length) {
                return actionCreators.actionErrorCreator(
                    actions.APP_IMAGES_ADD_ERROR
                );
            }
            return actionCreators.addMultipleImagesToAppSuccess(
                appId,
                imageActions
            );
        });
        return [...promises, allCompleted];
        //return from([...promises, allCompleted]).pipe(mergeAll())
    }),
        mergeAll()
    );

/**
 * Optimistic action
 * @param action$
 */
const deleteImage = action$ =>
    action$.pipe(
        ofType(actions.APP_IMAGE_DELETE),
        concatMap(action => {
        const { appId, imageId } = action.payload;
        const { id } = action.meta.optimistic;
        return api
            .deleteImage(appId, imageId)
            .then(response =>
                actionCreators.commitOrRevertOptimisticAction(
                    actionCreators.deleteImageFromAppSuccess(appId, imageId),
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
            );
    }));

/**
 * Optimistic action
 * @param action$
 */
 const editImage = action$ =>
    action$.pipe(
        ofType(actions.APP_IMAGE_EDIT),
        concatMap(action => {
        const { appId, imageId, data } = action.payload;
        const { id } = action.meta.optimistic;
        return api
            .updateImage(appId, imageId, data)
            .then(response =>
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
            );
    }));

/**
 * Optimistic action
 * @param action$
 */
const editVersion = action$ =>
    action$.pipe(
        ofType(actions.APP_VERSION_EDIT),
        concatMap(action => {
        const { appId, version } = action.payload;
        const { id } = action.meta.optimistic;
        const versionId = version.id;
        return api
            .updateVersion(appId, versionId, version)
            .then(response =>
                actionCreators.commitOrRevertOptimisticAction(
                    actionCreators.editAppVersionSuccess(appId, version),
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
            );
        }));

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
    addMultipleImages
);
