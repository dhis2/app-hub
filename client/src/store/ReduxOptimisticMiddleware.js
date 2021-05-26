import { BEGIN, COMMIT, REVERT } from 'redux-optimistic-ui'

//All redux action types that are optimistic have the following suffixes
const _SUCCESS = '_SUCCESS'
const _ERROR = '_ERROR'

//Each optimistic item will need a transaction Id to internally match the BEGIN to the COMMIT/REVERT
let nextTransactionID = 0

export default store => next => action => {
    // FSA compliant
    const { type, meta, error, payload } = action

    // Ignore actions without isOptimistic flag
    if (!meta || !meta.isOptimistic) return next(action)

    const isSuccessAction = type.endsWith(_SUCCESS)
    const isErrorAction = type.endsWith(_ERROR)
    //Response from server, handled in epic-middleware
    if (isSuccessAction || isErrorAction) {
        return next(action)
    }

    // Now that we know we're optimistically updating the item, give it an ID
    const transactionID = nextTransactionID++
    // Sending to server; extend the action.meta to let it know we're beginning an optimistic update
    return next(
        Object.assign({}, action, {
            meta: { optimistic: { type: BEGIN, id: transactionID } },
        })
    )
}
