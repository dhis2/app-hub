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
        id: '792aa26c-5595-4ae5-a2f8-028439060e2e',
        app_id: dhis2App.id,
        created_by_user_id: dhis2App.created_by_user_id,
        version: '0.1',
    },
    {
        id: '966f8602-5a99-4354-9730-9409431d6bda',
        app_id: dhis2App.id,
        created_by_user_id: dhis2App.created_by_user_id,
        version: '0.2-beta',
    },
    {
        id: 'a06b6758-ae2f-4d56-afe9-69582ea8cabb',
        app_id: dhis2App.id,
        created_by_user_id: dhis2App.created_by_user_id,
        version: '0.3-dev',
    },
]
const whoAppVersions = [
    {
        id: 'acc5476e-9daa-4b2c-9f4e-a5832c8ab22d',
        app_id: whoApp.id,
        created_by_user_id: whoApp.created_by_user_id,
        version: '1.0',
        source_url: 'https://github.com/dhis2/who-immunization-analysis-app/',
        demo_url:
            'https://play.dhis2.org/2.30/api/apps/Immunization-analysis/index.html#!/report',
    },
    {
        id: 'ae1d03f7-c027-429e-91a6-e6fd559f1f9d',
        app_id: whoApp.id,
        created_by_user_id: whoApp.created_by_user_id,
        version: '1.0.1-beta',
        source_url: 'https://github.com/dhis2/who-immunization-analysis-app/',
        demo_url:
            'https://play.dhis2.org/2.31.0/api/apps/Immunization-analysis/index.html#!/report',
    },
    {
        id: 'b95bba97-6661-412c-b72e-f8a4caed5407',
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
        id: 'bce0fdc2-278f-4904-b883-006ed43335e6',
        app_id: pendingApp.id,
        created_by_user_id: pendingApp.created_by_user_id,
        version: '0.1',
    },
]

const rejectedAppVersions = [
    {
        id: '220e21b4-6ca7-43ec-aa28-173d420ce813',
        app_id: rejectedApp.id,
        created_by_user_id: rejectedApp.created_by_user_id,
        version: '0.1',
    },
]

const betaOnlyTrackerWidgetVersions = [
    {
        id: 'ff2eeca4-1643-4a4c-8e85-5c56038b1e41',
        app_id: betaOnlyTrackerWidget.id,
        created_by_user_id: betaOnlyTrackerWidget.created_by_user_id,
        version: '1.0-beta',
    },
]

const canaryOnlyDashboardWidgetVersions = [
    {
        id: '0b2e2b86-9ee1-4415-841e-03261fa1cd62',
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
