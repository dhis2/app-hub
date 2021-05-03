// The punycode core module is deprecated but userland modules don't hide core
// modules,so we have to add a forward slash at the end of the import in order
// to specify the userland module.
const punycode = require('punycode/')
const slugify = require('slugify')

const slugifyOptions = {
    lower: true,
    strict: true,
}

exports.slugify = string => {
    const slug = slugify(string, slugifyOptions)
    return slug.length > 1
        ? slug
        : slugify(punycode.toASCII(string), slugifyOptions)
}
