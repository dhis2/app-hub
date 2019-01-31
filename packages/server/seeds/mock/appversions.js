const { dhis2App, whoApp } = require('./apps')
const uuid = require('uuid/v4')

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

module.exports = {
    dhis2AppVersions,
    whoAppVersions,
}
