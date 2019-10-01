const webpack = require('webpack')
const path = require('path')
const packageJSON = require('./package.json')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const nodeEnv = process.env.NODE_ENV || 'development'

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'
const config = require('./config/configResolver.js').default

const appEntry = path.join(__dirname, 'client/src/app-store.js')

const webpackConfig = {
    entry: {
        app: ['whatwg-fetch', appEntry],
    },
    mode: nodeEnv,
    output: {
        path: path.join(__dirname, 'static'),
        filename: path.join('js', `[name]_${packageJSON.version}.js`),
        //this is where the files are served from
        publicPath: `${config.routes.baseAppName}/`,
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'sass-loader' },
                ],
            },
            {
                test: /\.css$/,
                use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: `[name]_${packageJSON.version}.[ext]`,
                            publicPath: `${config.routes.baseAppName}`,
                            outputPath: 'assets/',
                        },
                    },
                ],
            },
        ],
    },
    devtool: shouldUseSourceMap ? 'source-map' : false,
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(nodeEnv),
            },
            __APP_CONFIG__: JSON.stringify(config),
        }),
        new HtmlWebpackPlugin({
            title: 'DHIS2 Appstore',
            filename: 'index.html',
            template: path.join(__dirname, 'indexbuild.html'),
        }),
    ],
}

module.exports = webpackConfig
