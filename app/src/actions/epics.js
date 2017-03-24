import * as actions from '../constants/actionTypes';
import * as actionCreators from './actionCreators';
import {combineEpics} from 'redux-observable';
import {getAuth} from '../utils/AuthService';
import {history} from '../utils/history'
import * as api from '../api/api';

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
        return api.getApp(action.payload.appId)
            .then(app => actionCreators.appLoaded(app))
            .catch(error => ({
                type: actions.APP_ERROR,
                payload: error,
            }));
    })


const approveApp = (action$) => action$
    .ofType(actions.SET_APPROVAL_APP)
    .concatMap(action => {
        const {app: {id}, status} = action.payload;
        return api.setAppApproval(id, status)
            .then(resp => actionCreators.setAppApprovalSuccess(action.payload))
            .catch(error => ({
                type: actions.SET_APPROVAL_APP_ERROR,
                payload: error,
            }));
    })

const deleteApp = (action$) => action$
    .ofType(actions.APP_DELETE)
    .concatMap(action => {
        return api.deleteApp(action.payload.app.id)
            .then(resp => actionCreators.deleteAppSuccess(action.payload.app))
            .catch(error => ({
                type: actions.APP_DELETE_ERROR,
                payload: error,
            }));
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

const editApp = (action$) => action$
    .ofType(actions.APP_EDIT)
    .concatMap(action => {
        const {app, data} = action.payload;
        return api.updateApp(app.id, data)
            .then(resp => actionCreators.editAppSuccess(app, data))
            .catch(error => ({
                type: actions.APP_EDIT_ERROR,
                payload: error
            }))
    });

const deleteVersion = (action$) => action$
    .ofType(actions.APP_VERSION_DELETE)
    .concatMap(action => {
        const {appId, version} = action.payload;
        return api.deleteVersion(appId, version.id)
            .then(response => actionCreators.deleteAppVersionSuccess(version, action.payload.appId))
            .catch(error => ({
                type: actions.APP_DELETE_ERROR,
                payload: error,
            }));
    })

const addImage = (action$) => action$
    .ofType(actions.APP_IMAGE_ADD)
    .concatMap(action => {
        const {appId, image} = action.payload;
        return api.createNewImage(appId, image)
            .then(response => actionCreators.addImageToAppSuccess(appId, image))
            .catch(error => ({
                type: actions.APP_IMAGE_ADD_ERROR,
                payload: error,
            }));
    })
const deleteImage = (action$) => action$
    .ofType(actions.APP_IMAGE_DELETE)
    .concatMap(action => {
        const {appId, imageId} = action.payload;
        return api.deleteImage(appId, imageId)
            .then(response => actionCreators.deleteImageFromAppSuccess(appId, imageId))
            .catch(error => ({
                type: actions.APP_IMAGE_DELETE_ERROR,
                payload: error,
            }));
    })
const editImage = (action$) => action$
    .ofType(actions.APP_IMAGE_EDIT)
    .concatMap(action => {
        const {appId, imageId, data} = action.payload;
        return api.updateImage(appId, imageId, data)
            .then(response => actionCreators.editImageSuccess(appId, imageId, data))
            .catch(error => ({
                type: actions.APP_IMAGE_EDIT_ERROR,
                payload: error,
            }));
    })
const editImageLogo = (action$) => action$
    .ofType(actions.APP_IMAGE_SET_LOGO)
    .concatMap(action => {
        const {appId, imageId, data} = action.payload;
        return api.updateImageLogo(appId, imageId)
            .then(response => actionCreators.editImageLogoSuccess(appId, imageId))
            .catch(error => ({
                type: actions.APP_IMAGE_SET_LOGO_ERROR,
                payload: error,
            }));
    })
export default combineEpics(loadAppsAll, loadAppsApproved, loadApp, approveApp, deleteApp,
    user, userApps, newVersion,
    newApp, deleteVersion, editApp,
    addImage, editImage, editImageLogo, deleteImage)