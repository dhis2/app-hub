import { CssVariables, CssReset } from '@dhis2/ui-core'
import React from 'react'
import { Router, Route, Redirect, Switch } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { history } from '../utils/history'
import 'material-components-web/dist/material-components-web.css'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import theme from '../styles/theme'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import '../styles/mdc-layout-grid.css'
import '../styles/slick-overrides.css'
import '../styles/auth0-overrides.css'
import '../styles/styles.css'

import Apps from './apps/Apps'
import AppView from './appView/AppView'
import UserView from './user/UserView'
import Header from './header/Header'
import Snackbar from './utils/Snackbar'
import DialogRoot from './dialog/DialogRoot'
import ProtectedRoute from './auth/ProtectedRoute'
import { Provider as ReduxProvider } from 'react-redux'
import store from '../store'
import { Auth } from '../api/api'
import AuthProvider from '../components/auth/AuthProvider'
import '../utils/preRender'

const AppHub = () => (
    <ReduxProvider store={store}>
        <AuthProvider>
            <MuiThemeProvider muiTheme={theme}>
                <Router history={history}>
                    <QueryParamProvider ReactRouterRoute={Route}>
                        <CssReset />
                        <CssVariables colors theme spacers />
                        <div className="app">
                            <DialogRoot />
                            <Header />
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
                            <Snackbar />
                        </div>
                    </QueryParamProvider>
                </Router>
            </MuiThemeProvider>
        </AuthProvider>
    </ReduxProvider>
)

export default AppHub
