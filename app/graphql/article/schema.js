'use strict';

module.exports = {
    Query: {
        // 列表
        async articleList(root, {data}, ctx) {
            return await ctx.connector.article.index(data);
        },
        // 详情
        async article(root, {data}, ctx) {
            return await ctx.connector.article.show(data);
        },
        // 归档时间
        async createDate(root, params, ctx) {
            return await ctx.connector.article.getCreateDate(params);
        },
    },
    Mutation: {
        // 添加/编辑
        async article(root, {data}, ctx) {
            return await ctx.connector.article.update(data);
        },
    }
};
