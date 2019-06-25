import * as actions from '../constants/actionTypes'

const emptyDialog = { dialogType: null, dialogProps: {} }
const initialState = {
    ...emptyDialog,
}

const dialog = (state = initialState, action) => {
    switch (action.type) {
        case actions.OPEN_DIALOG: {
            return {
                ...state,
                dialogType: action.payload.dialogType,
                dialogProps: action.payload.dialogprops,
            }
        }

        case actions.CLOSE_DIALOG: {
            return {
                ...state,
                ...emptyDialog,
            }
        }

        default: {
            return state
        }
    }
}

export default dialog
