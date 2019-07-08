const webpack = require('webpack')
const webpackConfig = require('../../webpack.config.js')

exports.compile = () =>
    new Promise((resolve, reject) => {
        if (process.env.USE_PREBUILT_APP) {
            console.info('Using prebuilt web app')
            return resolve(null)
        }

        console.info('Compiling web application...')
        webpack(webpackConfig, (err, stats) => {
            if (err) {
                console.error(err.stack || err)
                if (err.details) {
                    console.error(err.details)
                }
                return reject(err)
            }

            const info = stats.toJson()

            if (stats.hasErrors()) {
                console.error(info.errors)
                return reject(err)
            }

            if (stats.hasWarnings()) {
                console.warn(info.warnings)
            }

            return resolve(stats)
        })
    })
