import * as actions from '../constants/actionTypes'

const initialState = {
    loaded: false,
    loading: true,
    error: false,
    byId: {},
}

const loadedState = {
    loaded: true,
    error: false,
    loading: false,
}

const organisations = (state = initialState, action) => {
    switch (action.type) {
        case actions.ORGANISATIONS_LOAD_SUCCESS:
        case actions.ORGANISATIONS_SEARCH_SUCCESS: {
            const byIdList = action.payload.list.reduce((acc, org) => {
                const id = org.id
                acc[id] = org
                return acc
            }, {})
            return {
                ...state,
                ...loadedState,
                byId: {
                    ...state.byId,
                    ...byIdList,
                },
            }
        }

        default: {
            return state
        }
    }
}

export default organisations
