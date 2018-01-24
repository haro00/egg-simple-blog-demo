'use strict';

/**
 * 文章
 */
class ArticleConnector {
    constructor(ctx) {
        this.ctx = ctx;
    }
    
    // 列表
    async index(params) {
        return await this.ctx.service.article.index(params);
    }
    
    // 详情
    async show(params) {
        return await this.ctx.service.article.show(params);
    }
    
    // 添加/编辑
    async update(params) {
        return await this.ctx.service.article.update(params);
    }
    
    // 获取时间归档
    async getCreateDate(params) {
        return await this.ctx.service.article.getCreateDate(params);
    }
}

module.exports = ArticleConnector;