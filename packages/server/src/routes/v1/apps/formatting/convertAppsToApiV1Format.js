const path = require('path')
const { ImageType } = require('@enums')

const convertDbAppViewRowToAppApiV1Object = (app) => ({
    appType: app.type,

    status: app.status,

    id: app.uuid,
    created: +new Date(app.status_created_at),
    lastUpdated: +new Date(app.version_created_at),

    name: app.name,
    description: app.description,

    versions: [],

    //TODO: set address
    developer: { address:'', email: app.developer_email, organisation: app.organisation, name: app.developer_name },

    //TODO: can we use developer_email here ? previous it was oauth token|id
    owner: app.developer_email,
    images: [],

    sourceUrl: app.source_url || '',
    reviews: []
})


const convertAppToV1Media = (app, serverUrl) => {

    return ({
        imageUrl: `${serverUrl}/v1/apps/media/${app.organisation_slug}/${app.version_uuid}/${app.media_uuid}`,
        caption: '',
        created: +new Date(app.media_created_at),
        description: '',
        id: app.media_uuid,
        lastUpdated: +new Date(app.media_created_at),
        logo: app.image_type === ImageType.Logo
    })
}


const convertAppToV1AppVersion = (app, serverUrl) => {

    if ( serverUrl === null || typeof ( serverUrl) === 'undefined' ) {
        throw new Error('Missing parameter: serverUrl')
    }

    return ({
        created: +new Date(app.version_created_at),

        demoUrl: app.demo_url || '',
        downloadUrl: `${serverUrl}/v1/apps/download/${app.organisation_slug}/${app.appver_slug}/${app.version}/app.zip`,
        id: app.version_uuid,
        lastUpdated: +new Date(app.version_created_at),
        maxDhisVersion: app.max_dhis2_version,
        minDhisVersion: app.min_dhis2_version,
        version: app.version
    })
}


module.exports = (apps, request) => {

    if ( request === null || typeof ( request) === 'undefined' ) {
        throw new Error('Missing parameter: request')
    }

    const serverUrl = `${request.server.info.protocol}://${request.info.host}`

    console.log(`Using serverUrl: ${serverUrl}`)

    const formattedApps = {};

    apps.forEach((app) => {

        let currentApp = formattedApps[app.uuid];

        if ( !currentApp ) {
            const v1App = convertDbAppViewRowToAppApiV1Object(app);
            formattedApps[app.uuid] = v1App;
            currentApp = v1App;
        }

        if ( app.media_uuid !== null ) {
            currentApp.images.push(convertAppToV1Media(app, serverUrl))
        }

        currentApp.versions.push(convertAppToV1AppVersion(app, serverUrl))
    })

    return Object.keys(formattedApps).map((x) => formattedApps[x])
}
