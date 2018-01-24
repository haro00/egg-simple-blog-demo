'use strict';

/**
 * 用户
 */
class UserConnector {
    constructor(ctx) {
        this.ctx = ctx;
    }

    // 登录
    async login(params) {
        return await this.ctx.service.user.login(params);
    }

    // 列表
    async index(params) {
        return await this.ctx.service.user.index(params);
    }

    // 详情
    async show(params) {
        return await this.ctx.service.user.show(params);
    }

    // 添加/编辑
    async update(params) {
        return await this.ctx.service.user.update(params);
    }
}

module.exports = UserConnector;