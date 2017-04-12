import React from 'react';
import { render } from 'react-dom';
import AppStore from './components/AppStore.jsx';
import store from './store';

render(<AppStore />, document.getElementById('appStore'));

