const { version } = require('../../../package.json')

module.exports = [
    {
        method: 'GET',
        path: '/v2/version',
        handler: () => ({ version }),
    },
]
