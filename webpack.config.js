const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    entry: './index.js',
    output: {
        path: path.join(__dirname, 'dist/'),
        filename: 'bundle.js',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                            '@babel/preset-typescript',
                        ],
                        plugins: [
                            '@babel/plugin-transform-runtime',
                        ],
                    },
                },
            },
            // CSS Modules handling
            {
                test: /\.module\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[name]__[local]__[hash:base64:5]'
                            },
                            importLoaders: 1
                        }
                    },
                    'postcss-loader'
                ]
            },
            // Global CSS
            {
                test: /\.css$/,
                exclude: /\.module\.css$/,
                use: ['style-loader', 'css-loader']
            },
            // SCSS handling
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            // Handle images and other assets
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            // Handle fonts
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            }
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            'react': path.resolve(__dirname, 'node_modules/react'),
            'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
            '@mui/material': path.resolve(__dirname, 'node_modules/@mui/material')
        }
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
            }),
            new CssMinimizerPlugin()
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.THEME_VARIABLES': JSON.stringify({
                '--theme-color': '#C53131',
                '--theme-background': '#12181c',
                '--theme-contrast': '#f8eb56',
                '--theme-paper': '#232b2f',
                '--theme-muted': '#75838b',
                '--theme-positive': '#40d250',
                '--theme-negative': '#d24040',
                '--font-condensed': '"Roboto Condensed", Roboto, Helvetica, sans-serif'
            })
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            favicon: './public/favicon.ico',
            inject: true,
        }),
        // Add any additional plugins you need
    ],
    devServer: {
        historyApiFallback: true,
        hot: true,
        port: 3000,
    },
    devtool: process.env.NODE_ENV === 'development' ? 'eval-source-map' : false,
};
