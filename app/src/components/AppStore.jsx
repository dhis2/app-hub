import React from 'react';
import {Router, Route, Redirect} from 'react-router-dom';
import { history } from '../utils/history';
import 'material-components-web/build/material-components-web.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import theme from '../styles/theme';
import '../styles/override.css';
import AppCards from './appCards/AppCards';
import AppView from './appView/AppView';
import UserView from './user/UserView';
import Header from './header/Header';
import Snackbar from './utils/Snackbar';
import DialogRoot from './dialog/DialogRoot';
import ErrorDialog from './dialog/ErrorDialog';
import * as dialogType from '../constants/dialogTypes';
import {Provider} from 'react-redux';
import store from '../store';
import injectTapEventPlugin from 'react-tap-event-plugin';
import * as apiConstants from '../constants/apiConstants';
import LoginView from './user/login/LoginView';
import { getAuth } from '../utils/AuthService';
injectTapEventPlugin();

const auth = getAuth();

const PrivateRoute = ({component, ...rest}) => (
    <Route {...rest} render={props => (
        auth.isLoggedIn() ?
            React.createElement(component, props) : null)}/>// <Redirect to="/login"/>)}/>
)

export default function AppStore() {
    return (

        <Provider store={ store }>
            <MuiThemeProvider muiTheme={theme}>
                <Router history={history}>

                    <div className="app">
                        <Header />
                        <Route exact path="/" component={AppCards}/>
                        <Route path='/app/:appId' component={AppView}/>
                        <Route path="/login" render={(props) => (
                            <LoginView auth={auth} {...props} />)} />
                        <PrivateRoute path='/user/' component={UserView}/>

                        <DialogRoot />

                        <Snackbar />
                    </div>
                </Router>
            </MuiThemeProvider>
        </Provider>

    );
    }
