import React from 'react';
import 'material-components-web/build/material-components-web.css';
import AppView from './appCards/AppCards';
import Header from './header/Header';

export default function AppStore() {
    return (
        <div className="app">
            <Header><div>"test"</div></Header>
            <AppView></AppView>
            <main>
                The app store!
                {/* Route provider */}
            </main>
        </div>
    );
}
