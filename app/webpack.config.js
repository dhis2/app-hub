module.exports = {
    entry: './app/src/app-store.js',
    output: {
        path: '/src/resources/static',
        filename: 'app-store.js',
    },

    devServer: {
        port: 9000,
        inline: true,
        contentBase: './app',
    },
};