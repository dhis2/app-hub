import React from 'react';
import {Router, Route, Redirect} from 'react-router-dom';
import { history } from '../utils/history';
import 'material-components-web/dist/material-components-web.css';
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
import LoginView from './user/login/LoginView';
import { getAuth } from '../utils/AuthService';
import { Spinner } from './utils/Loader';
injectTapEventPlugin();

const auth = getAuth();

const PrivateRoute = ({component, ...rest}) => (
    <Route {...rest} render={props => {
        //tokenId is set async, check for hash and show loading
        if(!auth.isLoggedIn() && props.location.hash) {
            return <Spinner size="large" />;
        }
        else if(auth.isLoggedIn()) {
            return React.createElement(component, {auth, ...props})
        } else {
            return (<Redirect to="/login"/>)
        }
    }}/>
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
                        <PrivateRoute path='/user' component={UserView}/>

                        <DialogRoot />

                        <Snackbar />
                    </div>
                </Router>
            </MuiThemeProvider>
        </Provider>

    );
    }
