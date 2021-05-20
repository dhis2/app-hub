import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { createLogger } from 'redux-logger'
import { createEpicMiddleware } from 'redux-observable'
import Epics from './actions/epics'
import userReducer from './reducers/userReducer'

const epicMiddleware = createEpicMiddleware()
const middlewares = [epicMiddleware]

if (process.env.NODE_ENV === 'development') {
    middlewares.push(
        createLogger({
            collapsed: (getState, action) =>
                action.type.startsWith('@@redux-form'),
        })
    )
}

const reducer = combineReducers({
    user: userReducer,
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(...middlewares))
)
epicMiddleware.run(Epics)

export default store
