import { combineReducers } from 'redux'
import * as actionTypes from '../constants/actionTypes'
import { roles } from '../constants/apiConstants'

const localStorageProfile = localStorage.getItem('profile')
const initialProfile = localStorageProfile
    ? (() => {
          try {
              return JSON.parse(localStorageProfile)
          } catch (error) {
              return {}
          }
      })()
    : {}

const initialState = {
    loaded: false,
    loading: true,
    error: false,
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

function userInfoReducer(
    state = { ...initialState, profile: initialProfile },
    action
) {
    switch (action.type) {
        case actionTypes.USER_LOGOUT: {
            return {
                ...state,
                profile: null,
            }
        }

        case actionTypes.USER_LOAD_SUCCESS: {
            const manager = action.payload.profile.roles.includes(roles.manager)

            return {
                ...state,
                profile: {
                    ...action.payload.profile,
                    manager,
                },
            }
        }

        case actionTypes.ME_LOAD_SUCCESS: {
            return {
                ...state,
                ...loadedState,
                userId: action.payload.userId,
            }
        }

        default: {
            if (
                action.type === actionTypes.ME_LOAD_ERROR ||
                action.type.endsWith('USER_ERROR')
            ) {
                return {
                    ...state,
                    ...errorState,
                }
            } else {
                return state
            }
        }
    }
}

export default combineReducers({
    userInfo: userInfoReducer,
})
