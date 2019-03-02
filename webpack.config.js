const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');


module.exports = function (options) {
    return {
        mode: process.env.NODE_ENV || "development",
        entry: [
            'webpack-hot-middleware/client?reload=true',
            './src/client/index.ts'
        ],
        module: {
            rules: [
                { test: /\.tsx?$/, use: 'ts-loader?configFile=src/client/tsconfig.json', exclude: /node_modules/ },
                { test: /\.(png|woff|woff2|eot|ttf|svg)$/, use: 'file-loader?limit=1024&name=[path][name].[ext]' },
            ]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),

            new HtmlWebpackPlugin({
                template: path.resolve("src", "client", "index.html")
            }),

            // extract styles from bundle into a separate file
            new ExtractTextPlugin('index.css'),

            new CopyPlugin([
                { from: 'resources', to: '.' },
            ]),
        ],
        externals: ['tls', 'net', 'hiredis', 'cluster'],
        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        },
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'lib', 'public')
        }
    };
}
