module.exports = function (api) {
    api.cache(true)

    return {
        presets: [
            ['@babel/preset-env', {
                useBuiltIns: 'entry',
            }],
            '@babel/preset-react',
        ],
        plugins: [
            ['transform-imports', {
                lodash: {
                    transform: 'lodash/${member}',
                    preventFullImport: true
                }
            }]
        ]
    }
}
