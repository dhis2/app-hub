const { flatten } = require('../utils')

const routes = flatten([
    require('./v1'),
    require('./v2')
])

console.log(routes)

module.exports = routes 