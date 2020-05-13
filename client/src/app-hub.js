import React from 'react'
import { render } from 'react-dom'
import AppHub from './components/AppHub.jsx'
import 'whatwg-fetch'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

render(<AppHub />, document.getElementById('appHub'))
