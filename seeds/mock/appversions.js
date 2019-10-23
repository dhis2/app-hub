const apps = require('./apps')
const uuid = require('uuid/v4')

const [
    dhis2App,
    whoApp,
    pendingApp,
    rejectedApp,
    betaOnlyTrackerWidget,
    canaryOnlyDashboardWidget,
] = apps

const dhis2AppVersions = [
    {
        id: 1,
        uuid: '792aa26c-5595-4ae5-a2f8-028439060e2e',
        app_id: dhis2App.id,
        created_by_user_id: dhis2App.created_by_user_id,
        version: '0.1',
    },
    {
        id: 2,
        uuid: '966f8602-5a99-4354-9730-9409431d6bda',
        app_id: dhis2App.id,
        created_by_user_id: dhis2App.created_by_user_id,
        version: '0.2-beta',
    },
    {
        id: 3,
        uuid: 'a06b6758-ae2f-4d56-afe9-69582ea8cabb',
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
        source_url: 'https://github.com/dhis2/who-immunization-analysis-app/',
        demo_url:
            'https://play.dhis2.org/2.30/api/apps/Immunization-analysis/index.html#!/report',
    },
    {
        id: 5,
        uuid: uuid(),
        app_id: whoApp.id,
        created_by_user_id: whoApp.created_by_user_id,
        version: '1.0.1-beta',
        source_url: 'https://github.com/dhis2/who-immunization-analysis-app/',
        demo_url:
            'https://play.dhis2.org/2.31.0/api/apps/Immunization-analysis/index.html#!/report',
    },
    {
        id: 6,
        uuid: uuid(),
        app_id: whoApp.id,
        created_by_user_id: whoApp.created_by_user_id,
        version: '1.0.2-dev',
        source_url: 'https://github.com/dhis2/who-immunization-analysis-app/',
        demo_url:
            'https://play.dhis2.org/2.31dev/api/apps/Immunization-analysis/index.html#!/report',
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

const betaOnlyTrackerWidgetVersions = [
    {
        id: 9,
        uuid: uuid(),
        app_id: betaOnlyTrackerWidget.id,
        created_by_user_id: betaOnlyTrackerWidget.created_by_user_id,
        version: '1.0-beta',
    },
]

const canaryOnlyDashboardWidgetVersions = [
    {
        id: 10,
        uuid: uuid(),
        app_id: canaryOnlyDashboardWidget.id,
        created_by_user_id: canaryOnlyDashboardWidget.created_by_user_id,
        version: '0.1-dev',
    },
]

module.exports = [
    dhis2AppVersions,
    whoAppVersions,
    pendingAppVersions,
    rejectedAppVersions,
    betaOnlyTrackerWidgetVersions,
    canaryOnlyDashboardWidgetVersions,
]
