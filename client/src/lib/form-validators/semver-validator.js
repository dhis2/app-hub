import semver from 'semver'

export const semverValidator = value => {
    if (!semver.valid(value)) {
        return 'Please provide a valid semantic version'
    }
}
