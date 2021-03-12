module.exports = function(api) {
    api.cache(true)

    return {
        presets: [
            [
                '@babel/preset-env',
                {
                    useBuiltIns: 'entry',
                    corejs: '3',
                    targets: {
                        node: 'current',
                    },
                },
            ],
            '@babel/preset-react',
        ],
        plugins: [
            [
                'transform-imports',
                {
                    lodash: {
                        transform: 'lodash/${member}',
                        preventFullImport: true,
                    },
                },
            ],
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-optional-chaining',
        ],
        env: {
            test: {
                plugins: ['babel-plugin-rewire'],
            },
        },
    }
}
