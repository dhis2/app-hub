import React from 'react'
import { render } from 'react-dom'
import AppStore from './components/AppStore.jsx.js'
import 'whatwg-fetch'

render(<AppStore />, document.getElementById('appStore'))
