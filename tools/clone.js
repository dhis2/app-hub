require('dotenv').config()

const request = require('request-promise-native')
const fs = require('fs')
const path = require('path')
const slugify = require('slugify')
const rimraf = require('rimraf')

const uploadVersions = require('./helpers/uploadVersions')
const downloadVersions = require('./helpers/downloadVersions')
const getAuth0Token = require('./helpers/getAuthToken')
const downloadImages = require('./helpers/downloadImages')
const uploadImages = require('./helpers/uploadImages')

const errors = []

async function main() {
    const sourceUrl = 'https://play.dhis2.org/appstore/api/apps'
    const targetUrl = 'http://localhost:3000/api'
    const authToken = await getAuth0Token()

    const publishedApps = await request(sourceUrl)
    const appsJson = JSON.parse(publishedApps)

    for (let i = 0; i < appsJson.length; ++i) {
        const app = appsJson[i]

        if (!fs.existsSync('./apps')) {
            fs.mkdirSync('./apps')
        }

        const dir = './apps/' + app.name
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }

        console.log(`Downloading app: ${app.name}`)

        if (!app.developer.email || app.developer.email == '') {
            errors.push(`${app.name} | No developer email set. Skipping.`)
            continue
        }

        app.developer.address = app.developer.address || ''

        const appBase = {
            name: app.name,
            description: app.description,
            developer: app.developer,
            sourceUrl: app.sourceUrl || '',
            appType: app.appType,
            versions: [],
        }

        const v = app.versions[0]
        appBase.versions.push({
            version: v.version,
            minDhisVersion: v.minDhisVersion,
            maxDhisVersion: v.maxDhisVersion || '',
            demoUrl: v.demoUrl || '',
            channel: 'Stable',
        })
        await downloadVersions(dir, app)
        await downloadImages(dir, app)

        //create app with first version
        const appVersion = app.versions[0]
        const appVersionFile = path.join(dir, appVersion.version + '.zip')
        const form = {
            app: JSON.stringify(appBase),
            file: {
                value: fs.createReadStream(appVersionFile),
                options: {
                    filename: `${slugify(appBase.name)}_${
                        appVersion.version
                    }.zip`,
                    contentType: 'application/zip',
                },
            },
        }
        const createApp = await request.post({
            url: `${targetUrl}/apps`,
            json: true,
            headers: {
                Authorization: 'Bearer ' + authToken,
            },
            formData: form,
        })

        console.log(`Created app with id: ${createApp.uuid}`)
        await request.post({
            url: `${targetUrl}/apps/${createApp.uuid}/approval?status=APPROVED`,
            headers: {
                Authorization: 'Bearer ' + authToken,
            },
        })

        console.log('Uploading images')
        await uploadImages({
            targetUrl,
            authToken,
            dir,
            app,
            appId: createApp.uuid,
        })

        if (app.versions.length > 1) {
            console.log('Uploading versions')
            await uploadVersions({
                targetUrl,
                authToken,
                dir,
                app,
                appId: createApp.uuid,
                errors,
            })
        }
    }

    if (errors && errors.length > 0) {
        console.log(' === WARNING: Found errors during run === ')
        errors.map(err => console.error(err))
    }

    console.log('Cleaning up...')
    await rimraf('./apps', function() {
        console.log('Done.')
    })
}

main()
