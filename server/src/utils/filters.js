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

    for (let i = 0, n = apps.length; i < n; ++i) {
        const appRow = apps[i]

        const maxVersion = semver.coerce(appRow.max_dhis2_version)

        const maxVersionValid = semver.valid(maxVersion)

        const minVersion = semver.coerce(appRow.min_dhis2_version)

        if (maxVersionValid) {
            const maxPatch = maxVersion.patch === 0 ? '*' : maxVersion.patch
            debug(
                `Using maxVersion: ${maxVersion.major}.${maxVersionValid.minor}.${maxPatch}`
            )
            if (
                semver.satisfies(
                    dhis2Semver.version,
                    `${minVersion.version} - ${maxVersion.major}.${maxVersion.minor}.${maxPatch}`
                )
            ) {
                filteredApps.push(appRow)
            }
        } else if (
            semver.satisfies(dhis2Semver.version, `>= ${minVersion.version}`)
        ) {
            filteredApps.push(appRow)
        }
    }

    return filteredApps
}

module.exports = {
    filterAppsBySpecificDhis2Version,
}
