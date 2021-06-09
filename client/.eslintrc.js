const { config } = require('@dhis2/cli-style')

module.exports = {
    extends: [config.eslintReact],
    rules: {
        'react/prop-types': [1],
        'no-unused-vars': ['error', { ignoreRestSiblings: true }],
        'react/no-unescaped-entities': 'off',
        'react/react-in-jsx-scope': 'off',
    },
    globals: {
        __APP_INFO__: 'readonly',
        __APP_CONFIG__: 'readonly',
        Cypress: 'readonly',
        cy: 'readonly',
    },
    settings: {
        'import/resolver': 'webpack',
    },
}
