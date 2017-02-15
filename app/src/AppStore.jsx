import React from 'react';
import 'material-components-web/build/material-components-web.css';
import AppView from './appCards/AppCards';
import Header from './header/Header';
import { Provider } from 'react-redux';
import store from './store';

export default function AppStore() {
    return (
        <Provider store= { store } >
            <div className="app">
                <Header />
                <AppView></AppView>
                <main>
                    The app store!
                    {/* Route provider */}
                </main>
            </div>
        </Provider>
    );
}
