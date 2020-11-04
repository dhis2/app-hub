import React from 'react'
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
import { Provider } from 'react-redux'
import store from '../store'
import { Auth } from '../api/api'
import '../utils/preRender'

export default function AppHub() {
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
                                    auth={Auth}
                                    component={UserView}
                                />
                                {/* No-match route - redirect to index */}
                                <Route render={() => <Redirect to="/" />} />
                            </Switch>
                        </div>
                        <Snackbar />
                    </div>
                </Router>
            </MuiThemeProvider>
        </Provider>
    )
}
