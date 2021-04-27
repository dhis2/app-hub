import config from 'config'

const { dhisVersions } = config.ui

export const maxDhisVersionValidator = (value, allValues) => {
    if (
        value &&
        dhisVersions.indexOf(value) >
            dhisVersions.indexOf(allValues['minDhisVersion'])
    ) {
        return 'Maximum DHIS2 version must be greater than minimum DHIS2 version'
    }
}
