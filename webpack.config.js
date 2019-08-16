const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const args = require('minimist')(process.argv.slice(2));
const dotenv = require('dotenv').config({path: __dirname + '/.env'});
const devMode = args.mode === 'development';

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const HTMLWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

const common = {
    entry: {
        login: path.resolve(__dirname, 'src/entrypoints/login'),
        signup: path.resolve(__dirname, 'src/entrypoints/signup'),
        app: path.resolve(__dirname, 'src/entrypoints/app')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: devMode ? '[name].js' : '[name].[contenthash].js'
    },
    module: {
        rules: [
            { test: /\.js$/, use: 'babel-loader' }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            SERVER_ROOT: JSON.stringify(dotenv.parsed.SERVER_ROOT)
        }),
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/common.html'),
            inlineSource: '^login.+js$', // For HTMLWebpackInlineSourcePlugin, replaces added <script> GET from chunks w/ inline JS
            chunks: ['login'],
            filename: 'login.html',
            title: 'FundFlux - Login',
        }),
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/common.html'),
            inlineSource: '^signup.+js$',            
            chunks: ['signup'],
            filename: 'signup.html',
            title: 'FundFlux - Signup',
        }),
        new HTMLWebpackPlugin({ 
            template: path.resolve(__dirname, 'src/common.html'),
            inlineSource: '^app.+js$',
            chunks: ['app'],
            filename: 'app.html',
            title: 'FundFlux',
        }),
        new HTMLWebpackInlineSourcePlugin()
    ],
    watchOptions: {
        ignored: ['node_modules', 'tests', 'server']
    }
};

const development = {
    devtool: 'inline-source-map', // replace with 'eval-source-map', if build times become too long
    // devtool: 'eval-source-map',
    devServer: {},
    module: {
        rules: [
            { test: /\.(scss|css)$/, use: [
                { loader: 'style-loader',  options: { sourceMap: true } },
                { loader: 'css-loader',  options: { sourceMap: true } },
                { loader: 'sass-loader', options: { sourceMap: true } }
            ]}
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};

const production = {
    module: {
        rules: [
            { test: /\.(scss|css)$/, use: ['style-loader', 'css-loader', 'sass-loader'] }
        ]
    }
};

module.exports = merge(common, devMode ? development : production);
