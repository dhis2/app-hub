const apps = require('./apps')
const uuid = require('uuid/v4')

const [ dhis2App, whoApp, pendingApp, rejectedApp ] = apps;

const dhis2AppVersions = [
    {
        id: 1,
        uuid: uuid(),
        app_id: dhis2App.id,
        created_by_user_id: dhis2App.created_by_user_id,
        version: '0.1',
    },
    {
        id: 2,
        uuid: uuid(),
        app_id: dhis2App.id,
        created_by_user_id: dhis2App.created_by_user_id,
        version: '0.2-beta',
    },
    {
        id: 3,
        uuid: uuid(),
        app_id: dhis2App.id,
        created_by_user_id: dhis2App.created_by_user_id,
        version: '0.3-dev',
    },
]
const whoAppVersions = [
    {
        id: 4,
        uuid: uuid(),
        app_id: whoApp.id,
        created_by_user_id: whoApp.created_by_user_id,
        version: '1.0',
    },
    {
        id: 5,
        uuid: uuid(),
        app_id: whoApp.id,
        created_by_user_id: whoApp.created_by_user_id,
        version: '1.0.1-beta',
    },
    {
        id: 6,
        uuid: uuid(),
        app_id: whoApp.id,
        created_by_user_id: whoApp.created_by_user_id,
        version: '1.0.2-dev',
    },
]

const pendingAppVersions = [
    {
        id: 7,
        uuid: uuid(),
        app_id: pendingApp.id,
        created_by_user_id: pendingApp.created_by_user_id,
        version: '0.1',
    },
]

const rejectedAppVersions = [
    {
        id: 8,
        uuid: uuid(),
        app_id: rejectedApp.id,
        created_by_user_id: rejectedApp.created_by_user_id,
        version: '0.1',
    },
]

module.exports = [
    dhis2AppVersions,
    whoAppVersions,
    pendingAppVersions,
    rejectedAppVersions
]
