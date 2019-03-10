'use strict'

const { flatten } = require('../../utils')

module.exports = flatten(
    require('./apps/index.js'),
    //require('./reviews.js'),
)
