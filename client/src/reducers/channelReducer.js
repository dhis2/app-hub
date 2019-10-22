import * as actions from '../constants/actionTypes'

const initialState = {
    loading: false,
    channels: [],
}

const channelReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.CHANNELS_LOAD: {
            return {
                ...state,
                loading: true,
            }
        }
        case actions.CHANNELS_LOADED: {
            return {
                ...state,
                loading: false,
                channels: action.payload,
            }
        }

        default: {
            return state
        }
    }

    return state
}

export default channelReducer
