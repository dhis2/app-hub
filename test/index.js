const Lab = require('@hapi/lab')

// prepare environment
module.exports = {
    lab: Lab.script(),
}

console.log('Tests are running in env: ' + process.env.NODE_ENV)

require('./data')
require('./routes')
require('./security')
require('./utils')
