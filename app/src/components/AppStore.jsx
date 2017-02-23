import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import themeRT from '../styles/react-toolbox/theme';
import ThemeProvider from 'react-toolbox/lib/ThemeProvider';
import 'material-components-web/build/material-components-web.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import theme from '../styles/theme';
import '../styles/react-toolbox/theme.css';
import '../styles/override.css';
import AppCards from './appCards/AppCards';
import AppView from './appView/AppView';
import UserView from './user/UserView';
import Header from './header/Header';
import {Provider} from 'react-redux';
import store from '../store';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


export default function AppStore() {
    return (

            <Provider store={ store }>
                <MuiThemeProvider muiTheme={theme}>
                <Router>

                    <ThemeProvider theme={themeRT}>
                    <div className="app">
                        <Header />


                        <Route exact path="/" component={AppCards}/>
                        <Route path='/app/:appId' component={AppView}/>



                        <Route path='/user/' component={UserView}/>
                        <main>
                            {/* Route provider */}
                        </main>

                    </div>
                    </ThemeProvider>
                </Router>
                </MuiThemeProvider>
            </Provider>

    );
}
