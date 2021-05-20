const merge = require('lodash/merge')
const isDevBuild = process.argv.indexOf('-p') === -1
const relPath = '..'

const defaultConfigs = ['default.config.js', 'config.js']

const envConfigNames = {
    development: ['development.config.js'],
    production: ['production.config.js'],
}

function loadFile(filename) {
    try {
        const path = [relPath, filename].join('/')
        return require(path)
    } catch (e) {
        return null
    }
}

function getConfig() {
    if (getConfig.config) {
        return getConfig.config
    }

    const production = process.env.NODE_ENV || (!isDevBuild && 'production')
    const nodeEnv = production || 'development'
    const config = {}

    //Get default config
    const configs = defaultConfigs
        .map(filename => loadFile(filename))
        .filter(config => !!config)
    configs.forEach(cfg => merge(config, cfg))

    //Get environment specific config
    if (envConfigNames[nodeEnv]) {
        const configs = envConfigNames[nodeEnv]
            .map(filename => loadFile(filename))
            .filter(config => !!config)
        configs.forEach(cfg => merge(config, cfg))
    }

    getConfig.config = config
    return config
}

module.exports = {
    default: getConfig(),
    getConfig,
}
