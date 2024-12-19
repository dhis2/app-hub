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
            changeSummary: [
                {
                    type: 'Bug Fixes',
                    text: 'use form container component for styling consistency',
                    linkText: 'c74a4ca',
                    link: 'https://github.com/dhis2/login-app/commit/c74a4ca08f102e8f8c27065e079a066315577a7d',
                },
                {
                    type: 'Features',
                    text: 'add email verification pages',
                    linkText: '916dac3',
                    link: 'https://github.com/dhis2/login-app/commit/916dac36a03ade4a05383af0be454517a165ed8c',
                }
            ],
        ] 
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

        let lastLogType = ''
        lines.forEach((line) => {
            // version header
            if (line.match(/^\#{1,2}\s/)) {
                const versionName = this.#getVersion(line)
                versions.push({ version: versionName, changeSummary: [] })
            }

            // logType: Features, Bug Fixes etc...

            if (line.match(/^\#{3}\s/)) {
                const logType = this.#getLogType(line)

                lastLogType = logType

                if (logType === 'BREAKING CHANGES') {
                    const lastVersion = versions[versions.length - 1]
                    lastVersion.isBreaking = true
                    versions[versions.length - 1] = lastVersion
                }
            }

            // single *: commit description
            if (line.match(/^\*\s/)) {
                const link = this.#getLink(line)
                const changeSummary = {
                    type: lastLogType,
                    text: line
                        ?.replace(/^\*\s/, '')
                        .replace(/\(.+\)$/, '')
                        .trim(),
                    ...link,
                }

                if (line.includes('**translations:**')) {
                    changeSummary.isTranslation = true
                }

                versions[versions.length - 1].changeSummary.push(changeSummary)
            }
        })

        return versions
    }

    #getVersion = (line) => {
        const matches = /(?<version>\d+\.\d+\.\d+)/.exec(line)
        return matches?.groups?.version
    }

    #getLogType = (line) => {
        const matches = /^\#{3} (?<logType>.+)/.exec(line)
        return matches?.groups?.logType
    }

    #getLink = (line) => {
        const matches = /\(\[(?<linkText>.+)\]\((?<link>.+)\)\)$/.exec(line)
        return matches?.groups
    }
}

module.exports = Changelog
