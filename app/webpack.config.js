const webpack = require('webpack');

module.exports = {
    entry: './app/src/app-store.js',
    output: {
        path: '/src/resources/static',
        filename: 'app-store.js',
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader'],
            },
        ],
    },

    devServer: {
        port: 9000,
        inline: true,
        contentBase: './app',
    },

    resolve: {
        extensions: ['.js', '.jsx']
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development'),
            },
        }),
    ]
};