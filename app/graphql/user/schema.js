'use strict';

module.exports = {
    Query: {
        // 登录
        async userLogin(root, {data}, ctx) {
            return await ctx.connector.user.login(data);
        },
        // 列表
        async userList(root, {data}, ctx) {
            return await ctx.connector.user.index(data);
        },
        // 详情
        async user(root, {data}, ctx) {
            return await ctx.connector.user.show(data);
        },
    },
    Mutation: {
        // 添加/编辑
        async user(root, {data}, ctx) {
            return await ctx.connector.user.update(data);
        },
    }
};
