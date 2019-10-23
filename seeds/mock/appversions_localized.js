const appVersions = require('./appversions')

const [
    dhis2AppVersions,
    whoAppVersions,
    pendingAppVersions,
    rejectedAppVersions,
    betaOnlyTrackerWidgetVersions,
    canaryOnlyDashboardWidgetVersions,
] = appVersions
const slugify = require('slugify')

const mockAppVersion = (sourceArr, index, languageCode, name, desc) => {
    //eslint-disable-line max-params
    return {
        app_version_id: sourceArr[index].id,
        language_code: languageCode,
        created_by_user_id: sourceArr[index].created_by_user_id,
        name,
        description: desc,
        slug: slugify(name, { lower: true }),
    }
}

const dhis2AppVersionsLocalized = [
    mockAppVersion(
        dhis2AppVersions,
        0,
        'en',
        'A nice app',
        'This is a really nice app!'
    ),
    mockAppVersion(
        dhis2AppVersions,
        0,
        'sv',
        'En fin app',
        'Detta är en mycket fin applikation.'
    ),

    mockAppVersion(
        dhis2AppVersions,
        1,
        'en',
        'A nice app',
        'This is a really nice app another version!'
    ),
    mockAppVersion(
        dhis2AppVersions,
        1,
        'sv',
        'En fin WHO app',
        'Detta är en mycket fin applikation, ny version.'
    ),

    mockAppVersion(
        dhis2AppVersions,
        2,
        'en',
        'A nice app',
        'This is a really nice app, though the unstable canary version!'
    ),
    mockAppVersion(
        dhis2AppVersions,
        2,
        'sv',
        'En fin WHO app',
        'Detta är en mycket fin applikation, ostabil utvecklings-version.'
    ),
]

const whoAppVersionsLocalized = [
    mockAppVersion(
        whoAppVersions,
        0,
        'en',
        'A nice app by WHO',
        'This is a really nice app from WHO!'
    ),
    mockAppVersion(
        whoAppVersions,
        0,
        'sv',
        'En fin WHO app',
        'Detta är en mycket fin applikation från WHO.'
    ),

    mockAppVersion(
        whoAppVersions,
        1,
        'en',
        'This is a really nice app from WHO! Beta-version'
    ),
    mockAppVersion(
        whoAppVersions,
        1,
        'sv',
        'En fin WHO app',
        'Detta är en mycket fin applikation från WHO. Beta-version'
    ),

    mockAppVersion(
        whoAppVersions,
        2,
        'en',
        'A nice app by WHO',
        'This is a really nice app from WHO! Unstable canary version'
    ),
    mockAppVersion(
        whoAppVersions,
        2,
        'sv',
        'En fin WHO app',
        'Detta är en mycket fin applikation från WHO. Ostabil version i canary'
    ),
]

const pendingAppVersionsLocalized = [
    {
        app_version_id: pendingAppVersions[0].id,
        language_code: 'en',
        created_by_user_id: pendingAppVersions[0].created_by_user_id,
        name: 'Pending App app',
        description: 'This app is pending approval.',
        slug: slugify('Pending App app', { lower: true }),
    },
]

const rejectedAppVersionsLocalized = [
    {
        app_version_id: rejectedAppVersions[0].id,
        language_code: 'en',
        created_by_user_id: rejectedAppVersions[0].created_by_user_id,
        name: 'Rejected App app',
        description: 'This app is in state rejected.',
        slug: slugify('Rejected App app', { lower: true }),
    },
]

const betaOnlyTrackerWidgetLocalized = [
    {
        app_version_id: betaOnlyTrackerWidgetVersions[0].id,
        language_code: 'en',
        created_by_user_id: betaOnlyTrackerWidgetVersions[0].created_by_user_id,
        name: 'Development only app',
        description: 'This app only got a version in the development channel',
        slug: slugify('Development only app', { lower: true }),
    },
]

const canaryOnlyDashboardWidgetLocalized = [
    {
        app_version_id: canaryOnlyDashboardWidgetVersions[0].id,
        language_code: 'en',
        created_by_user_id:
            canaryOnlyDashboardWidgetVersions[0].created_by_user_id,
        name: 'Canary only app',
        description: 'This app only got a version in canary channel',
        slug: slugify('Canary only app', { lower: true }),
    },
]

module.exports = [
    dhis2AppVersionsLocalized,
    whoAppVersionsLocalized,
    pendingAppVersionsLocalized,
    rejectedAppVersionsLocalized,
    betaOnlyTrackerWidgetLocalized,
    canaryOnlyDashboardWidgetLocalized,
]
