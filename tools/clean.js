const request = require('request-promise-native')

async function main() {
    const targetUrl = 'http://localhost:3000/api'

    const publishedAppsResponse = await request(targetUrl + '/apps')
    const appsJson = JSON.parse(publishedAppsResponse)

    const deleteRequestPromises = appsJson.map(app =>
        request.delete(`${targetUrl}/apps/${app.id}`)
    )

    await Promise.all(deleteRequestPromises)
    process.exit(0)
}

main()
