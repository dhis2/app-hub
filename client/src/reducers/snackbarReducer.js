import React from 'react'
import * as actionTypes from '../constants/actionTypes'
const emptySnackbar = { message: '', duration: 4000 }
const initialState = {
    ...emptySnackbar,
}

const snackbarReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.APP_VERSION_ADD_SUCCESS: {
            return {
                ...state,
                message: 'New app version has been uploaded',
            }
        }

        case actionTypes.APP_ADD_SUCCESS: {
            return {
                ...state,
                message: 'App has been uploaded',
            }
        }

        case actionTypes.APP_EDIT_SUCCESS: {
            return {
                ...state,
                message: (
                    <span>
                        App <i>{action.payload.app.name}</i> has been updated
                    </span>
                ),
            }
        }

        case actionTypes.APP_VERSION_DELETE_SUCCESS: {
            return {
                ...state,
                message: `Version ${action.payload.version.version} has been deleted`,
            }
        }

        case actionTypes.APP_VERSION_EDIT_SUCCESS: {
            return {
                ...state,
                message: 'Version updated',
            }
        }

        case actionTypes.ORGANISATION_MEMBER_ADD_SUCCESS: {
            return {
                ...state,
                message: 'Member added',
            }
        }

        case actionTypes.ORGANISATION_ADD_SUCCESS: {
            return {
                ...state,
                message: 'Organisation created',
            }
        }

        case actionTypes.ORGANISATION_EDIT_SUCCESS: {
            return {
                ...state,
                message: 'Organisation updated',
            }
        }

        case actionTypes.SNACKBAR_EMPTY: {
            return {
                ...emptySnackbar,
            }
        }

        default: {
            const { payload, meta } = action
            if (action.type.endsWith('_ERROR')) {
                let message = 'An error occured'
                if (payload.message && typeof payload.message === 'string') {
                    message += `: ${payload.message}`
                }
                let retryAction = undefined
                if (meta && meta.retryAction) {
                    retryAction = meta.retryAction
                }
                return {
                    ...state,
                    message,
                    retryAction,
                }
            } else {
                return {
                    ...state,
                }
            }
        }
    }
}

export default snackbarReducer
