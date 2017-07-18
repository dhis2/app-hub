import * as actions from '../constants/actionTypes';
import * as actionCreators from './actionCreators';
import {combineEpics} from 'redux-observable';
import {getAuth} from '../utils/AuthService';
import {history} from '../utils/history'
import * as api from '../api/api';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/concatMap';
import {REVERT, COMMIT} from 'redux-optimistic-ui';

const loadAppsAll = (action$) => action$
    .ofType(actions.APPS_ALL_LOAD)
    .concatMap(action => {
        return api.getAllApps()
            .then(apps => actionCreators.appsAllLoaded(apps))
            .catch(error => ({
                type: actions.APPS_ALL_ERROR,
                payload: error,
            }));
    })


const loadAppsApproved = (action$) => action$
    .ofType(actions.APPS_APPROVED_LOAD)
    .concatMap(action => {
        return api.getApprovedApps()
            .then(apps => actionCreators.loadedApprovedApps(apps))
            .catch(error => ({
                type: actions.APPS_APPROVED_ERROR,
                payload: error,
            }));
    })

const loadApp = (action$) => action$
    .ofType(actions.APP_LOAD)
    .concatMap(action => {
        const {appId, useAuth} = action.payload;
        return api.getApp(appId, useAuth)
            .then(app => actionCreators.loadAppSuccess(app))
            .catch(error => ({
                type: actions.APP_ERROR,
                payload: error,
            }));
    })

/**
 * Optimistic action
 * @param action$
 */
const setAppApproval = (action$) => action$
    .ofType(actions.SET_APPROVAL_APP)
    .concatMap(action => {
        const {app: {id}, status} = action.payload;
        const {id: transactionID} = action.meta.optimistic;
        return api.setAppApproval(id, status)
            .then(resp => actionCreators.commitOrRevertOptimisticAction(actionCreators.setAppApprovalSuccess(action.payload), transactionID))
            .catch(error => (
                actionCreators.commitOrRevertOptimisticAction(actionCreators.actionErrorCreator(actions.SET_APPROVAL_APP_ERROR, error), transactionID)))
    })

const deleteApp = (action$) => action$
    .ofType(actions.APP_DELETE)
    .concatMap(action => {
        const {id} = action.meta.optimistic;
        return api.deleteApp(action.payload.app.id)
            .then(resp => actionCreators.commitOrRevertOptimisticAction(actionCreators.deleteAppSuccess(action.payload.app), id))
            .catch(error => (
                actionCreators.commitOrRevertOptimisticAction(actionCreators.actionErrorCreator(actions.APP_DELETE_ERROR, error), id)))
    })

const user = (action$) => action$
    .ofType(actions.USER_LOAD)
    .concatMap(action => {
        const auth = getAuth();
        return new Promise((resolve, reject) => {
            auth.lock.getProfile(auth.getToken(), (error, profile) => {
                if (error) {
                    reject(actionCreators.userError());
                } else {
                    auth.setProfile(profile)
                    resolve(actionCreators.userLoaded(profile));
                }
            });
        })
    })

const userApps = (action$) => action$
    .ofType(actions.USER_APPS_LOAD)
    .concatMap(action => {
        return api.getUserApps()
            .then(apps => actionCreators.userAppsLoaded(apps))
            .catch(error => ({
                type: actions.USER_APPS_ERROR,
                payload: error,
            }));
    })

const newVersion = (action$) => action$
    .ofType(actions.APP_VERSION_ADD)
    .concatMap(action => {
        return api.createNewVersion(action.payload.appId, action.payload)
            .then(version => actionCreators.addAppVersionSuccess(version, action.payload.appId))
            .catch(error => ({
                type: actions.APP_VERSION_ADD_ERROR,
                payload: error,
            }));
    });

const newApp = (action$) => action$
    .ofType(actions.APP_ADD)
    .concatMap(action => {
        return api.createApp(action.payload)
            .then(app => {
                history.push("/user");
                return actionCreators.addAppSuccess(app)
            })
            .catch(error => ({
                type: actions.APP_ADD_ERROR,
                payload: error
            }))
    });

/**
 * Optimistic action
 * @param action$
 */

const editApp = (action$) => action$
    .ofType(actions.APP_EDIT)
    .concatMap(action => {
        const {app, data} = action.payload;
        const {id} = action.meta.optimistic;
        return api.updateApp(app.id, data)
            .then(resp => actionCreators.commitOrRevertOptimisticAction(actionCreators.editAppSuccess(app, data)))
            .catch(error => (
                actionCreators.commitOrRevertOptimisticAction(actionCreators.actionErrorCreator(
                    actions.APP_EDIT_ERROR, error), id)))
    });

/**
 * Optimistic action
 * @param action$
 */
const deleteVersion = (action$) => action$
    .ofType(actions.APP_VERSION_DELETE)
    .concatMap(action => {
        const {appId, version} = action.payload;
        const {id} = action.meta.optimistic;
        return api.deleteVersion(appId, version.id)
            .then(response => actionCreators.commitOrRevertOptimisticAction(actionCreators.deleteAppVersionSuccess(version, action.payload.appId), id))
            .catch(error => (
                actionCreators.commitOrRevertOptimisticAction(actionCreators.actionErrorCreator(
                    actions.APP_VERSION_DELETE_ERROR, error), id)))
    })

const addImage = (action$) => action$
    .ofType(actions.APP_IMAGE_ADD)
    .concatMap(action => {
        const {appId, image} = action.payload;
        return api.createNewImage(appId, image)
            .then(response => actionCreators.addImageToAppSuccess(appId, response))
            .catch(error => ({
                type: actions.APP_IMAGE_ADD_ERROR,
                payload: error,
            }))
    })

/**
 * Optimistic action
 * @param action$
 */
const deleteImage = (action$) => action$
    .ofType(actions.APP_IMAGE_DELETE)
    .concatMap(action => {
        const {appId, imageId} = action.payload;
        const {id} = action.meta.optimistic;
        return api.deleteImage(appId, imageId)
            .then(response =>
                actionCreators.commitOrRevertOptimisticAction(actionCreators.deleteImageFromAppSuccess(appId, imageId), id))
            .catch(error => (
                actionCreators.commitOrRevertOptimisticAction(actionCreators.actionErrorCreator(
                    actions.APP_IMAGE_DELETE_ERROR, error), id)))
    })

/**
 * Optimistic action
 * @param action$
 */
const editImage = (action$) => action$
    .ofType(actions.APP_IMAGE_EDIT)
    .concatMap(action => {
        const {appId, imageId, data} = action.payload;
        const {id} = action.meta.optimistic;
        return api.updateImage(appId, imageId, data)
            .then(response => actionCreators.commitOrRevertOptimisticAction(actionCreators.editImageSuccess(appId, imageId, data), id))
            .catch(error => (
                actionCreators.commitOrRevertOptimisticAction(actionCreators.actionErrorCreator(
                    actions.APP_IMAGE_EDIT_ERROR, error), id)))
    });

/**
 * Optimistic action
 * @param action$
 */
const editVersion = (action$) => action$
    .ofType(actions.APP_VERSION_EDIT)
    .concatMap(action => {
        const {appId, version} = action.payload;
        const {id} = action.meta.optimistic;
        const versionId = version.id;
        return api.updateVersion(appId, versionId, version)
            .then(response => (
                actionCreators.commitOrRevertOptimisticAction(actionCreators.editAppVersionSuccess(appId, version), id)
            ))
            .catch(error => (
                actionCreators.commitOrRevertOptimisticAction(actionCreators.actionErrorCreator(
                    actions.APP_VERSION_EDIT_ERROR, error, {retryAction: action})
                    , id)))
    });


export default combineEpics(loadAppsAll, loadAppsApproved, loadApp, setAppApproval, deleteApp,
    user, userApps, newVersion,
    newApp, deleteVersion, editApp,
    addImage, editImage, deleteImage, editVersion)