const webpack = require('webpack')
const path = require('path')
const packageJSON = require('./package.json')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const nodeEnv = process.env.NODE_ENV || 'development'

const isDevBuild = process.argv.indexOf('-p') === -1
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'
const config = require('./config/configResolver.js').default

const appEntry = path.join(__dirname, 'client/src/app-store.js')

const prod = {
    entry: {
        app: ['whatwg-fetch', appEntry],
    },
    output: {
        path: path.join(__dirname, 'static'),
        filename: path.join('js', `[name]_${packageJSON.version}.js`),
        //this is where the files are served from
        publicPath: '/',
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
                            publicPath: `${config.routes.baseAppName}/`,
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
                NODE_ENV: JSON.stringify('production'),
            },
            __APP_CONFIG__: JSON.stringify(config),
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, 'client/src/assets'),
                to: 'assets',
            },
        ]),

        new HtmlWebpackPlugin({
            title: 'DHIS2 Appstore',
            filename: 'index.html',
            template: path.join(__dirname, 'indexbuild.html'),
        }),
    ],
}

const dev = Object.assign({}, prod, {
    entry: {
        app: ['babel-polyfill', 'whatwg-fetch', appEntry],
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].js',
        publicPath: '/',
    },

    devServer: {
        port: 9000,
        inline: true,
        contentBase: './app',
        historyApiFallback: true,
    },
    devtool: 'eval',
    plugins: [
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, 'src/assets'),
                to: 'assets',
            },
        ]),
        new HtmlWebpackPlugin({
            title: 'DHIS2 Appstore',
            filename: 'index.html',
            template: 'indexbuild.html',
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development'),
            },
            __APP_CONFIG__: JSON.stringify(config),
        }),
    ],
})

module.exports = process.env.NODE_ENV === 'development' ? dev : prod
