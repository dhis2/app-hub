const uuid = require('uuid/v4')
const { AppType } = require('../../src/enums')

const dhis2App = {
    id: 1,
    uuid: uuid(),
    organisation_id: 1,
    created_by_user_id: 2,
    type: AppType.APP,
}
const whoApp = {
    id: 2,
    uuid: uuid(),
    organisation_id: 2,
    created_by_user_id: 1,
    type: AppType.APP,
}
const rejectedApp = {
    id: 3,
    uuid: uuid(),
    organisation_id: 1,
    created_by_user_id: 1,
    type: AppType.APP,
}
const pendingApp = {
    id: 4,
    uuid: uuid(),
    organisation_id: 1,
    created_by_user_id: 2,
    type: AppType.APP,
}

module.exports = [
    dhis2App,
    whoApp,
    rejectedApp,
    pendingApp
]
