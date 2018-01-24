'use strict';

module.exports = app => {
    let start = Date.now();

    const DEBUG = app.config.env === 'local';

    if (DEBUG) {
        const {devMiddleware, hotMiddleware} = require('koa-webpack-middleware');
        const webpack = require('webpack');
        const webpackConfig = require('./webpack.conf.dev.js');
        webpackConfig.entry.push(
            'webpack-hot-middleware/client',
            'webpack/hot/dev-server'
        );
        const compiler = webpack(webpackConfig);
        app.use(devMiddleware(compiler, {
            noInfo: true,
            quiet: false,
            watchOptions: {
                aggregateTimeout: 300
            },
            publicPath: webpackConfig.output.publicPath,
            // headers: { "X-Custom-Header": "yes" },
            stats: {
                colors: true
            }
        })).use(hotMiddleware(compiler));
    }
    app.logger.info('启动耗时 %d ms', Date.now() - start);
};
