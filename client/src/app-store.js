import React from 'react'
import { render } from 'react-dom'
import AppStore from './components/AppStore.jsx'
import 'whatwg-fetch'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

render(<AppStore />, document.getElementById('appStore'))
