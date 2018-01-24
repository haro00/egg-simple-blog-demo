'use strict';

/**
 * 开发环境配置
 */
module.exports = {
    middleware: ['consoleDev', 'interceptorAuth'],
    consoleDev: {
        format: '<:method> - :origin:url [:status] - '
    },
    cluster: {
        listen: {
            path: '',
            port: 4000,
            hostname: '',
        }
    }
};