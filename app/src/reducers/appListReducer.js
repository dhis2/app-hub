import * as actionTypes from '../constants/actionTypes';

function appsListReducer(state = {appList: []}, action) {
    switch (action.type) {
        case actionTypes.APPS_ALL_ERROR: {
            return {
                ...state,
                error: action.payload
            }
        }

        case actionTypes.APPS_APPROVED_LOADED:
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

    }
    return state;
}

export default  appsListReducer