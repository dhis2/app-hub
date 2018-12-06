const webpack = require("webpack");
const path = require("path");
const packageJSON = require("../package.json");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const nodeEnv = process.env.NODE_ENV || "development";

const isDevBuild = process.argv.indexOf("-p") === -1;
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const config = require("./src/config/configResolver.js").default;

const appEntry = path.join(__dirname, 'src/app-store.js');
const polyfillEntry = path.join(__dirname, 'src/polyfills.js');

const prod = {
    entry: {
        polyfills: polyfillEntry,
        app: appEntry
    },
    output: {
        path: path.join(__dirname, "..", "target", "classes", "static"),
        filename: path.join("js", `[name]_[chunkhash:8].js`),
        //this is where the files are served from
        publicPath: config.routes.baseAppName + "/"
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: `[name]_${packageJSON.version}.[ext]`,
                            puplicPath: config.routes.baseAppName,
                            outputPath: 'assets/'
                        }
                    }
                ]
            }
        ]
    },
    devtool: shouldUseSourceMap ? 'source-map' : false,
    resolve: {
        extensions: [".js", ".jsx"],
    },
    plugins: [
        new webpack.DefinePlugin({
            __APP_CONFIG__: JSON.stringify(config)
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, "src/assets"),
                to: "assets"
            }
        ]),

        new HtmlWebpackPlugin({
            title: "DHIS2 Appstore",
            filename: "index.html",
            template: path.join(__dirname, "indexbuild.html")
        }),
    ]
};

const dev = Object.assign({}, prod, {
    entry: {
        polyfills: polyfillEntry,
        app: appEntry
    },
    output: {
        path: path.join(__dirname, "build"),
        filename: "[name].js",
        publicPath: "/"
    },
    mode: "development",
    devServer: {
        port: 9000,
        inline: true,
        contentBase: "./app",
        historyApiFallback: true
    },
    devtool: "eval",
    plugins: [
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, "src/assets"),
                to: "assets"
            }
        ]),
        new HtmlWebpackPlugin({
            title: "DHIS2 Appstore",
            filename: "index.html",
            template: "app/indexbuild.html"
        }),
        new webpack.DefinePlugin({
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

    console.log(`Using config ${buildName}`);

    if (isTomcatDev) {
        return tomcatDev;
    }
    return isDevBuild ? dev : prod;
};
