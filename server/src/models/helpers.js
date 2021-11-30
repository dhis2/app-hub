const semverCoerce = require('semver/functions/coerce')
const semverSatisfies = require('semver/functions/satisfies')
const semverValid = require('semver/functions/valid')

const DHIS2_RANGE = '>=2.0.0 <3.0.0'

// joi helper for use with .custom()
const isSemver = (value, helpers) => {
    if (semverValid(value) == null) {
        return helpers.message('Invalid semantic version')
    }
    return value
}

const isValidDHIS2Version = (value, helpers) => {
    if (!value) {
        return value
    }

    const val = semverCoerce(value)
    if (!val || !semverSatisfies(val, DHIS2_RANGE)) {
        return helpers.message(`{{#label}}: invalid DHIS2 version`)
    }

    const { major, minor } = val

    // drop semver-patch version, eg. 2.37.0 -> 2.37
    return `${major}.${minor}`
}

module.exports = {
    isSemver,
    isValidDHIS2Version,
}
