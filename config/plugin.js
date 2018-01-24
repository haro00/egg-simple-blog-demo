'use strict';

/**
 * 插件配置
 */
module.exports = {
    // mysql
    mysql: {
        enable: true,
        package: 'egg-mysql',
    },
    // graphql
    graphql: {
        enable: true,
        package: 'egg-graphql',
    },
    // 跨域
    cors: {
        enable: true,
        package: 'egg-cors',
    },
    // socket
    io: {
        enable: true,
        package: 'egg-socket.io',
    }
};
