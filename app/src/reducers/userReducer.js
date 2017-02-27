import * as actionTypes from '../constants/actionTypes';

function userReducer(state = {appList: []}, action) {
    switch (action.type) {
        case actionTypes.APPS_APPROVED_ERROR: {
            return {
                ...state,
                error: action.payload
            }
        }
        case actionTypes.APPS_ALL_LOADED:
        case actionTypes.USER_APPS_LOADED:
        {
            const appList = {}
            action.payload.map((app, i) => {
                appList[app.id] = app
            })
            return {
                ...state,
                appList
            }
        }
        case actionTypes.APP_LOADED: {
            const appId = action.payload.id;
            return {
                ...state,
                appList: {
                    ...state.appList,
                    [appId]: action.payload,
                }
            }
        }
        case actionTypes.USER_LOADED: {
            return {
                ...state,
                userInfo: action.payload,
            }
        }
        case actionTypes.SET_APPROVAL_APP_SUCCESS: {
            const appId = action.payload.app.id;
            const app = state.appList[appId];
            return {
                ...state,
                appList: {
                    ...state.appList,
                    [appId]: {
                        ...app,
                        status: action.payload.status
                    }
                }
            }

        }
        case actionTypes.APP_VERSION_ADD_SUCCESS: {
            const appId = action.payload.appId;
            const version = action.payload.version.id;
            const app = state.appList[appId];
            const newVer = app.version.map((v,i) => {
                if(v.id == version) {
                    return action.payload.version
                }
            })

            return {
                ...state,
                appList: {
                    ...state.appList,
                    [appId]: {
                        ...app,
                        version: newVer,
                    }
                }
            }
        }
    }
    return state;
}

export default userReducer;