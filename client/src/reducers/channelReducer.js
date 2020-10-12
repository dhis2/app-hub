import * as actionTypes from '../constants/actionTypes'

const initialState = {
    loading: false,
    loaded: false,
    list: [],
}

const channelReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CHANNEL_LOAD_ERROR: {
            return {
                ...state,
                loaded: false,
                loading: false,
                error: action.payload,
            }
        }

        case actionTypes.CHANNELS_LOAD_BEGIN: {
            return {
                ...state,
                loaded: false,
                loading: true,
            }
        }
        case actionTypes.CHANNELS_LOAD_SUCCESS: {
            return {
                ...state,
                loaded: true,
                loading: false,
                list: action.payload,
            }
        }

        default: {
            return state
        }
    }
}

export default channelReducer
