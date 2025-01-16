const fs = require('fs')
const Changelog = require('../../src/utils/changelog')

const changelogContents = fs.readFileSync(
    __dirname + '/changelog_sample.txt',
    'utf-8'
)

describe('changelog', () => {
    it('should parse the log', () => {
        const result = new Changelog(changelogContents)

        expect(result.data[0]).toEqual({
            version: '100.2.0',
            changeSummary: [
                {
                    type: 'Bug Fixes',
                    text: 'use form container component for styling consistency',
                    linkText: 'c74a4ca',
                    link: 'https://github.com/dhis2/login-app/commit/c74a4ca08f102e8f8c27065e079a066315577a7d',
                },
                { type: 'Bug Fixes', text: 'second bug fix' },
                {
                    type: 'Features',
                    text: 'add email verification pages',
                    linkText: '916dac3',
                    link: 'https://github.com/dhis2/login-app/commit/916dac36a03ade4a05383af0be454517a165ed8c',
                },
                { type: 'Features', text: 'second feature' },
                { type: 'Features', text: 'third feature' },
            ],
        })
    })

    it('should highlight translation changes', () => {
        const result = new Changelog(changelogContents)
        const translations = result.data.filter((r) =>
            r.changeSummary.find((e) => e.isTranslation)
        )
        expect(translations).toHaveLength(9)
    })
    it('should highlight breaking changes', () => {
        const result = new Changelog(changelogContents)
        const changes = result.data.filter((r) => r.isBreaking)
        expect(changes).toHaveLength(1)
        expect(changes[0].version).toEqual('100.0.0')
    })
    it('should not fail with invalid changelog', () => {
        const result = new Changelog('invalid changelog')
        expect(result.data).toHaveLength(0)
    })
    it('should not fail with undefine changelog', () => {
        const result = new Changelog(undefined)
        expect(result.data).toHaveLength(0)
    })
})
