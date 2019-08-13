const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const bundleOutputDir = './wwwroot/dist';

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);
    var mode = isDevBuild ? "development" : "production";
    return [{
        mode,
        watch: isDevBuild,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
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
        entry: { 'main': './ClientApp/boot.tsx' },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            alias: {
                'react-dom': '@hot-loader/react-dom',
                "@Types": path.resolve(__dirname, "ClientApp/@types/"),
                "@Stores": path.resolve(__dirname, "ClientApp/stores/"),
                "@Models": path.resolve(__dirname, "ClientApp/models/"),
                "@Components": path.resolve(__dirname, "ClientApp/components/")
            }
        },
        output: {
            path: path.join(__dirname, bundleOutputDir),
            filename: '[name].js',
            publicPath: 'dist/'
        },
        module: {
            rules: [
                { test: /\.tsx?$/, include: /ClientApp/, use: 'awesome-typescript-loader?silent=true' },
                { test: /\.css$/, use: isDevBuild ? ['style-loader', 'css-loader'] : [ MiniCssExtractPlugin.loader, 'css-loader'] },
                { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' }
            ]
        },
        plugins: [
            new CheckerPlugin(),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./wwwroot/dist/vendor-manifest.json')
            })
        ].concat(isDevBuild ? [
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ] : [
                // Plugins that apply in production builds only
                new MiniCssExtractPlugin({ filename: 'site.css' })
            ])
    }];
};