const AdmZip = require('adm-zip')

const isValidJSON = json => {
    try {
        JSON.parse(json)
        return true
    } catch (error) {
        return false
    }
}

const checkManifest = ({
    manifest,
    appId,
    version,
    organisationName,
    canBeCoreApp
}) => {
    if (manifest.app_hub_id && manifest.app_hub_id !== appId) {
        throw new Error('Manifest App Hub ID does not match app ID')
    }
    if (manifest.version !== version) {
        throw new Error('Manifest version does not match app version')
    }
    const manifestDeveloper = manifest.developer?.name
    if (manifestDeveloper && manifestDeveloper !== organisationName) {
        throw new Error('Manifest developer does not match app organisation')
    }
    if (!canBeCoreApp && manifest.core_app) {
        throw new Error('Manifest incorrectly declares app as core app')
    }
}

const checkD2Config = ({
    d2Config,
    appId,
    version,
    organisationName,
    canBeCoreApp
}) => {
    if (d2Config.id && d2Config.id !== appId) {
        throw new Error('D2 config App Hub ID does not match app ID')
    }
    if (d2Config.version !== version) {
        throw new Error('D2 config version does not match app version')
    }
    const d2ConfigDeveloper = d2Config.author?.name
    if (d2ConfigDeveloper && d2ConfigDeveloper !== organisationName) {
        throw new Error('D2 config developer does not match app organisation')
    }
    if (!canBeCoreApp && d2Config.coreApp) {
        throw new Error('D2 config incorrectly declares app as core app')
    }
}

module.exports = ({
    buffer,
    appId,
    version,
    organisationName,
    canBeCoreApp
}) => {
    const zip = new AdmZip(buffer)
    const entries = zip.getEntries().map(e => e.entryName)
    const manifestPath = 'manifest.webapp'
    const d2ConfigPath = 'd2.config.json'

    if (!entries.includes(manifestPath)) {
        throw new Error('Manifest missing from bundle')
    }
    const manifestJson = zip.readAsText(manifestPath)
    if (!isValidJSON(manifestJson)) {
        throw new Error(`${manifestPath} is not valid JSON`)
    }
    const manifest = JSON.parse(manifestJson)
    checkManifest({
        manifest,
        appId,
        version,
        organisationName,
        canBeCoreApp
    })

    // D2 config is optional
    if (!entries.includes(d2ConfigPath)) {
        return
    }
    const d2ConfigJson = zip.readAsText(d2ConfigPath)
    if (!isValidJSON(d2ConfigJson)) {
        throw new Error(`${d2ConfigPath} is not valid JSON`)
    }
    const d2Config = JSON.parse(d2ConfigJson)
    checkD2Config({
        d2Config,
        appId,
        version,
        organisationName,
        canBeCoreApp
    })
}
