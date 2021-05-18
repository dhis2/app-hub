const { AppType } = require('../../src/enums')

const users = require('./users')
const organisations = require('./organisations')

const dhis2App = {
    id: '2621d406-a908-476a-bcd2-e55abe3445b4',
    organisation_id: organisations[0].id,
    created_by_user_id: users[0].id,
    type: AppType.APP,
    contact_email: users[1].email,
}
const whoApp = {
    id: '600c70ef-032e-4ea8-bb49-8a3bf7d166eb',
    organisation_id: organisations[1].id,
    created_by_user_id: users[0].id,
    type: AppType.APP,
    contact_email: users[1].email,
}
const rejectedApp = {
    id: '384c41f8-b880-42c8-a360-02fc1d80e320',
    organisation_id: organisations[0].id,
    created_by_user_id: users[0].id,
    type: AppType.APP,
    contact_email: users[1].email,
}
const pendingApp = {
    id: '02cb663c-5112-400b-8a93-0353187d337b',
    organisation_id: organisations[0].id,
    created_by_user_id: users[1].id,
    type: AppType.APP,
    contact_email: users[2].email,
}
const betaOnlyTrackerWidget = {
    id: '6d755422-b4f0-4105-b325-3a908f4d4539',
    organisation_id: organisations[0].id,
    created_by_user_id: users[0].id,
    type: AppType.TRACKER_DASHBOARD_WIDGET,
    contact_email: users[1].email,
}
const canaryOnlyDashboardWidget = {
    id: '7a09ad3c-e501-4adc-bffd-0900f7d5aa78',
    organisation_id: organisations[0].id,
    created_by_user_id: users[0].id,
    type: AppType.DASHBOARD_WIDGET,
    contact_email: users[1].email,
}

module.exports = [
    dhis2App,
    whoApp,
    rejectedApp,
    pendingApp,
    betaOnlyTrackerWidget,
    canaryOnlyDashboardWidget,
]
