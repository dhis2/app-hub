const request = require('request-promise-native')
const fs = require('fs')
const slugify = require('slugify')
const path = require('path')

module.exports = async ({ targetUrl, authToken, dir, app, appId, errors }) => {
    //skip first version as that's already uploaded when the app was created
    for (let i = 1; i < app.versions.length; ++i) {
        const version = app.versions[i]

        if (!version.minDhisVersion) {
            errors.push(
                `${app.name} | Skipping version ${version.version} due to missing attribute: minDhisVersion.`
            )
            continue
        }

        const newVersion = {
            version: version.version,
            minDhisVersion: version.minDhisVersion || '',
            maxDhisVersion: version.maxDhisVersion || '',
            demoUrl: version.demoUrl || '',
            channel: 'stable',
        }

        console.log(
            `Uploading new version: ${newVersion.version} to app: ${app.name}`
        )

        const filePath = path.join(dir, version.version + '.zip')

        const form = {
            version: JSON.stringify(newVersion),
            file: {
                value: fs.createReadStream(filePath),
                options: {
                    filename: `${slugify(app.name)}_${version.version}.zip`,
                    contentType: 'application/zip',
                },
            },
        }
        await request.post({
            url: `${targetUrl}/apps/${appId}/versions`,
            headers: {
                Authorization: 'Bearer ' + authToken,
            },
            json: true,
            formData: form,
        })
    }
}
