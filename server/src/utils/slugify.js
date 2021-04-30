// The punycode core module is deprecated but userland modules don't hide core
// modules,so we have to add a forward slash at the end of the import in order
// to specify the userland module.
const punycode = require('punycode/')
const slugify = require('slugify')

exports.slugify = string => slugify(punycode.encode(string), { lower: true })
