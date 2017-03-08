import * as actions from '../constants/actionTypes';
import * as actionCreators from './actionCreators';
import {combineEpics} from 'redux-observable';
import {getAuth} from '../utils/AuthService';
import {history} from '../utils/history'

import * as api from '../api/api';
const loadAppsAll = (action$) => action$
    .ofType(actions.APPS_ALL_LOAD)
    // .startWith({type: 'INIT'})
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
        return api.getUser()
            .then(apps => actionCreators.userLoaded(apps))
            .catch(error => ({
                type: actions.APPS_APPROVED_ERROR,
                payload: error,
            }));
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
            .then(app => actionCreators.addAppSuccess(app))
            .catch(error => ({
                type: actions.APP_ADD_ERROR,
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

export default combineEpics(loadAppsAll, loadAppsApproved, loadApp, approveApp, deleteApp, user, userApps, newVersion, newApp, deleteVersion)