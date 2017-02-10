import React from 'react';

import AppView from './appView/AppView';
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
