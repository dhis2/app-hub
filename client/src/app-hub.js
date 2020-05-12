import React from 'react'
import { render } from 'react-dom'
import AppHub from './components/AppHub.jsx'
import 'whatwg-fetch'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Debug from 'debug'

const debug = Debug('apphub:init')

debug(`App Hub, version ${__APP_INFO__.version}`) //eslint-disable-line no-undef
debug(`Built: ${new Date(__APP_INFO__.built).toString()}`) //eslint-disable-line no-undef

render(<AppHub />, document.getElementById('appHub'))
