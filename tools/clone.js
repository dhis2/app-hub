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

const findAppByName = (name, list) => {
    for (let i = 0; i < list.length; ++i) {
        const app = list[i]
        if (app.name === name) {
            return app
        }
    }
    return null
}

async function main() {
    const sourceUrl = 'https://play.dhis2.org/appstore/api/apps'
    const targetUrl = 'http://localhost:3000/api'
    const authToken = await getAuth0Token()

    const publishedApps = await request(sourceUrl)
    const appsJson = JSON.parse(publishedApps)

    let targetApps = await request(`${targetUrl}/apps`)
    let existingAppsAtTarget = JSON.parse(targetApps)

    //TODO: make configurable
    const cleanTarget = true

    if (cleanTarget) {
        for (let i = 0; i < existingAppsAtTarget.length; ++i) {
            const app = existingAppsAtTarget[i]
            console.log(`Deleting app '${app.name}'`)
            await request.delete({
                url: `${targetUrl}/apps/${app.id}`,
                headers: {
                    Authorization: 'Bearer ' + authToken,
                },
            })
        }
        //refresh existing apps
        targetApps = await request(`${targetUrl}/apps`)
        existingAppsAtTarget = JSON.parse(targetApps)
    }

    for (let i = 0; i < appsJson.length; ++i) {
        const app = appsJson[i]

        const existingApp = findAppByName(app.name, existingAppsAtTarget)

        if (existingApp !== null) {
            //app exists, but all versions?
            console.log(
                `App "${app.name}" already exists at target/destination, skipping it.`
            )
            continue
        }

        if (!fs.existsSync('./apps')) {
            fs.mkdirSync('./apps')
        }

        const dir = './apps/' + app.name.replace('/', '-')
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, '0777', true)
        }

        console.log(`Downloading app: ${app.name} to ${dir}`)

        if (!app.developer.email || app.developer.email == '') {
            console.log(`Skipping app because no developer email is set`)

            //also store this in an array so we can summarize errors after the run has completed
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
