import fs from 'fs'
import Changelog from '../../src/utils/changelog'

const changelogContents = fs.readFileSync(
    __dirname + '/changelog_sample.txt',
    'utf-8'
)

describe('changelog', () => {
    it('should parse the change log and save the raw changes in a version', () => {
        const result =
            new Changelog(`# [100.2.0](https://github.com/dhis2/login-app/compare/v100.1.15...v100.2.0) (2024-12-16)

### Bug Fixes

* first bug fix ([c74a4ca](https://github.com/dhis2/login-app/commit/c74a4ca08f102e8f8c27065e079a066315577a7d))
* second bug fix

### Features

* first feature ([916dac3](https://github.com/dhis2/login-app/commit/916dac36a03ade4a05383af0be454517a165ed8c))
* second feature
* third feature

## [100.1.15](https://github.com/dhis2/login-app/compare/v100.1.14...v100.1.15) (2024-12-08)


### Bug Fixes

* **translations:** sync translations from transifex (main) ([0da02ed](https://github.com/dhis2/login-app/commit/0da02edc0dcd82067180549c0c726b817990a5c7))

## [100.1.14](https://github.com/dhis2/login-app/compare/v100.1.13...v100.1.14) (2024-10-06)


### Bug Fixes

* another bug
                `)

        expect(result.data[0].rawChangeSummary.replace(/\n/gm, '')).toMatch(
            '### Bug Fixes* first bug fix ([c74a4ca](https://github.com/dhis2/login-app/commit/c74a4ca08f102e8f8c27065e079a066315577a7d))* second bug fix### Features* first feature ([916dac3](https://github.com/dhis2/login-app/commit/916dac36a03ade4a05383af0be454517a165ed8c))* second feature* third feature'
        )
        expect(result.data[1].rawChangeSummary.replace(/\n/gm, '')).toMatch(
            '### Bug Fixes* **translations:** sync translations from transifex (main) ([0da02ed](https://github.com/dhis2/login-app/commit/0da02edc0dcd82067180549c0c726b817990a5c7))'
        )
        expect(result.data[2].rawChangeSummary.replace(/\n/gm, '')).toMatch(
            '### Bug Fixes* another bug'
        )
        expect(result.data.length).toEqual(3)
    })

    it('should parse the version and the log', () => {
        const result = new Changelog(changelogContents)

        expect(result.data[0].version).toEqual('100.2.0')
        expect(result.data[0].rawChangeSummary).toMatch(`
### Bug Fixes

* use form container component for styling consistency ([c74a4ca](https://github.com/dhis2/login-app/commit/c74a4ca08f102e8f8c27065e079a066315577a7d))
* second bug fix

### Features

* add email verification pages ([916dac3](https://github.com/dhis2/login-app/commit/916dac36a03ade4a05383af0be454517a165ed8c))
* second feature
* third feature
`)
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
