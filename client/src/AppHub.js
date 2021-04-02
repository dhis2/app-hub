import { CssVariables, CssReset } from '@dhis2/ui-core'
import React from 'react'
import { Router, Route, Redirect, Switch } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { Provider as ReduxProvider } from 'react-redux'
import { history } from './utils/history'
import Apps from './pages/Apps/Apps'
import AppView from './pages/AppView/AppView'
import UserView from './pages/UserView/UserView'
import Header from './components/Header/Header'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AuthProvider from './components/auth/AuthProvider'
import store from './store'
import { Auth } from './api'
import styles from './AppHub.module.css'

import './styles/auth0-overrides.css'
import './styles/styles.css'
import 'material-design-icons-iconfont'

const AppHub = () => (
    <ReduxProvider store={store}>
        <AuthProvider>
            <Router history={history}>
                <QueryParamProvider
                    ReactRouterRoute={Route}
                    stringifyOptions={{ skipEmptyString: true }}
                >
                    <CssReset />
                    <CssVariables colors spacers />
                    <Header />
                    <main className={styles.main}>
                        <Switch>
                            <Route exact path="/" component={Apps} />
                            <Route path="/app/:appId" component={AppView} />
                            <ProtectedRoute
                                path="/user"
                                auth={Auth}
                                component={UserView}
                            />
                            {/* No-match route - redirect to index */}
                            <Route render={() => <Redirect to="/" />} />
                        </Switch>
                    </main>
                </QueryParamProvider>
            </Router>
        </AuthProvider>
    </ReduxProvider>
)

export default AppHub
