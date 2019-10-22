import Epics from './actions/epics'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { createLogger } from 'redux-logger'
import userReducer from './reducers/userReducer'
import appListReducer from './reducers/appListReducer'
import dialogReducer from './reducers/dialogReducer'
import snackbarReducer from './reducers/snackbarReducer'
import formReducer from './reducers/formReducer'
import channelReducer from './reducers/channelReducer'
import optimisticMiddleware from './store/ReduxOptimisticMiddleware'

const epicMiddleware = createEpicMiddleware()
const middlewares = [optimisticMiddleware, epicMiddleware]

if (process.env.NODE_ENV === 'development') {
    middlewares.push(
        createLogger({
            collapsed: (getState, action) =>
                action.type.startsWith('@@redux-form'),
        })
    )
}

const reducer = combineReducers({
    appsList: appListReducer,
    user: userReducer,
    dialog: dialogReducer,
    snackbar: snackbarReducer,
    form: formReducer,
    channels: channelReducer,
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(...middlewares))
)
epicMiddleware.run(Epics)

export default store
