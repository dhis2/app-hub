import React, { Component } from 'react'
import { Router, Route, Redirect, Switch } from 'react-router-dom'
import { history } from '../utils/history'
import 'material-components-web/dist/material-components-web.css'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import theme from '../styles/theme'
import '../styles/override.css'
import AppCards from './appCards/AppCards'
import AppView from './appView/AppView'
import UserView from './user/UserView'
import Header from './header/Header'
import Snackbar from './utils/Snackbar'
import DialogRoot from './dialog/DialogRoot'
import PrivateRoute from './utils/PrivateRoute'
import { Provider, connect } from 'react-redux'
import store from '../store'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { getAuth } from '../utils/AuthService'

injectTapEventPlugin()

const auth = getAuth()
export default function AppStore() {
    return (
        <Provider store={store}>
            <MuiThemeProvider muiTheme={theme}>
                <Router history={history}>
                    <div className="app">
                        <DialogRoot />
                        <Header />
                        <div id="container" style={theme.container}>
                            <Switch>
                                <Route exact path="/" component={AppCards} />
                                <Route path="/app/:appId" component={AppView} />
                                <PrivateRoute
                                    path="/user"
                                    auth={auth}
                                    component={UserView}
                                />
                                {/* No-match route - redirect to index */}
                                <Route render={props => <Redirect to="/" />} />
                            </Switch>
                        </div>

                        <Snackbar />
                    </div>
                </Router>
            </MuiThemeProvider>
        </Provider>
    )
}
