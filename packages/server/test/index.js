const Lab = require('lab')

const { server, db } = require('../src/main.js')

// prepare environment
module.exports = {
    lab: Lab.script(),
    server,
    db,
}

console.log('Tests are running in env: ' + process.env.NODE_ENV)

require('./data')
require('./routes')
require('./security')
require('./utils')
