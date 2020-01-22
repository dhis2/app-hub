const semver = require('semver')

const debug = require('debug')('apphub:server:utils:filters')

const filterAppsBySpecificDhis2Version = (apps, dhis2Version) => {
    if (!dhis2Version) {
        debug(
            'No dhis2Version to filter by, returning original array with apps'
        )
        return apps
    }

    const filteredApps = []

    const dhis2Semver = semver.coerce(dhis2Version)
    debug('dhis2Semver', dhis2Semver)

    for (let i = 0, n = apps.length; i < n; ++i) {
        const appRow = apps[i]

        const maxVersion = semver.coerce(appRow.max_dhis2_version)
        debug('maxVersion', maxVersion)

        const maxVersionValid = semver.valid(maxVersion)
        debug('maxVersionValid', maxVersionValid)

        const minVersion = semver.coerce(appRow.min_dhis2_version)
        debug('minVersion', minVersion)

        if (
            (maxVersionValid &&
                semver.satisfies(
                    dhis2Semver.version,
                    `${minVersion.version} - ${maxVersion.version}`
                )) ||
            (!maxVersionValid &&
                semver.satisfies(
                    dhis2Semver.version,
                    `>= ${minVersion.version}`
                ))
        ) {
            filteredApps.push(appRow)
        }
    }

    return filteredApps
}

module.exports = {
    filterAppsBySpecificDhis2Version,
}
