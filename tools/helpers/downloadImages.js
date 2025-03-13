const fs = require('fs')
const path = require('path')
const url = require('url')
const request = require('request-promise-native')

module.exports = async (dir, app) => {
    const imagesDownloadPromises = app.images.map((appImage) => {
        const parsedUrl = url.parse(appImage.imageUrl)
        const lastIndex = parsedUrl.pathname.lastIndexOf('.')
        const fileExtension = parsedUrl.path.substring(lastIndex)
        const fileName = appImage.id + fileExtension

        return new Promise((resolve, reject) => {
            const target = path.join(dir, fileName)
            const imageFile = fs.createWriteStream(target)
            request(appImage.imageUrl)
                .pipe(imageFile)
                .on('finish', () => {
                    console.log(
                        `Successfully downloaded image: ${appImage.imageUrl} => ${target}`
                    )
                    resolve()
                })
                .on('error', (error) => {
                    reject(error)
                })
        })
    })
    await Promise.all(imagesDownloadPromises)
}
