import Epics from './actions/epics';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import createLogger from 'redux-logger';
import userReducer from './reducers/userReducer';
import appListReducer from './reducers/appListReducer';
import dialogReducer from './reducers/dialogReducer';
import snackbarReducer from './reducers/snackbarReducer';
import formReducer from './reducers/formReducer';
import optimisticMiddleware from './store/ReduxOptimisticMiddleware';

const middlewares = [optimisticMiddleware,createEpicMiddleware(Epics)];

if(process.env.NODE_ENV === 'development') {
    middlewares.push(createLogger({
        collapsed: (getState, action) => action.type.startsWith('@@redux-form')

    }))
}


const reducer = combineReducers({
    appsList: appListReducer,
    user: userReducer,
    dialog: dialogReducer,
    snackbar: snackbarReducer,
    form: formReducer,
});

export default createStore(reducer, applyMiddleware(...middlewares));