import * as actionTypes from '../constants/actionTypes'

const initialState = {
    loading: false,
    loaded: false,
    channels: [],
}

const channelReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CHANNEL_ERROR: {
            return {
                ...state,
                error: {
                    loaded: false,
                    loading: false,
                    error: action.payload,
                },
            }
        }

        case actionTypes.CHANNELS_LOAD: {
            return {
                ...state,
                loading: true,
            }
        }
        case actionTypes.CHANNELS_LOADED: {
            return {
                ...state,
                loading: false,
                loaded: true,
                channels: action.payload,
            }
        }

        default: {
            return state
        }
    }
}

export default channelReducer
