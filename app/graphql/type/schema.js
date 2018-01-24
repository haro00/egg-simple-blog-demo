'use strict';

module.exports = {
    Query: {
        // 查询列表
        async typeList(root, {data}, ctx) {
            return await ctx.connector.type.index(data);
        },
    },
    Mutation: {
    
    }
};
