import semver from 'semver'

export const semverValidator = value => {
    if (!semver.valid(value)) {
        return 'Not a valid semantic version, adjust the version numbering'
    }
}
