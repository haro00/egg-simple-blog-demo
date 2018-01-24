'use strict';

/**
 * 生产环境配置
 */
module.exports = {
    cluster: {
        listen: {
            path: '',
            port: 4000,
            hostname: '',
        }
    }
};