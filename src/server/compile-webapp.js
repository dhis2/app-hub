const debug = require('debug')('appstore:server:boot:webapp')

const webpack = require('webpack')
const webpackConfig = require('../../webpack.config.js')

exports.compile = () =>
    new Promise((resolve, reject) => {
        if (process.env.USE_PREBUILT_APP) {
            debug('Using prebuilt web app')
            return resolve(null)
        }

        debug('Compiling web application...')
        webpack(webpackConfig, (err, stats) => {
            if (err) {
                debug(err.stack || err)
                if (err.details) {
                    debug(err.details)
                }
                return reject(err)
            }

            const info = stats.toJson()

            if (stats.hasErrors()) {
                debug(info.errors)
                return reject(err)
            }

            if (stats.hasWarnings()) {
                debug(info.warnings)
            }

            return resolve(stats)
        })
    })
