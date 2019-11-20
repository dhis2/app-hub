const uuid = require('uuid/v4')
const { AppType } = require('../../src/enums')

const dhis2App = {
    id: 1,
    uuid: '2621d406-a908-476a-bcd2-e55abe3445b4',
    organisation_id: 1,
    created_by_user_id: 1,
    type: AppType.APP,
    developer_user_id: 2,
}
const whoApp = {
    id: 2,
    uuid: '600c70ef-032e-4ea8-bb49-8a3bf7d166eb',
    organisation_id: 2,
    created_by_user_id: 1,
    type: AppType.APP,
    developer_user_id: 2,
}
const rejectedApp = {
    id: 3,
    uuid: '384c41f8-b880-42c8-a360-02fc1d80e320',
    organisation_id: 1,
    created_by_user_id: 1,
    type: AppType.APP,
    developer_user_id: 2,
}
const pendingApp = {
    id: 4,
    uuid: '02cb663c-5112-400b-8a93-0353187d337b',
    organisation_id: 1,
    created_by_user_id: 2,
    type: AppType.APP,
    developer_user_id: 3,
}
const betaOnlyTrackerWidget = {
    id: 5,
    uuid: '6d755422-b4f0-4105-b325-3a908f4d4539',
    organisation_id: 1,
    created_by_user_id: 1,
    type: AppType.TRACKER_DASHBOARD_WIDGET,
    developer_user_id: 2,
}
const canaryOnlyDashboardWidget = {
    id: 6,
    uuid: '7a09ad3c-e501-4adc-bffd-0900f7d5aa78',
    organisation_id: 1,
    created_by_user_id: 1,
    type: AppType.DASHBOARD_WIDGET,
    developer_user_id: 2,
}

module.exports = [
    dhis2App,
    whoApp,
    rejectedApp,
    pendingApp,
    betaOnlyTrackerWidget,
    canaryOnlyDashboardWidget,
]
