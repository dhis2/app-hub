import * as actionTypes from '../constants/actionTypes'

const initialState = {
    byId: {},
}

function appsListReducer(state = { ...initialState }, action) {
    switch (action.type) {
        case actionTypes.APP_LOADED: {
            //do not load userApps in this reducer
            if (action.payload.status !== 'APPROVED') {
                return state
            }
            const appId = action.payload.id
            return {
                byId: {
                    ...state.byId,
                    [appId]: action.payload,
                },
            }
        }
    }
    return state
}

export default appsListReducer
