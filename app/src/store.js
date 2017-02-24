import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import createLogger from 'redux-logger';
import Epics from './actions/epics';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import userReducer from './reducers/userReducer';
import appListReducer from './reducers/appListReducer';
import dialogReducer from './reducers/dialogReducer';
import snackbarReducer from './reducers/snackbarReducer';
const middlewares = [createEpicMiddleware(Epics)];

if(process.env.NODE_ENV === 'development') {
    middlewares.unshift(createLogger())
}


const reducer = combineReducers({
    appsList: appListReducer,
    user: userReducer,
    dialog: dialogReducer,
    snackbar: snackbarReducer,
});

export default createStore(reducer, applyMiddleware(...middlewares));