module.exports = {
    require: ['@babel/register', 'mock-local-storage', 'test/setup.js'],
    recursive: true,
    spec: 'test/**/*.spec.js',
}
