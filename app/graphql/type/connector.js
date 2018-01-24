'use strict';

/**
 * 分类
 */
class UserConnector {
    constructor(ctx) {
        this.ctx = ctx;
    }
    
    // 列表
    async index(params) {
        return await this.ctx.service.type.index(params);
    }
    
}

module.exports = UserConnector;