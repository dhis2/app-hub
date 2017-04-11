const webpack = require('webpack');
const path = require('path');
const packageJSON = require('../package.json');

module.exports = {
    entry: './app/src/app-store.js',
    output: {
        path: path.join(__dirname,'..','target', 'classes', 'META-INF', 'resources', 'webjars', packageJSON.name, packageJSON.version),
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
        historyApiFallback: true,
    },

    resolve: {
        extensions: ['.js', '.jsx']
    },
    devtool: 'eval-source-map',

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development'),
            },
        }),
    ]
};