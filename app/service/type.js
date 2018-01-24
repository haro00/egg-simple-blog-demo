'use strict';

const Service = require('egg').Service;

/**
 * 分类
 */
class Type extends Service {
   
    /**
     * 获取列表
     * @param page  当前页
     * @param pageSize  每页条数
     * @param search
     * @returns {Promise<any>}
     */
    index({page = 1, pageSize = 10, search}) {
        return new Promise(async (resolve, reject) => {
            const app = this.app;
            // 当前页开始的位置
            let size = app.toNumber(pageSize, 10);
            let pageNow = app.toNumber(page, 1);
            let pageStart = size * (pageNow - 1);
            let sqlWhere = search ? 'where lower(t.name) like ' + app.mysql.escape(`%${search}%`) : '';
            let sql = `select t.id, t.name, count(a.id) as total from ${app.config.table.type} t left join ${app.config.table.article} a on a.state = 1 and find_in_set(t.id, a.type_id) ${sqlWhere} group by t.id` + (pageNow < 1 ? ';' : `limit ${app.mysql.escape(pageStart)},${app.mysql.escape(size)};`);
            let sqlTotal = `select count(t.id) as total from ${app.config.table.type} t ${sqlWhere};`;
            try {
                let total = await app.mysql.query(sqlTotal);
                let list = await app.mysql.query(sql);
                resolve({
                    list: this.ctx.helper.toCamel(list),
                    total: total[0].total
                });
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = Type;
