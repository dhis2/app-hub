import * as actionTypes from '../constants/actionTypes';

const initialState = {
    loaded: false,
    loading: true,
    error: false,
    byId: {},
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

function appsListReducer(state = {...initialState}, action) {
    switch (action.type) {
        case actionTypes.APPS_APPROVED_ERROR:
        case actionTypes.APPS_ALL_ERROR: {
            return {
                ...state,
                ...errorState,
            }
        }

        case actionTypes.APPS_APPROVED_LOADED:
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
            if(action.payload.status !== 'APPROVED') {
                return state;
            }
            const appId = action.payload.id;
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [appId]: action.payload,
                }
            }
        }

    }
    return state;
}

export default  appsListReducer