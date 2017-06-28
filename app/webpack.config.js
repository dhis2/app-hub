const webpack = require('webpack');
const path = require('path');
const packageJSON = require('../package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeEnv = process.env.NODE_ENV || 'development';

const appstoreEnv = process.env.DHIS2_APPSTORE_ENV;
const isDevBuild = process.argv.indexOf('-p') === -1;
const config = require('./config');

const tomcat = {
    entry: {
        app: ['whatwg-fetch','./app/src/app-store.js'],
    },
    output: {
        path: path.join(__dirname,'..','target', 'classes', 'static'),
        filename: path.join('js', `[name]_${packageJSON.version}.js`),
        //this is where the files are served from
        publicPath: config.BASE_APP_NAME + '/',
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
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [`file-loader?name=[name]_${packageJSON.version}.[ext]&publicPath=${config.BASE_APP_NAME}/&outputPath=assets/`]
            }
        ],
    },

    resolve: {
        extensions: ['.js', '.jsx']
    },
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

        new webpack.optimize.UglifyJsPlugin({minimize: true, comments: false}),
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
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: ["file-loader?name=[name].[ext]&publicPath=/&outputPath=assets/"]
            }
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
        new webpack.EnvironmentPlugin({
            'DHIS2_APPSTORE_BASE_APP_NAME': null,
            'DHIS2_APPSTORE_API_BASE_URL': null,
            'DHIS2_APPSTORE_API_REDIRECT_URL': null
            }),
        new CopyWebpackPlugin(
            [
                {
                    from: 'app/src/assets', to: 'assets'
                }
            ])
    ]
}

const tomcatDev = Object.assign({},tomcat, {
    plugins: [
        ...tomcat.plugins,
        ...dev.plugins,
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development'),
            },
        })],
})


console.log("Using config: " + (isDevBuild ? (appstoreEnv === 'tomcatDev' ?
            'tomcatDevelopment' : 'development') : 'production'));

const devProfile = appstoreEnv === 'tomcatDev' ? tomcatDev : dev;

module.exports = isDevBuild ? devProfile : tomcat;
