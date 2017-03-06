import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
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
injectTapEventPlugin();


export default function AppStore() {
    return (

            <Provider store={ store }>
                <MuiThemeProvider muiTheme={theme}>
                <Router>

                    <div className="app">
                        <Header />

                        <Route exact path="/" component={AppCards}/>
                        <Route path='/app/:appId' component={AppView}/>
                        <Route path='/user/' component={UserView}/>

                        <DialogRoot />

                        <Snackbar />
                    </div>
                </Router>
                </MuiThemeProvider>
            </Provider>

    );
}
