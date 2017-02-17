import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import theme from './styles/react-toolbox/theme';
import ThemeProvider from 'react-toolbox/lib/ThemeProvider';
import 'material-components-web/build/material-components-web.css';
import './styles/react-toolbox/theme.css';
import './styles/override.css';
import AppCards from './appCards/AppCards';
import AppView from './appView/AppView';
import UserView from './user/UserView';
import Header from './header/Header';
import {Provider} from 'react-redux';
import store from './store';

export default function AppStore() {
    return (

            <Provider store={ store }>
                <Router>
                    <ThemeProvider theme={theme}>
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
            </Provider>

    );
}
