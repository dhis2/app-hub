const request = require('request-promise-native')
const fs = require('fs')
const path = require('path')
const url = require('url')

module.exports = async ({ targetUrl, authToken, dir, app, appId }) => {
    for (let i = 0; i < app.images.length; ++i) {
        const appImage = app.images[i]
        const parsedUrl = url.parse(appImage.imageUrl)
        const lastIndex = parsedUrl.pathname.lastIndexOf('.')
        const fileExtension = parsedUrl.path.substring(lastIndex)
        const fileName = appImage.id + fileExtension

        const imageFilePath = path.join(dir, fileName)
        console.log(`Uploading image: ${imageFilePath}`)

        const form = {
            file: {
                value: fs.createReadStream(imageFilePath),
                options: {
                    filename: fileName,
                    contentType:
                        fileExtension === 'png' ? 'image/png' : 'image/jpg', //assume jpg if not png
                },
            },
        }
        const image = await request.post({
            url: `${targetUrl}/apps/${appId}/images`,
            json: true,
            headers: {
                Authorization: 'Bearer ' + authToken,
            },
            formData: form,
        })

        await request.put({
            url: `${targetUrl}/apps/${appId}/images/${image.id}`,
            headers: {
                Authorization: 'Bearer ' + authToken,
            },
            body: JSON.stringify({
                logo: appImage.logo,
                caption: appImage.caption || '',
                description: appImage.description || '',
            }),
        })
    }
}
