import createBrowserHistory from 'history/createBrowserHistory'
import config from '../config'

export const history = (() =>
    createBrowserHistory({ basename: config.routes.baseAppName }))()

export default history
