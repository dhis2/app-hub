import { CssVariables, CssReset } from '@dhis2/ui'
import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { Router, Route, Redirect, Switch } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { Auth } from './api'
import styles from './AppHub.module.css'
import AlertsProvider from './components/AlertsProvider/AlertsProvider'
import AuthProvider from './components/auth/AuthProvider'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Header from './components/Header/Header'
import Apps from './pages/Apps/Apps'
import AppView from './pages/AppView/AppView'
import OrganisationView from './pages/OrganisationView/OrganisationView'
import OrganisationInvitation from './pages/OrganisationInvitation/OrganisationInvitation'
import OrganisationInvitationCallback from './pages/OrganisationInvitationCallback/OrganisationInvitationCallback'
import UserView from './pages/UserView/UserView'
import store from './store'
import { history } from './utils/history'

import './styles/auth0-overrides.css'
import './styles/styles.css'

const AppHub = () => (
    <ReduxProvider store={store}>
        <AuthProvider>
            <Router history={history}>
                <QueryParamProvider
                    ReactRouterRoute={Route}
                    stringifyOptions={{ skipEmptyString: true }}
                >
                    <AlertsProvider>
                        <CssReset />
                        <CssVariables colors spacers />
                        <Header />
                        <main className={styles.main}>
                            <Switch>
                                <Route exact path="/" component={Apps} />
                                <Route path="/app/:appId" component={AppView} />
                                <Route
                                    path="/organisation/:organisationSlug/view"
                                    component={OrganisationView}
                                />
                                <ProtectedRoute
                                    path="/user"
                                    auth={Auth}
                                    component={UserView}
                                />
                                <ProtectedRoute
                                    path="/verify/org/callback"
                                    auth={Auth}
                                    component={OrganisationInvitationCallback}
                                />
                                <Route
                                    exact
                                    path="/verify/org"
                                    component={OrganisationInvitation}
                                />
                                {/* No-match route - redirect to index */}
                                <Route render={() => <Redirect to="/" />} />
                            </Switch>
                        </main>
                    </AlertsProvider>
                </QueryParamProvider>
            </Router>
        </AuthProvider>
    </ReduxProvider>
)

export default AppHub
