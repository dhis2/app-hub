const { config } = require('@dhis2/cli-style')

module.exports = {
    extends: [config.eslint],

    //parser: 'esprima',

    parserOptions: {
        ecmaFeatures: {
            globalReturn: true,
            experimentalObjectRestSpread: true,
        },
    },

    env: {
        node: true,
        commonjs: true,
        es6: true,
    },

    rules: {
        semi: 0,
        'brace-style': [2, '1tbs'],
        'comma-dangle': [
            'error',
            {
                arrays: 'only-multiline',
                objects: 'only-multiline',
                imports: 'never',
                exports: 'always',
                functions: 'ignore',
            },
        ],
        'no-console': 0,
        'hapi/hapi-capitalize-modules': 0,
        'hapi/hapi-for-you': 0,
        'hapi/hapi-scope-start': 0,
    },
}
