const { config } = require('@dhis2/cli-style')

module.exports = {
    extends: [config.eslintReact],
    rules: {
        "react/prop-types": [1],
        "no-unused-vars": ['error', { ignoreRestSiblings: true }],
        "react/no-unescaped-entities": "off"
    },
    globals: {
        __APP_INFO__: "readonly"
    }
}
