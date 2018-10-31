const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJsPlugin=require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const outputDirectory = "dist";

module.exports = {
    entry: "./src/client/index.js",
    output: {
        path: path.join(__dirname, outputDirectory),
        filename: "bundle.js"
    },
    externals:{'wx':'wx'},
    //target: "node",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.less$/,
                use: [{
                    loader: 'style-loader' // creates style nodes from JS strings
                }, {
                    loader: 'css-loader' // translates CSS into CommonJS
                }, {
                    loader: 'less-loader', // compiles Less to CSS
                    options: {
                        javascriptEnabled: true
                    }
                }]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
  devServer: {
      disableHostCheck: true,
      port: 3000,
    open: true,
    proxy: {
      "/api": "http://localhost:8080",
      "/user": "http://localhost:8080",
      "/public": "http://localhost:8080",
      "/private": "http://localhost:8080",
      "/wxImg" : "http://localhost:8080",
      "/loginwx": "http://[::1]:8080",
      "/db": "http://[::1]:8080",
      "/loginlocal": "http://[::1]:8080"
    },
      historyApiFallback: true,
      hot: true

  },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: false
                }
            })
        ]
    },
    plugins: [
    new CleanWebpackPlugin([outputDirectory]),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./public/favicon.ico"
    }),
    new webpack.HotModuleReplacementPlugin(),
  ]
};

