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
const errorState = {
    loaded: false,
    loading: false,
    error: true,
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

        case actions.ORGANISATION_LOAD_SUCCESS: {
            const response = action.payload;
            
            if(response.owner && response.users) {
                const ownerUser = response.users.find(u => u.id === response.owner)
                if(ownerUser) {
                    response.owner = ownerUser
                }
            }
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.payload.id]: action.payload,
                },
            }
        }

        // dont set error-state
        case actions.ORGANISATION_ADD_ERROR: {
            return state
        }

        default: {
            if (
                action.type.startsWith('ORGANISATION') &&
                action.type.endsWith('_ERROR')
            ) {
                return {
                    ...state,
                    ...errorState,
                    error: action.payload
                }
            } else {
                return state
            }
        }
    }
}

export default organisations
