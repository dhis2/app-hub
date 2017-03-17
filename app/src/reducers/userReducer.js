import * as actionTypes from '../constants/actionTypes';
import { combineReducers } from 'redux';
const initialState = {
        loaded: false,
        loading: true,
        error: false,
}

const loadedState = {
    loaded: true,
    loading: false,
    error: false,
}
const errorState = {
    loaded: false,
    loading: false,
    error: true,
}
function appListReducer(state = {...initialState, byId: {}}, action) {
    switch(action.type) {
        case actionTypes.APPS_APPROVED_ERROR: {
            return {
                ...state,
                error: action.payload
            }
        }
        case actionTypes.APPS_ALL_LOADED:
        case actionTypes.USER_APPS_LOADED:
        {
            const byId = {}
            action.payload.map((app, i) => {
                byId[app.id] = app
            })
            return {
                ...state,
                ...loadedState,
                byId
            }
        }
        case actionTypes.APP_LOADED: {
            const appId = action.payload.id;
            return {
                ...state,
                ...loadedState,
                byId: {
                    ...state.byId,
                    [appId]: action.payload,
                }
            }
        }
        case actionTypes.SET_APPROVAL_APP_SUCCESS: {
            const appId = action.payload.app.id;
            const app = state.byId[appId];
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [appId]: {
                        ...app,
                        status: action.payload.status
                    }
                }
            }

        }
        case actionTypes.APP_VERSION_ADD_SUCCESS: {
            const version = action.payload.version;
            const appId = action.payload.appId;
            const app = state.byId[appId];
            if(!app) {
                return state;
            }
            const newVer = [...app.versions, version];
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [appId]: {
                        ...app,
                        versions: newVer,
                    }
                }
            }
        }

        case actionTypes.APP_VERSION_DELETE_SUCCESS: {
            const version = action.payload.version;
            const appId = action.payload.appId;
            const app = state.byId[appId];
            if(!app) {
                return state;
            }
            const newVer = app.versions.filter( v => v.id !== version.id);
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [appId]: {
                        ...app,
                        versions: newVer,
                    }
                }
            }
        }

        case actionTypes.APP_DELETE_SUCCESS: {
            const app = action.payload.app;
            const list = {...state.byId};
            delete list[action.payload.app.id];
            return {
                ...state,
                byId: list,
            }
        }
        case actionTypes.APP_EDIT_SUCCESS: {
            const { app, data } = action.payload;
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [app.id]: {
                        ...app,
                        ...data
                    }
                }
            }
        }
        default: {
            if (action.type.endsWith('_ERROR')) {
                console.log(action.payload)
                return {
                    ...state,
                    ...errorState,
                }
            } else {
                return state;
            }
        }
    }
    return state;
}

function userInfoReducer(state = {...initialState}, action) {
    switch(action.type) {
        case actionTypes.USER_LOADED: {
            return {
                ...state,
                ...loadedState,
                info: action.payload,
            }
        }
        default: {
            if (action.type.endsWith('_ERROR')) {
                console.log(action.payload)
                return {
                    ...state,
                    ...errorState,
                }
            } else {
                return state;
            }
        }
    }
    return state;
}

export default combineReducers({
    appList: appListReducer,
    userInfo: userInfoReducer,
});