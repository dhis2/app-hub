import React from 'react';
import { render } from 'react-dom';
import AppStore from './AppStore.jsx';
import store from './store';

// const fetchOptions = {
//     // Includes the credentials for the requested origin (So an app store cookie if it exists)
//     credentials: 'include',
// };

// window.fetch('http://localhost:3099/api/apps/all', fetchOptions)
//     .then(response => response.json())
//     .then(response => console.log(response));

store.subscribe(() => {
    render(<AppStore />, document.getElementById('appStore'));
});

store.dispatch({ type: 'INIT' });
