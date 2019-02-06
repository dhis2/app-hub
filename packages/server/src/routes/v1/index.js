const { flatten } = require('../../utils')

exports.routes = flatten([
    require('./apps.js'),
    //require('./reviews.js'),
])
