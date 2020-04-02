const AppStatus = {
    PENDING: 'PENDING',
    NOT_APPROVED: 'NOT_APPROVED',
    APPROVED: 'APPROVED',
}

const AppType = {
    APP: 'APP',
    DASHBOARD_WIDGET: 'DASHBOARD_WIDGET',
    TRACKER_DASHBOARD_WIDGET: 'TRACKER_DASHBOARD_WIDGET',
}

const MediaType = {
    Logo: 0,
    Screenshot: 1,
}

module.exports = {
    AppStatus,
    AppStatuses: [
        AppStatus.PENDING,
        AppStatus.NOT_APPROVED,
        AppStatus.APPROVED,
    ],
    AppType,
    AppTypes: [
        AppType.APP,
        AppType.DASHBOARD_WIDGET,
        AppType.TRACKER_DASHBOARD_WIDGET,
    ],
    MediaType,
    MediaTypes: [MediaType.Logo, MediaType.Screenshot],
}
