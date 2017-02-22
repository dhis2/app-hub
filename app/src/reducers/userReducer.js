import * as actionTypes from '../constants/actionTypes';

function userReducer(state = {}, action) {
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
            return {
                ...state,
                appList: action.payload
            }
        }
        case actionTypes.USER_LOADED: {
            return {
                ...state,
                userInfo: action.payload,
            }
        }
        case actionTypes.APPROVE_APP_SUCCESS: {
            return {
                ...state,
                appList: [
                    ...state.appList,
                    action.payload
                ]
            }
        }
    }
    return state;
}

export default userReducer;