const AdmZip = require('adm-zip')
const debug = require('debug')('apphub:server:create-app-version')
const request = require('request-promise-native')

const getChangeLog = async (appRepo) => {
    debug(`Getting changelog from: ${appRepo}`)
    const possibleBranches = ['master', 'main']

    for (const branch of possibleBranches) {
        const targetUrl =
            appRepo
                ?.replace(/\/$/, '')
                ?.replace(
                    'https://github.com',
                    'https://raw.githubusercontent.com'
                ) + `/refs/heads/${branch}/CHANGELOG.md`

        debug(`Getting changelog from: ${targetUrl}`)

        try {
            const response = await request.get({
                url: targetUrl,
                contentType: 'plain/text',
            })
            return response
        } catch (err) {
            console.error(err)
        }
    }

    return null
}

module.exports = async ({ buffer, appRepo }) => {
    try {
        const zip = new AdmZip(buffer)
        const d2ConfigPath = 'd2.config.json'
        const changelogPath = 'CHANGELOG.md'

        const d2ConfigJson = zip.readAsText(d2ConfigPath)

        let changelog = zip.readAsText(changelogPath)

        if (!changelog) {
            const result = await getChangeLog(appRepo)
            if (result) {
                changelog = result
            }
        }

        const d2config = JSON.parse(d2ConfigJson)

        return {
            d2config,
            changelog,
        }
    } catch (err) {
        return {
            d2config: null,
            changelog: null,
        }
    }
}
