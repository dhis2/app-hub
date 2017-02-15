import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import createLogger from 'redux-logger';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';

const initEpic = (action$) => action$
    .ofType('INIT')
    .startWith({type: 'INIT'})
    .mergeMap(action => {
        const fetchOptions = {
        // Includes the credentials for the requested origin (So an app store cookie if it exists)
            credentials: 'include',
        };

        return window.fetch('http://localhost:3099/api/apps/all', fetchOptions)
            .then(response => response.ok ? response : Promise.reject(response))
            .then(response => response.json())
            .then(apps => ({
                type: 'APPS_LIST_LOADED_ALL',
                payload: apps,
            }))
            .catch(error => ({
                type: 'APPS_LIST_LOADING_ERROR',
                payload: error,
            }));
    })
    //.merge(Observable.of({type: "INIT"}))

const middlewares = [createEpicMiddleware(initEpic)];

if(process.env.NODE_ENV === 'development') {
    middlewares.unshift(createLogger())
}

function appsListReducer(state = {}, action) {
    switch (action.type) {
        case 'APPS_LIST_LOADING_ERROR': {
            return {
                ...state,
                error: action.payload
            }
        }
        case 'APP_LIST_LOADING_ALL': {
            return {
                ...state,
                appList: action.payload
            }
        }

    }
    return state;
}

const reducer = combineReducers({
    appsList: appsListReducer,
});

export default createStore(reducer, applyMiddleware(...middlewares));