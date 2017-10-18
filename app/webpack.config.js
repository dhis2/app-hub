const webpack = require("webpack");
const path = require("path");
const packageJSON = require("../package.json");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const nodeEnv = process.env.NODE_ENV || "development";
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isDevBuild = process.argv.indexOf("-p") === -1;
const config = require("./src/config/configResolver.js").default;
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const prod = {
    entry: {
        app: ["babel-polyfill", "whatwg-fetch", "./app/src/app-store.js"]
    },
    output: {
        path: path.join(__dirname, "..", "target", "classes", "static"),
        filename: path.join("js", `[name]_${packageJSON.version}.js`),
        //this is where the files are served from
        publicPath: config.routes.baseAppName + "/"
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    // This is a feature of `babel-loader` for webpack (not Babel itself).
                    // It enables caching results in ./node_modules/.cache/babel-loader/
                    // directory for faster rebuilds.
                    cacheDirectory: true,
                },
            },
            {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.css$/,
                loaders: ["style-loader", "css-loader"]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    `file-loader?name=[name]_${packageJSON.version}.[ext]&publicPath=${config
                        .routes.baseAppName}/&outputPath=assets/`
                ]
            }
        ]
    },
    devtool: shouldUseSourceMap ? 'source-map' : false,


    resolve: {
        extensions: [".js", ".jsx"],
        alias: {
            'react-dom': path.resolve(__dirname, '../node_modules/react-dom'),
            'react': path.resolve(__dirname, '../node_modules/react'),
            'prop-types': path.resolve(__dirname, '../node_modules/prop-types'),
            'lodash-es': path.resolve(__dirname,'../node_modules/lodash')
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            },
            __APP_CONFIG__: JSON.stringify(config)
        }),

        new HtmlWebpackPlugin({
            title: "DHIS2 Appstore",
            filename: "index.html",
            template: "app/indexbuild.html"
        }),

        new webpack.optimize.UglifyJsPlugin({ minimize: true, comments: false, sourceMap: shouldUseSourceMap}),
        new BundleAnalyzerPlugin()
    ]
};

const dev = Object.assign({}, prod, {
    entry: {
        app: ["babel-polyfill", "whatwg-fetch", "./app/src/app-store.js"]
    },
    output: {
        path: path.join(__dirname, "build"),
        filename: "[name].js",
        publicPath: "/"
    },

    devServer: {
        port: 9000,
        inline: true,
        contentBase: "./app",
        historyApiFallback: true
    },
    devtool: "cheap-module-source-map",
    plugins: [
        new HtmlWebpackPlugin({
            title: "DHIS2 Appstore",
            filename: "index.html",
            template: "app/indexbuild.html"
        }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("development")
            },
            __APP_CONFIG__: JSON.stringify(config)
        })
    ]
});

const tomcatDev = Object.assign({}, prod, {
    plugins: [
        ...prod.plugins,
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("development")
            },
            __APP_CONFIG__: JSON.stringify(config)
        })
    ]
});

module.exports = env => {
    const isTomcatDev =
        env && (env.tomcat || env.tomcat === "true") && isDevBuild;
    const buildName = isTomcatDev
        ? "tomcatDev"
        : isDevBuild ? "development" : "production";

    //console.log(`Using config ${buildName}`);

    if (isTomcatDev) {
        return tomcatDev;
    }
    return isDevBuild ? dev : prod;
};
