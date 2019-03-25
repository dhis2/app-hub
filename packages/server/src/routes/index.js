

const { flatten } = require('@utils')

const routes = flatten([
    require('./v1'),
    require('./v2')
])

module.exports = routes
