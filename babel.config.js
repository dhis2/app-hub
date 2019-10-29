module.exports = function(api) {
    api.cache(true)

    return {
        presets: [
            [
                '@babel/preset-env',
                {
                    useBuiltIns: 'entry',
                    corejs: '3',
                },
            ],
            '@babel/preset-react',
        ],
        plugins: [
            'babel-plugin-rewire',
            [
                'transform-imports',
                {
                    lodash: {
                        transform: 'lodash/${member}',
                        preventFullImport: true,
                    },
                },
            ],
        ],
    }
}
