const Path = require('path')
const AdmZip = require('adm-zip')
const FormData = require('form-data')

const generateManifest = ({ id, name, description, version }) => `{
    "app_hub_id": "${id}",
    "appType": "APP",
    "short_name": "${name.replace(/ /g, '-')}",
    "name": "${name}",
    "description": "${description}",
    "version": "${version}",
    "launch_path": "index.html",
    "default_locale": "en",
    "activities": {
      "dhis": {
        "href": "*"
      }
    },
    "icons": {
      "48": "dhis2-app-icon.png"
    },
    "developer": {
      "name": "Birk Johansson",
      "url": "https://www.dhis2.org"
    },
    "manifest_generated_at": "${new Date().toISOString()}",
    "display": "standalone",
    "theme_color": "#ffffff",
    "background_color": "#ffffff",
    "scope": "."
  }
  `

const zip = (name, files, path) => {
    const zip = new AdmZip()

    files = Array.isArray(files) ? files : [files]

    files.forEach(({ name, data }) => zip.addFile(name, data))

    return new Promise((resolve, reject) => {
        if (path === null) {
            resolve(zip)
            return
        }
        const p = Path.join(path, `${name}.zip`)
        console.log('Zipping file...')
        zip.writeZip(p, (e) => {
            e && reject(e)
            console.log('Zipped to', p)
            resolve(zip)
        })
    })
}

const createAppVersion = async (
    { id, name, description },
    {
        version,
        minDhisVersion = '2.34',
        maxDhisVersion = '2.37',
        channel = 'stable',
    },
    path
) => {
    const versionObj = {
        version: version,
        minDhisVersion,
        maxDhisVersion,
        demoUrl: version.demoUrl || '',
        channel,
    }

    const manifest = generateManifest({ id, name, description, version })

    const files = [
        { name: 'manifest.webapp', data: Buffer.from(manifest, 'utf-8') },
    ]

    const zipFile = await zip(
        name.substring(0, 10).replace(/ /g, '_'),
        files,
        path
    )

    return {
        version: versionObj,
        file: zipFile,
        manifest: manifest,
    }
}

const createAppVersionForm = async (app, appVersion) => {
    const { version, file } = await createAppVersion(app, appVersion, null)

    const form = new FormData()
    const fileBuffer = file.toBuffer()
    form.append('version', JSON.stringify(version), {
        contentType: 'application/json',
    })
    form.append('file', fileBuffer, {
        filename: `App_${version.version}.zip`,
        contentType: 'application/zip',
    })

    return form
}

module.exports = {
    generateManifest,
    createAppVersion,
    createAppVersionForm,
}
