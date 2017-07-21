'use strict';
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
    source: path.join(__dirname, 'source'),
    build: path.join(__dirname, 'build')
}

module.exports = {
    context: PATHS.source,
    entry: './index',
    output:{
        path: PATHS.build,
        filename: '[name].js'
    },

    module: {
        loaders:[{
            test: /\.js$/,
            loader: 'babel-loader'
        }, {
            test: /\.pug$/,
            loader: 'pug-loader',
            options: {
                pretty: true
            }
        },{
            test: /\.styl$/,
            loader: 'style-loader!css-loader!stylus-loader'
        },{
            test: /\.(png|jpg|svg)$/,
            loader: 'url-loader?name=pic/[name].[ext]&limit=4096'
        },{
            test: /\.(ttf|eot|woff|woff2)$/,
            loader: 'file-loader?name=[path][name].[ext]'
        },{
            test: /\.json$/,
            exclude: /node_modules/,
            loader: 'json-loader'
        }]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: PATHS.source + '/index.pug'
        })
    ]
}