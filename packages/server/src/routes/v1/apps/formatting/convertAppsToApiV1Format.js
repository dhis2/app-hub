function convertDbAppViewRowToAppApiV1Object(app) {
    const basicAppInfo = {
        appType: app.type,

        status: app.status,

        id: app.uuid,
        created: +new Date(app.status_created_at),
        lastUpdated: + new Date(app.version_created_at),

        name: app.name,
        description: app.description,
        
        versions: [],

        //TODO: set address
        developer: {address:'', email: app.developer_email, organisation: app.organisation, name: `${app.developer_first_name} ${app.developer_last_name}`.trim()},

        //TODO: set correct owner
        owner: 'oauth-token|id',
        images: [],

        //TODO: set sourceUrl
        sourceUrl: app.source_url || '',
        reviews: []
    }
    return basicAppInfo;
}



function convertAppToV1AppVersion(app, serverUrl) {
    return ({
        created: +new Date(app.version_created_at),

        //TODO: set demoUrl
        demoUrl: app.demo_url || '',
        downloadUrl: `${serverUrl}/apps/download/${app.version_uuid}`,
        id: app.version_uuid,
        lastUpdated: +new Date(app.version_created_at),
        maxDhisVersion: app.max_dhis2_version,
        minDhisVersion: app.min_dhis2_version,
        version: app.version
    })
}


module.exports = (apps, request) => {
    
    const serverUrl = `${request.server.info.protocol}://${request.info.host}`

    console.log(`Using serverUrl: ${serverUrl}`)
    
    const formattedApps = {};

    apps.forEach(app => {
        let currentApp = formattedApps[app.uuid];
        
        if ( !currentApp ) {
            const v1App = convertDbAppViewRowToAppApiV1Object(app);
            formattedApps[app.uuid] = v1App;
            currentApp = v1App;
        }
            
        currentApp.versions.push(convertAppToV1AppVersion(app, serverUrl))
    })
    
    console.log(formattedApps)

    return Object.keys(formattedApps).map(x => formattedApps[x])
}