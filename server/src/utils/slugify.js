const punycode = require('punycode')
const slugify = require('slugify')

exports.slugify = string => slugify(punycode.encode(string), { lower: true })
