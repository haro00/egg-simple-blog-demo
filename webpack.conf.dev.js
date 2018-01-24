/**
 * 开发脚本
 */

// 静态资源打包位置
const STATIC_DIST = '/app/public';
// html模板打包位置
const HTML_DIST = '/app/view';
// html内引用静态资源的前缀
const STATIC_PREFIX = 'http://localhost:4000/public/';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const styleLintPlugin = require('stylelint-webpack-plugin');

console.log('开发...');
module.exports = {
    
    entry: [
        path.join(process.cwd(), '/src/app.js'),
    ],
    output: {
        path: path.join(process.cwd(), STATIC_DIST),
        filename: '[name].js',
        publicPath: STATIC_PREFIX,
        chunkFilename: '[name].js'
    },
    devServer: {
        inline: true,
        contentBase: path.join(process.cwd(), STATIC_DIST)
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
    },
    /**
     * develop tool flags
     * */
    devtool: '#module-source-map',
    // debug: true,
    cache: true,
    
    plugins: [
        
        new webpack.HotModuleReplacementPlugin(),
        
        new webpack.NoEmitOnErrorsPlugin(),
        
        // This plugins defines various variables that we can set to false
        // in production to avoid code related to them from being compiled
        // in our final bundle
        new webpack.DefinePlugin({
            __SERVER__: true,
            __DEVELOPMENT__: true,
            __DEVTOOLS__: true,
            'process.env': {
                BABEL_ENV: JSON.stringify('development'),
                NODE_ENV: JSON.stringify('development')
            },
        }),
        
        new styleLintPlugin({
            configFile: path.join(__dirname, '/.stylelintrc'),
            quiet: false
        }),
        
        new HtmlWebpackPlugin({
            filename: path.join(process.cwd(), HTML_DIST, '/index.html'),
            template: path.join(process.cwd(), '/src/template.html'),
            favicon: path.join(process.cwd(), '/src/common/images/favicon.ico'),
            inject: false,
            minify: {
                caseSensitive: true,
                collapseWhitespace: true
            },
            alwaysWriteToDisk: true
        }),
        new HtmlWebpackHarddiskPlugin(),
    ],

    /**
     * loaders
     */
    module: {
        rules: [
            {
                test: /(\.vue|\.js)$/,
                enforce: 'pre',
                include: path.join(process.cwd() + '/src'),
                exclude: /node_modules/,
                loader: 'eslint-loader',
            },
            {
                test: /\.worker.js$/,
                loader: 'worker-loader',
                options: {
                    name: 'worker/[name].js'
                }
            },
            // js loader
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                include: [
                    path.join(process.cwd() + '/src'),
                ]
            },
            // vue loader
            {
                test: /\.vue$/i,
                loader: 'vue-loader',
                exclude: /node_modules/
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    {
                        loader: 'ts-loader',
                        options: { appendTsxSuffixTo: [/\.vue$/] }
                    }
                ]
            },
            // scss loader
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            // 图片loader
            {
                test: /\.(jpe?g|png|gif)$/i,
                loader: 'url-loader',
                options: {
                    limit: '10000',
                    name: 'images/[name].[ext]'
                }
            },
            {
                test: /\.(woff2?|woff|svg|eot|ttf)\??.*$/i,
                loader: 'url-loader',
                options: {
                    limit: '50000',
                    name: 'fonts/[name].[ext]'
                }
            },
        ]
    }
};