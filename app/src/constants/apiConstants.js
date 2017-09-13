export const appTypesToUI = {
    APP_STANDARD: "Standard",
    APP_DASHBOARD: "Dashboard",
    APP_TRACKER_DASHBOARD: "Tracker Dashboard"
};

export const APP_STATUS_REJECTED = "NOT_APPROVED";
export const APP_STATUS_PENDING = "PENDING";
export const APP_STATUS_APPROVED = "APPROVED";

export const appStatusToUI = {
    NOT_APPROVED: "Rejected",
    PENDING: "Pending",
    APPROVED: "Approved"
};

export const appSchema = {
    appName: "",
    description: "",
    developer: {
        developerName: "",
        developerEmail: ""
    },
    versions: [
        {
            version: "",
            minDhisVersion: "",
            maxDhisVersion: ""
        }
    ]
};

export const DHISVersions = ["2.26", "2.25", "2.24", "2.23", "2.22", "2.21"];
