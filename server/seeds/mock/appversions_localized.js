const appVersions = require('./appversions')

const [
    dhis2AppVersions,
    whoAppVersions,
    pendingAppVersions,
    rejectedAppVersions,
    betaOnlyTrackerWidgetVersions,
    canaryOnlyDashboardWidgetVersions,
] = appVersions
const { slugify } = require('../../src/utils/slugify')

const versionuuids = []

const mockAppVersion = (id, sourceArr, index, languageCode, name, desc) => {
    //eslint-disable-line max-params
    return {
        id,
        app_version_id: sourceArr[index].id,
        language_code: languageCode,
        created_by_user_id: sourceArr[index].created_by_user_id,
        name,
        description: desc,
        slug: slugify(name),
    }
}

const dhis2AppVersionsLocalized = [
    mockAppVersion(
        '55c6654d-deff-4f5a-9bd1-10408b69e319',
        dhis2AppVersions,
        0,
        'en',
        'A nice app',
        'This is a really nice app!'
    ),
    mockAppVersion(
        'd0164452-4880-43bd-b5b2-abc1565dfab6',
        dhis2AppVersions,
        0,
        'sv',
        'En fin app',
        'Detta är en mycket fin applikation.'
    ),

    mockAppVersion(
        'b7382c81-1e85-41ac-9f05-2166777ccaa8',
        dhis2AppVersions,
        1,
        'en',
        'A nice app',
        'This is a really nice app another version!'
    ),
    mockAppVersion(
        'a74793cd-c2b9-4737-bfce-990b4e40e95e',
        dhis2AppVersions,
        1,
        'sv',
        'En fin WHO app',
        'Detta är en mycket fin applikation, ny version.'
    ),

    mockAppVersion(
        'e4638ede-3a4f-427f-bca6-d4bc2c95b7d6',
        dhis2AppVersions,
        2,
        'en',
        'A nice app',
        'This is a really nice app, though the unstable canary version!'
    ),
    mockAppVersion(
        '84edfab4-1e78-4389-9dbd-e879ec3b9303',
        dhis2AppVersions,
        2,
        'sv',
        'En fin WHO app',
        'Detta är en mycket fin applikation, ostabil utvecklings-version.'
    ),
]

const whoAppVersionsLocalized = [
    mockAppVersion(
        '568dfb5e-518a-459a-91c5-f24eb140593f',
        whoAppVersions,
        0,
        'en',
        'A nice app by WHO',
        'This is a really nice app from WHO!'
    ),
    mockAppVersion(
        '6aed7ac5-888c-4ccf-8b6a-538a4ed47dc2',
        whoAppVersions,
        0,
        'sv',
        'En fin WHO app',
        'Detta är en mycket fin applikation från WHO.'
    ),

    mockAppVersion(
        'dcd395b3-356c-4670-8725-67b8d9c9b881',
        whoAppVersions,
        1,
        'en',
        'This is a really nice app from WHO! Beta-version'
    ),
    mockAppVersion(
        'b567df1d-f2ac-44bb-935b-a9db84d31524',
        whoAppVersions,
        1,
        'sv',
        'En fin WHO app',
        'Detta är en mycket fin applikation från WHO. Beta-version'
    ),

    mockAppVersion(
        '36c1d68d-9639-46f2-9fa0-7a902b4f59f4',
        whoAppVersions,
        2,
        'en',
        'A nice app by WHO',
        'This is a really nice app from WHO! Unstable canary version'
    ),
    mockAppVersion(
        '66f618e9-bd7a-46bd-8f0e-03fe5ecaf858',
        whoAppVersions,
        2,
        'sv',
        'En fin WHO app',
        'Detta är en mycket fin applikation från WHO. Ostabil version i canary'
    ),
]

const pendingAppVersionsLocalized = [
    {
        id: 'f85e9cd1-6f00-47a3-82c6-23a5ec4a4fd2',
        app_version_id: pendingAppVersions[0].id,
        language_code: 'en',
        created_by_user_id: pendingAppVersions[0].created_by_user_id,
        name: 'Pending App app',
        description: 'This app is pending approval.',
        slug: slugify('Pending App app'),
    },
]

const rejectedAppVersionsLocalized = [
    {
        id: 'b785dfa4-f528-4773-a7b9-f7bccc441b82',
        app_version_id: rejectedAppVersions[0].id,
        language_code: 'en',
        created_by_user_id: rejectedAppVersions[0].created_by_user_id,
        name: 'Rejected App app',
        description: 'This app is in state rejected.',
        slug: slugify('Rejected App app'),
    },
]

const betaOnlyTrackerWidgetLocalized = [
    {
        id: 'dc89c94a-319e-4821-80eb-b5035a5496ad',
        app_version_id: betaOnlyTrackerWidgetVersions[0].id,
        language_code: 'en',
        created_by_user_id: betaOnlyTrackerWidgetVersions[0].created_by_user_id,
        name: 'Development only app',
        description: 'This app only got a version in the development channel',
        slug: slugify('Development only app'),
    },
]

const canaryOnlyDashboardWidgetLocalized = [
    {
        id: '81bef779-6022-4f23-a3cc-1d7186c05990',
        app_version_id: canaryOnlyDashboardWidgetVersions[0].id,
        language_code: 'en',
        created_by_user_id:
            canaryOnlyDashboardWidgetVersions[0].created_by_user_id,
        name: 'Canary only app',
        description: 'This app only got a version in canary channel',
        slug: slugify('Canary only app'),
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
