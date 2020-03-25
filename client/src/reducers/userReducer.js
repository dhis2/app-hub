import * as actionTypes from '../constants/actionTypes'
import { combineReducers } from 'redux'
import { optimistic, ensureState } from 'redux-optimistic-ui'

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
function appListReducer(state = { ...initialState, byId: {} }, action) {
    switch (action.type) {
        case actionTypes.APPS_APPROVED_ERROR: {
            return {
                ...state,
                error: action.payload,
            }
        }
        case actionTypes.APPS_ALL_LOADED:
        case actionTypes.USER_APPS_LOADED: {
            const byId = {}
            action.payload.map((app, i) => {
                byId[app.id] = app
            })
            return {
                ...state,
                ...loadedState,
                byId,
            }
        }
        case actionTypes.APP_LOADED: {
            const appId = action.payload.id
            return {
                ...state,
                ...loadedState,
                byId: {
                    ...state.byId,
                    [appId]: action.payload,
                },
            }
        }
        case actionTypes.SET_APPROVAL_APP: {
            const appId = action.payload.app.id
            const app = state.byId[appId]
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [appId]: {
                        ...app,
                        status: action.payload.status,
                    },
                },
            }
        }
        case actionTypes.APP_VERSION_ADD_SUCCESS: {
            const version = action.payload.version
            const appId = action.payload.appId
            const app = state.byId[appId]
            if (!app) {
                return state
            }
            const newVer = [...app.versions, version]
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [appId]: {
                        ...app,
                        versions: newVer,
                    },
                },
            }
        }

        case actionTypes.APP_VERSION_DELETE: {
            const version = action.payload.version
            const appId = action.payload.appId
            const app = state.byId[appId]
            if (!app) {
                return state
            }
            const newVer = app.versions.filter(v => v.id !== version.id)
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [appId]: {
                        ...app,
                        versions: newVer,
                    },
                },
            }
        }

        case actionTypes.APP_DELETE: {
            const app = action.payload.app
            const list = { ...state.byId }
            delete list[action.payload.app.id]
            return {
                ...state,
                byId: list,
            }
        }

        case actionTypes.APP_EDIT: {
            const { app, data } = action.payload
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [app.id]: {
                        ...app,
                        ...data,
                    },
                },
            }
        }

        case actionTypes.APP_IMAGE_ADD_SUCCESS: {
            const { appId, imageId, image } = action.payload
            const app = state.byId[appId]
            const list = app.images.concat(image)
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [appId]: {
                        ...app,
                        images: list,
                    },
                },
            }
        }

        case actionTypes.APP_IMAGE_EDIT: {
            const { appId, imageId, data } = action.payload
            const app = state.byId[appId]
            const list = app.images.map((elem, ind) => {
                if (elem.id == imageId) {
                    return {
                        ...elem,
                        ...data,
                    }
                } else if (elem.logo && data.logo) {
                    //clear prev logo
                    return {
                        ...elem,
                        logo: false,
                    }
                } else return elem
            })
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [appId]: {
                        ...app,
                        images: list,
                    },
                },
            }
        }

        case actionTypes.APP_IMAGE_DELETE: {
            const { appId, imageId } = action.payload
            const app = state.byId[appId]
            const list = app.images.filter((elem, ind) => elem.id !== imageId)
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [appId]: {
                        ...app,
                        images: list,
                    },
                },
            }
        }

        case actionTypes.APP_VERSION_EDIT: {
            const { appId, version } = action.payload
            const app = state.byId[appId]
            const list = app.versions.map((elem, ind) => {
                if (elem.id == version.id) {
                    return {
                        ...elem,
                        ...version,
                    }
                } else {
                    return elem
                }
            })
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [appId]: {
                        ...app,
                        versions: list,
                    },
                },
            }
        }

        default: {
            if (action.type && action.type.endsWith('_ERROR')) {
                return {
                    ...state,
                    ...errorState,
                }
            } else {
                return state
            }
        }
    }
    return state
}

function userInfoReducer(
    state = { authenticated: false, ...initialState, profile: initialProfile },
    action
) {
    switch (action.type) {
        case actionTypes.USER_AUTHENTICATED: {
            return {
                ...state,
                authenticated: true,
            }
        }

        case actionTypes.USER_LOGOUT: {
            return {
                ...state,
                authenticated: false,
            }
        }

        case actionTypes.USER_LOADED: {
            const manager = action.payload.profile.roles.includes(
                'ROLE_MANAGER'
            )
            return {
                ...state,
                ...loadedState,
                profile: {
                    ...action.payload.profile,
                    manager,
                },
            }
        }

        case actionTypes.ME_LOAD_SUCCESS: {
            return {
                ...state,
                userId: action.payload.userId,
            }
        }

        default: {
            if (action.type.endsWith('USER_ERROR')) {
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

function organisationReducer(state = { ...initialState, list: {} }, action) {
    switch (action.type) {
        case actionTypes.ME_LOAD_SUCCESS: {
            return {
                ...state,
                ...loadedState,
                list: action.payload.organisations,
            }
        }
        default: {
            return state
        }
    }
}

export default combineReducers({
    appList: optimistic(appListReducer),
    userInfo: userInfoReducer,
    organisations: organisationReducer,
})
