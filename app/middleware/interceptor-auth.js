'use strict';
/**
 * 权限拦截
 */

const md5 = require('md5');

module.exports = (opt, app) => {
    return async (ctx, next) => {
        let auth = ctx.headers['x-auth-sign'];
        let date = new Date();
        let authSign = md5(date.getFullYear() + date.getMonth() + date.getDate());
        if (ctx.method === 'GET' || auth === authSign) {
            await next();
            return false;
        }
        try {
            let token = ctx.headers['x-auth-token'] || ctx.request.body['x-auth-token'];
            if (token) {
                let result = await app.mysql.select(app.config.table.user, {
                    where: {token},
                    columns: ['expiration', 'role_id']
                });
                if (result.length === 1 && result[0].expiration > Date.now()) {
                    if (result[0].role_id > 2) {
                        ctx.status = app.config.status.auth;
                        ctx.body = {
                            data: {},
                            message: '无权限',
                            status: app.config.status.auth
                        };
                        return false;
                    }
                    await next();
                    return false;
                }
            }
            ctx.status = app.config.status.outdated;
            ctx.body = {
                data: {},
                message: '登录超时, 请重新登录',
                status: app.config.status.outdated
            };
        } catch (err) {
            app.emit('error', err, this);
            ctx.body = {
                data: {},
                status: app.config.status.error,
                message: app.config.env === 'prod' ? 'Internal Server Error' : err.message,
            };
            ctx.status = 500;
        }
    };
};