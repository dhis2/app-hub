import * as actions from '../constants/actionTypes'

export const loadUser = actionCreator(actions.USER_LOAD)

export const userLoaded = profile =>
    actionCreator(actions.USER_LOAD_SUCCESS)({
        profile,
    })

export const userLoadError = actionCreator(actions.USER_LOAD_ERROR)

/**
 * Generic action-creator
 * @param type of action
 * @returns {object} FSA-compliant action
 */
function actionCreator(type) {
    return (payload, meta, error) => {
        if (payload == null) {
            payload = {}
        }
        return {
            type,
            payload,
            meta,
            error,
        }
    }
}
