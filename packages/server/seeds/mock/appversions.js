const { dhis2App, whoApp } = require('./apps')

const dhis2AppVersions = [
    {
        id: 1,
        app_id: dhis2App.id,
        created_by_user_id: dhis2App.created_by_user_id,
        version: '0.1',
    },
    {
        id: 2,
        app_id: dhis2App.id,
        created_by_user_id: dhis2App.created_by_user_id,
        version: '0.2-beta',
    },
    {
        id: 3,
        app_id: dhis2App.id,
        created_by_user_id: dhis2App.created_by_user_id,
        version: '0.3-dev',
    },
]
const whoAppVersions = [
    {
        id: 4,
        app_id: whoApp.id,
        created_by_user_id: whoApp.created_by_user_id,
        version: '1.0',
    },
    {
        id: 5,
        app_id: whoApp.id,
        created_by_user_id: whoApp.created_by_user_id,
        version: '1.0.1-beta',
    },
    {
        id: 6,
        app_id: whoApp.id,
        created_by_user_id: whoApp.created_by_user_id,
        version: '1.0.2-dev',
    },
]

module.exports = {
    dhis2AppVersions,
    whoAppVersions,
}
