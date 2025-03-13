/**
 * A helper for parsing a semantic release changelog into a format easier to consume in our frontend
 *
 */
class Changelog {
    /**
     * @public the parsed contents of the change log
     * 
     * @example [{
            version: '100.2.0',
            rawChangeSummary: `
                ### Bug Fixes

                * first bug fix ([c74a4ca](https://github.com/dhis2/login-app/commit/c74a4ca08f102e8f8c27065e079a066315577a7d))
                * second bug fix`
            }] 
     */
    data = []

    /**
     * The construction takes the changelog file content and parses it to `data` property
     * @constructor
     * @param {string} _changelog the changelog to parse
     */
    constructor(_changelog) {
        if (typeof _changelog === 'string') {
            this.#rawChangeLog = _changelog
            this.data = this.#parseChangelog()
        }
    }

    /**
     * property for the raw change log
     *
     * @private
     */
    #rawChangeLog

    /**
     * parses the changelog and assigns it to the public property data
     *
     * @private
     */
    #parseChangelog = () => {
        const lines = this.#rawChangeLog?.split('\n')

        const versions = []

        let lastVersion

        lines.forEach((line) => {
            // version header
            if (line.match(/^#{1,2}\s/)) {
                lastVersion = {
                    version: this.#getVersion(line),
                    changeSummary: [],
                    rawChangeSummary: '',
                }
                versions.push(lastVersion)
            } else {
                if (lastVersion) {
                    lastVersion.rawChangeSummary =
                        lastVersion.rawChangeSummary + '\n' + line
                }
            }
        })

        return versions
    }

    #getVersion = (line) => {
        const matches = /(?<version>\d+\.\d+\.\d+)/.exec(line)
        return matches?.groups?.version
    }
}

export const getFormattedChangeType = ({ type, isTranslation }) => {
    if (isTranslation) {
        return null
    }
    if (type === 'Bug Fixes') {
        return 'Fix: '
    }
    if (type == 'Features') {
        return 'Feature: '
    }
    return type + ': '
}

export default Changelog
