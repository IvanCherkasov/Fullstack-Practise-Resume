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
        publicPath: '/',
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
        }]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: PATHS.source + '/index.pug'
        })
    ]
}