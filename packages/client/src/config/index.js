let conf
if (typeof __APP_CONFIG__ !== 'undefined') {
    //running in webpack, use predefined config
    conf = __APP_CONFIG__
} else {
    //Not in webpack, ie in tests and webpack.config - provide default
    conf = require('../../default.config')
}

export default conf
