const path = require('path');
const webpack = require('webpack');
const TerserWebpackPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);
    var mode = isDevBuild ? "development" : "production";
    return [{
        mode,
        optimization: {
            minimize: !isDevBuild,
            usedExports: isDevBuild,
            minimizer: !isDevBuild ? [
                // Production.
                new TerserWebpackPlugin({
                    terserOptions: {
                        output: {
                            comments: false
                        }
                    }
                }),
                new OptimizeCSSAssetsPlugin()
            ] : [
                    // Development.
                ]
        },
        stats: { modules: false },
        resolve: {
            extensions: [ '.js' ]
        },
        module: {
            rules: [
                { test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/, use: 'url-loader?limit=100000' },
                {
                    test: /\.css(\?|$)/, use:
                        [
                            MiniCssExtractPlugin.loader,
                            'css-loader'
                        ]
                }
            ]
        },
        entry: {
            vendor: ['bootstrap', 'bootstrap/dist/css/bootstrap.css', 'event-source-polyfill', 'isomorphic-fetch', 'react', 'react-dom', 'react-router-dom', 'jquery']
        },
        output: {
            path: path.join(__dirname, 'wwwroot', 'dist'),
            publicPath: 'dist/',
            filename: '[name].js',
            library: '[name]_[hash]'
        },
        plugins: [
            new MiniCssExtractPlugin('vendor.css'),
            new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' }), // Maps these identifiers to the jQuery package (because Bootstrap expects it to be a global variable)
            new webpack.DllPlugin({
                path: path.join(__dirname, 'wwwroot', 'dist', '[name]-manifest.json'),
                name: '[name]_[hash]'
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': isDevBuild ? '"development"' : '"production"'
            })
        ].concat(isDevBuild ? [] : [
            new UglifyJsPlugin()
        ])
    }];
};
