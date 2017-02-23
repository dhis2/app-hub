import * as actionTypes from '../constants/actionTypes';

function appsListReducer(state = {appList: []}, action) {
    switch (action.type) {
        case actionTypes.APPS_ALL_ERROR: {
            return {
                ...state,
                error: action.payload
            }
        }
        case actionTypes.APPS_ALL_LOADED:
        case actionTypes.APPS_APPROVED_LOADED:
        {
            return {
                ...state,
                appList: action.payload
            }
        }

    }
    return state;
}

export default  appsListReducer