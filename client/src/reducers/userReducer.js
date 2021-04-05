import { combineReducers } from 'redux'
import { optimistic } from 'redux-optimistic-ui'
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
function appListReducer(state = { ...initialState, byId: {} }, action) {
    switch (action.type) {
        case actionTypes.APPS_ALL_LOADED:
        case actionTypes.USER_APPS_LOADED: {
            const byId = {}
            action.payload.forEach(app => {
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
            const appId = action.payload.appID
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
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [appId]: {
                        ...app,
                        versions: [...app.versions, version],
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
            const versions = app.versions.filter(v => v.id !== version.id)
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [appId]: {
                        ...app,
                        versions,
                    },
                },
            }
        }

        case actionTypes.APP_DELETE: {
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
            const { appId, image } = action.payload
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
            const images = app.images.map(elem => {
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
                        images,
                    },
                },
            }
        }

        case actionTypes.APP_IMAGE_DELETE: {
            const { appId, imageId } = action.payload
            const app = state.byId[appId]
            const images = app.images.filter(elem => elem.id !== imageId)
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [appId]: {
                        ...app,
                        images,
                    },
                },
            }
        }

        case actionTypes.APP_VERSION_EDIT: {
            const { appId, version } = action.payload
            const app = state.byId[appId]
            const versions = app.versions.map(elem => {
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
                        versions,
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

function organisationReducer(state = { ...initialState, list: {} }, action) {
    switch (action.type) {
        case actionTypes.ORGANISATION_ADD_SUCCESS: {
            return {
                ...state,
                list: [...state.list, action.payload.id],
            }
        }
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
