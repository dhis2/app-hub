const webpack = require('webpack');
const path = require('path');
const packageJSON = require('../package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeEnv = process.env.NODE_ENV || 'development';
const isDevBuild = process.argv.indexOf('-p') === -1;

const tomcat = {
    entry: {
        app: './app/src/app-store.js',
    },
    output: {
        path: path.join(__dirname, '..', 'target', 'classes', 'app'),
        filename: path.join('js', '[name].js'),
        //this is where the files are served from
        publicPath: '/appstore',
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

    resolve: {
        extensions: ['.js', '.jsx']
    },
    devtool: 'eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
        }),
        new CopyWebpackPlugin(
            [
                {
                    from: 'app/src/assets', to: 'assets'
                }
            ]),

        new HtmlWebpackPlugin({
            title: 'DHIS2 Appstore',
            filename: 'index.html',
            template: 'app/indexbuild.html',
        }),

    ]
}

const dev = {
    entry: {
        app: './app/src/app-store.js',
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].js',
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
        new CopyWebpackPlugin(
            [
                {
                    from: 'app/src/assets', to: 'assets'
                }
            ])
    ]
}

console.log("Using config: " + (isDevBuild ? 'development' : 'production'));
module.exports = isDevBuild ? dev : tomcat;
