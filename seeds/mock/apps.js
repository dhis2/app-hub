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
    uuid: uuid(),
    organisation_id: 2,
    created_by_user_id: 1,
    type: AppType.APP,
    developer_user_id: 2,
}
const rejectedApp = {
    id: 3,
    uuid: uuid(),
    organisation_id: 1,
    created_by_user_id: 1,
    type: AppType.APP,
    developer_user_id: 2,
}
const pendingApp = {
    id: 4,
    uuid: uuid(),
    organisation_id: 1,
    created_by_user_id: 2,
    type: AppType.APP,
    developer_user_id: 3,
}
const betaOnlyTrackerWidget = {
    id: 5,
    uuid: uuid(),
    organisation_id: 1,
    created_by_user_id: 1,
    type: AppType.TRACKER_DASHBOARD_WIDGET,
    developer_user_id: 2,
}
const canaryOnlyDashboardWidget = {
    id: 6,
    uuid: uuid(),
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
