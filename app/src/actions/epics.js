import * as actions from '../constants/actionTypes';
import * as actionCreators from './actionCreators';
import { combineEpics } from 'redux-observable';

const loadAppsAll = (action$) => action$
    .ofType(actions.APPS_ALL_LOAD)
    // .startWith({type: 'INIT'})
    .concatMap(action => {
        const fetchOptions = {
            // Includes the credentials for the requested origin (So an app store cookie if it exists)
            credentials: 'include',
        };

        return window.fetch('http://localhost:3099/api/apps/all', fetchOptions)
            .then(response => response.ok ? response : Promise.reject(response))
            .then(response => response.json())
            .then(apps => actionCreators.appsAllLoaded(apps))
            .catch(error => ({
                type: actions.APPS_ALL_ERROR,
                payload: error,
            }));
    })


const loadAppsApproved = (action$) => action$
    .ofType(actions.APPS_APPROVED_LOAD)
    .concatMap(action => {
        const fetchOptions = {
            // Includes the credentials for the requested origin (So an app store cookie if it exists)
            credentials: 'include',
        };

        return window.fetch('http://localhost:3099/api/apps', fetchOptions)
            .then(response => response.ok ? response : Promise.reject(response))
            .then(response => response.json())
            .then(apps => actionCreators.appsApprovedLoaded(apps))
            .catch(error => ({
                type: actions.APPS_APPROVED_ERROR,
                payload: error,
            }));
    })

const loadApp = (action$) => action$
    .ofType(actions.APP_LOAD)
    .concatMap(action => {
        const fetchOptions = {
            // Includes the credentials for the requested origin (So an app store cookie if it exists)
            credentials: 'include',
        };

        return window.fetch('http://localhost:3099/api/apps/'+action.payload.appId, fetchOptions)
            .then(response => response.ok ? response : Promise.reject(response))
            .then(response => response.json())
            .then(app => actionCreators.appLoaded(app))
            .catch(error => ({
                type: actions.APP_ERROR,
                payload: error,
            }));
    })


const approveApp = (action$) => action$
    .ofType(actions.SET_APPROVAL_APP)
    .concatMap(action => {
        const fetchOptions = {
            // Includes the credentials for the requested origin (So an app store cookie if it exists)
            credentials: 'include',
            method: 'POST'
        };

        return window.fetch('http://localhost:3099/api/apps/'+action.payload.app.id+'/approval?status='+action.payload.status, fetchOptions)
            .then(response => response.ok ? response : Promise.reject(response))
            .then(response => response.json())
            .then(resp => actionCreators.setAppApprovalSuccess(action.payload))
            .catch(error => ({
                type: actions.SET_APPROVAL_APP_ERROR,
                payload: error,
            }));
    })

const user = (action$) => action$
    .ofType(actions.USER_LOAD)
    .concatMap(action => {
        const fetchOptions = {
            // Includes the credentials for the requested origin (So an app store cookie if it exists)
            credentials: 'include',
        };

        return window.fetch('http://localhost:3099/api/users/me', fetchOptions)
            .then(response => response.ok ? response : Promise.reject(response))
            .then(response => response.json())
            .then(apps => actionCreators.userLoaded(apps))
            .catch(error => ({
                type: actions.APPS_APPROVED_ERROR,
                payload: error,
            }));
    })

const userApps = (action$) => action$
    .ofType(actions.USER_APPS_LOAD)
    .concatMap(action => {
        const fetchOptions = {
            // Includes the credentials for the requested origin (So an app store cookie if it exists)
            credentials: 'include',
        };

        return window.fetch('http://localhost:3099/api/apps/myapps', fetchOptions)
            .then(response => response.ok ? response : Promise.reject(response))
            .then(response => response.json())
            .then(apps => actionCreators.userAppsLoaded(apps))
            .catch(error => ({
                type: actions.USER_APPS_ERROR,
                payload: error,
            }));
    })

export default combineEpics(loadAppsAll, loadAppsApproved, loadApp, approveApp, user, userApps)