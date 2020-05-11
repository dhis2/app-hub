import React from 'react'
import { render } from 'react-dom'
import AppHub from './components/AppHub.jsx'
import 'whatwg-fetch'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

console.log(`App Hub, version ${__APP_INFO__.version}`) //eslint-disable-line no-undef
console.log(`Built: ${new Date(__APP_INFO__.built).toString()}`) //eslint-disable-line no-undef

render(<AppHub />, document.getElementById('appHub'))
