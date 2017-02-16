import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'material-components-web/build/material-components-web.css';
import './styles/override.css'
import AppCards from './appCards/AppCards';
import AppView from './appView/AppView';
import Header from './header/Header';
import { Provider } from 'react-redux';
import store from './store';

export default function AppStore() {
    return (
        <Provider store= { store } >
            <Router>
            <div className="app">
                <Header />
                <Route exact path="/" component={AppCards} />
                <Route path='/app/:appId' component={AppView} />
                <main>
                    {/* Route provider */}
                </main>

            </div>
            </Router>
        </Provider>
    );
}
