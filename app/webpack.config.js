module.exports = {
    entry: './app/src/app-store.js',
    output: {
        path: '/src/resources/static',
        filename: 'app-store.js',
    },

    module: {
        loaders: [
            {
                test: /.jsx?/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
        ],
    },

    devServer: {
        port: 9000,
        inline: true,
        contentBase: './app',
    },
};