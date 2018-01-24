'use strict';

/**
 * 通用配置
 * @param appInfo
 * @returns {object}
 */
module.exports = appInfo => {
    const config = {
        middleware: ['interceptorAuth'],
        // http安全
        security: {
            csrf: {
                enable: false,
                ignoreJSON: true,
                cookieName: 'csrfToken', // cookie 中的字段名，默认为 csrfToken
                sessionName: 'csrfToken', // session 中的字段名，默认为 csrfToken
            },
        },
        // egg-mysql配置
        mysql: {
            // 单数据库信息配置
            client: {
                // host
                host: '127.0.0.1',
                // 端口号
                port: '3306',
                // 用户名
                user: 'root',
                // 密码
                password: '',
                // 数据库名
                database: 'blog',
            },
            // 是否加载到 app 上，默认开启
            app: true,
            // 是否加载到 agent 上，默认关闭
            agent: false,
        },
        // egg-graphql
        graphql: {
            router: '/graphql',
            // 是否加载到 app 上，默认开启
            app: true,
            // 是否加载到 agent 上，默认关闭
            agent: false,
        },
        io: {
            init: {}, // passed to engine.io
            namespace: {
                '/': {
                    connectionMiddleware: [],
                    packetMiddleware: [],
                },
            },
            redis: {
                host: '127.0.0.1',
                port: 6379
            },
        },
        // 数据库表名
        table: {
            user: 'td_user',
            role: 'td_role',
            type: 'td_type',
            article: 'td_article',
        },
        // 状态码
        status: {
            success: 200, // 成功
            outdated: 401, // 没有传入token
            auth: 407, // 无权限
            failed: 400, // 查询结果不对
            error: 500 // 错误
        },
    };
    
    config.keys = appInfo.name + 'blog';
    
    return config;
};