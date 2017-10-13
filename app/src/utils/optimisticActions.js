import { COMMIT, REVERT } from "redux-optimistic-ui";
import { actionCreator } from "../actions/actionCreators";
const isTransactionAction = transaction => {
    return (
        transaction &&
        transaction.meta &&
        transaction.meta.optimistic &&
        transaction.meta.optimistic.id
    );
};

/**
 * Tries to parse and get the transaction identifier for an optimistic-action.
 * @param {action} action to get optimistic-iD from
 */
const getTransactionID = transaction => {
    if (isTransactionAction(transaction)) {
        return transaction.meta.optimistic.id;
    }
    if (typeof transaction === "number") {
        return transaction;
    }
    throw new Error("Could not parse transactionID.");
};

/**
 * Action-enhancer that produces an optimistic action
 * by adding optimistic meta properties
 * @param action - Action to extend with optimistic action properties.
 * @returns action - Optimistic action which can be dispatched.
 */
export const optimisticAction = action => ({
    ...action,
    meta: { ...action.meta, isOptimistic: true }
});

/**
 *
 * @param type
 * @returns {function(*=, *=, *=)}
 */
export const optimisticActionCreator = type => (payload, meta, error) => {
    meta = { ...meta, isOptimistic: true };
    return actionCreator(type)(payload, meta, error);
};

/**
 * Commit or revert an optimistic action that has been handled by the server by checking if the action is
 * an error.
 * This will return a new action of 'action' with added optimistic-meta-properties
 * which can be dispatched to commit or revert a transaction.
 * @param action - Resulting action of the closed transaction (committed or reverted).
 * @param {integer|action} transaction of the optimistic-action. Either the transactionID (action.meta.optimistic.id)
 * of the initiating optimistic-action, or the action-object itself.
 * @param error - override error in action.error, results in a reverted action.
 * @returns action - action with enhanced properties so that redux-optimistic-ui can handle the reverted or committed action
 */
export const commitOrRevertOptimisticAction = (
    action,
    transaction,
    error = false
) => {
    if (action.error) {
        error = true;
    }
    let transactionID = getTransactionID(transaction);
    return {
        ...action,
        meta: {
            ...action.meta,
            optimistic: error
                ? { type: REVERT, id: transactionID }
                : { type: COMMIT, id: transactionID }
        }
    };
};

export const commitOptimisticAction = (action, transaction) => {
    return {
        ...action,
        meta: {
            ...action.meta,
            optimistic: { type: COMMIT, id: getTransactionID(transaction) }
        }
    };
};

export const revertOptimisticAction = (action, transaction) => {
    return {
        ...action,
        meta: {
            ...action.meta,
            optimistic: { type: REVERT, id: getTransactionID(transaction) }
        }
    };
};
