import { combineEpics, ofType } from 'redux-observable'
import { concatMap } from 'rxjs/operators'
import * as api from '../api'
import * as actions from '../constants/actionTypes'

const user = (action$) =>
    action$.pipe(
        ofType(actions.USER_LOAD),
        concatMap(() =>
            api
                .getMe()
                .then((response) => ({
                    type: actions.ME_LOAD_SUCCESS,
                    payload: response,
                }))
                .catch((e) => ({
                    type: actions.ME_LOAD_ERROR,
                    payload: e,
                }))
        )
    )

export default combineEpics(user)
