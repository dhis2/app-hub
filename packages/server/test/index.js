const Lab = require('lab')

// prepare environment
module.exports = {
    lab: Lab.script(),
    server: require('../src/main.js').server
}

console.log('Tests are running in env: ' + process.env.NODE_ENV)

require('./data')
require('./routes')
require('./security')
require('./utils')

