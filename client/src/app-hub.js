import Debug from 'debug'
import React from 'react'
import { render } from 'react-dom'
import AppHub from './AppHub'

const debug = Debug('apphub:init')

debug(`App Hub, version ${__APP_INFO__.version}`)
debug(`Built: ${new Date(__APP_INFO__.built).toString()}`)

render(<AppHub />, document.getElementById('appHub'))
