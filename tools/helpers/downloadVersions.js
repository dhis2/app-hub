const request = require('request-promise-native')
const fs = require('fs')
const path = require('path')

module.exports = async (dir, app) => {
    const versionDownloadPromises = app.versions.map((appVersion) => {
        return new Promise((resolve, reject) => {
            const appVersionFile = fs.createWriteStream(
                path.join(dir, appVersion.version + '.zip')
            )
            request(appVersion.downloadUrl)
                .pipe(appVersionFile)
                .on('finish', () => {
                    console.log(
                        `Successfully downloaded app version: ${appVersion.version} => ${appVersion.version}.zip.`
                    )
                    resolve()
                })
                .on('error', (error) => {
                    reject(error)
                })
        })
    })
    await Promise.all(versionDownloadPromises)
}
