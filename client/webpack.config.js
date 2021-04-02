const packageJSON = require('./package.json')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const config = require('./config/configResolver.js').default

const nodeEnv = process.env.NODE_ENV || 'development'
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'

const appEntry = path.join(__dirname, 'src', 'app-hub.js')

const webpackConfig = {
    entry: {
        app: appEntry,
    },
    mode: nodeEnv,
    output: {
        path: path.join(__dirname, 'build'),
        filename: path.join('js', `[name]_${packageJSON.version}.js`),
        //this is where the files are served from
        publicPath: `${config.routes.baseAppName}`,
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader', options: { modules: true } },
                ],
            },
            {
                test: /\.(jpe?g|png|gif|svg|woff(2)?|ttf|eot)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: `[name]_${packageJSON.version}.[ext]`,
                            outputPath: 'assets/',
                        },
                    },
                ],
            },
        ],
    },
    devtool: shouldUseSourceMap ? 'source-map' : false,
    devServer: {
        historyApiFallback: true,
    },
    resolve: {
        extensions: ['.js'],
        // If these cause issues with using nodejs for testing, see
        // https://stackoverflow.com/questions/33793504/using-webpack-aliases-in-mocha-tests
        alias: {
            config: path.resolve(__dirname, 'config/'),
            src: path.resolve(__dirname, 'src/'),
        },
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(nodeEnv),
            },
            __APP_CONFIG__: JSON.stringify(config),
            __APP_INFO__: JSON.stringify({
                version: packageJSON.version,
                built: new Date().getTime(),
            }),
        }),
        new HtmlWebpackPlugin({
            title: 'DHIS2 AppHub',
            filename: 'index.html',
            template: path.join(__dirname, 'indexbuild.html'),
        }),
    ],
}

module.exports = webpackConfig
