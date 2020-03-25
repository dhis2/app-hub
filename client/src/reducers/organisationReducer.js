import * as actions from '../constants/actionTypes'

const initialState = {
    loaded: false,
    loading: true,
    error: false,
    byId: {},
}

const organisations = (state = initialState, action) => {
    switch (action.type) {
        case actions.ORGANISATIONS_SEARCH_SUCCESS: {
            const byIdList = action.payload.list.reduce((acc, org) => {
                const id = org.id
                acc[id] = org
                return acc
            }, {})
            return {
                ...state,
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
