const semverValid = require('semver/functions/valid')

// joi helper for use with .custom()
const isSemver = (value, helpers) => {
    if(semverValid(value) == null) {
        return helpers.message('Invalid semantic version')
    }
    return value
}

module.exports = {
    isSemver,
}
