import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { Observable } from 'rxjs';

const initEpic = (action$) => action$
    .ofType('INIT')
    .mergeMap(action => {
        const fetchOptions = {
        // Includes the credentials for the requested origin (So an app store cookie if it exists)
            credentials: 'include',
        };

        return window.fetch('http://localhost:3099/api/apps/all', fetchOptions)
            .then(response => response.json())
            .then(response => response.ok ? response : Promise.reject(response))
            .then(apps => ({
                type: 'APPS_LIST_LOADED_ALL',
                payload: apps,
            }))
            .catch(apps => ({
                type: 'APPS_LIST_LOADING_ERROR',
                payload: error.message,
            }));
    });

const epicMiddleware = createEpicMiddleware(initEpic)

function appsListReducer(state = {}, action) {
    switch (action.type) {
        case 'APPS_LIST_LOADING_ERROR':
            return Object.assign({}, state, { error: action.payload });
    }
    return state;
}

const reducer = combineReducers({
    appsList: appsListReducer,
});

export default createStore(reducer, applyMiddleware(epicMiddleware));