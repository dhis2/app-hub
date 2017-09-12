package org.hisp.appstore.api.domain;

/**
 * Created by zubair on 06.12.16.
 */
public enum AppType
{
    /**
     * Normal app (to be displayed in menus, and rendered through /api/apps/{app-name})
     */
    APP,

    /**
     * Dashboard widget, can be placed on the main system dashboard as 'widgets' (portlets).
     */
    DASHBOARD_WIDGET,

    /**
     * Tracker dashboard widget, used for tracker capture dashboard.
     */
    TRACKER_DASHBOARD_WIDGET
}
