/** @type {import('jest').Config} */
const config = {
    verbose: true,
    testEnvironment: 'jest-fixed-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],

    moduleNameMapper: {
        '@dhis2/app-runtime': '<rootDir>/app-runtime-mock.js',
        'react-markdown': '<rootDir>/test/mocks/react-markdown-mock.js',
        '@react-hook': '<rootDir>/app-runtime-mock.js',
        '\\.(jpg|jpeg|png|gif|webp|svg)$': 'identity-obj-proxy',
        '\\.(css|scss)$': 'identity-obj-proxy',
        '^src(.*)$': '<rootDir>/src$1',
        '^config(.*)$': '<rootDir>/config$1',
        '^mocks(.*)$': '<rootDir>/test/mocks$1',
    },
}

module.exports = config
