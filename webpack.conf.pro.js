/**
 * 发布脚本
 */

// 静态资源打包位置
const STATIC_DIST = '/app/public';
// html模板打包位置
const HTML_DIST = '/app/view';
// html内引用静态资源的前缀
const STATIC_PREFIX = '/public/';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const styleLintPlugin = require('stylelint-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');

console.log('发布编译...');

module.exports = {
    
    entry: [
        path.join(process.cwd(), '/src/app.js')
    ],
    output: {
        path: path.join(process.cwd(), STATIC_DIST),
        filename: '[name].[hash:8].js',
        publicPath: STATIC_PREFIX,
        chunkFilename: '[name].[chunkhash:6].js'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
    },
    /**
     * develop tool flags
     * */
    devtool: false,
    cache: false,
    
    plugins: [
        // 删除原静态文件夹
        new CleanPlugin(path.join(process.cwd(), STATIC_DIST)),
        
        // This plugins defines various variables that we can set to false
        // in production to avoid code related to them from being compiled
        // in our final bundle
        new webpack.DefinePlugin({
            __SERVER__: true,
            __DEVELOPMENT__: false,
            __DEVTOOLS__: false,
            'process.env': {
                BABEL_ENV: JSON.stringify('production'),
                NODE_ENV: JSON.stringify('production')
            },
        }),
        
        // 根据模块的相对路径生成一个四位数的hash作为模块id
        new webpack.HashedModuleIdsPlugin(),
        
        // css代码格式检查
        new styleLintPlugin({
            configFile: path.join(__dirname, '/.stylelintrc'),
            quiet: false
        }),
        
        // 抽取css文件
        new ExtractTextPlugin({
            filename: '[name].[hash:6].css',
            disable: false,
            allChunks: true
        }),
        
        // 提取common模块
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: ({resource}) => (
                resource &&
                resource.indexOf('node_modules') >= 0 &&
                resource.match(/\.js$/)
            ),
        }),
        new webpack.optimize.CommonsChunkPlugin({
            async: 'common',
            minChunks: (module, count) => (
                count >= 2
            ),
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        }),
        
        // 打包html文件
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
        
        // 合并太小的chunk
        new webpack.optimize.MinChunkSizePlugin({
            name: 'main',
            minChunkSize: 5120, // ~5kB
        }),
        
        // 压缩代码
        new webpack.optimize.UglifyJsPlugin({
            // 最紧凑的输出
            beautify: false,
            // 删除所有的注释
            comments: false,
            compress: {
                // 在UglifyJs删除没有用到的代码时不输出警告
                warnings: false,
                // 删除所有的 `console` 语句
                drop_console: true,
                // 内嵌定义了但是只用到一次的变量
                collapse_vars: true,
                // 提取出出现多次但是没有定义成变量去引用的静态值
                reduce_vars: true,
            }
        })
    ],
    
    /**
     * loaders
     */
    module: {
        rules: [
            {
                test: /(\.vue|\.js)$/,
                enforce: 'pre',
                exclude: /node_modules/,
                include: path.join(process.cwd() + '/src'),
                loader: 'eslint-loader',
            },
            // worker loader
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
            // ts loader
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    {
                        loader: 'ts-loader',
                        options: {appendTsxSuffixTo: [/\.vue$/]}
                    }
                ]
            },
            // vue loader
            {
                test: /\.vue$/i,
                loader: 'vue-loader',
                exclude: /node_modules/,
                options: {
                    extractCSS: true
                }
            },
            // css loader
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader']
                })
            },
            // scss loader
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
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
            // 字体
            {
                test: /\.(woff2?|woff|svg|eot|ttf)\??.*$/i,
                loader: 'url-loader',
                options: {
                    limit: '50000',
                    name: 'fonts/[name].[ext]'
                }
            },
        ]
    },
};