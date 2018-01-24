'use strict';

const Service = require('egg').Service;

/**
 * 文章
 */
class Article extends Service {
    /**
     * 获取列表
     * @param page
     * @param pageSize
     * @param search
     * @param state
     * @param creatorId
     * @param date
     * @param typeId
     * @returns {Promise<any>}
     */
    index({page = 1, pageSize = 10, search, state, creatorId, date, typeId}) {
        return new Promise(async (resolve, reject) => {
            const app = this.app;
            // 当前页开始的位置
            let size = app.toNumber(pageSize, 10);
            let pageNow = app.toNumber(page, 1);
            let pageStart = size * (pageNow - 1);
            let sqlWhere = 'where 1=1 ';
            if (typeId) {
                sqlWhere += ` and find_in_set(${app.mysql.escape(typeId)}, a.type_id)`;
            }
            if (creatorId) {
                sqlWhere += ` and a.creator_id=${app.mysql.escape(creatorId)}`;
            }
            if (date) {
                let [start, end] = [];
                let arr = date.split('-');
                if (arr.length > 1) {
                    start = `${arr[0]}-${arr[1]}-01 00:00:00`;
                    end = arr[1] == 12 ? `${Number(arr[0]) + 1}-01-01 00:00:00` : `${arr[0]}-${Number(arr[1]) + 1}-01 00:00:00`;
                } else {
                    start = `${arr[0]}-01-01 00:00:00`;
                    end = `${Number(arr[0]) + 1}-01-01 00:00:00`;
                }
                sqlWhere += ` and a.create_time>='${start}' and a.create_time<'${end}'`;
            }
            if (search) {
                sqlWhere += ` and lower(a.title) like ` + app.mysql.escape(`%${search}%`);
            }
            if (state) {
                sqlWhere += ` and a.state=${app.mysql.escape(state)}`;
            } else if (creatorId) {
                sqlWhere += ` and a.state>=0`;
            } else {
                sqlWhere += ` and a.state=1`;
            }
            let sql = `select a.id, a.title, a.content, a.editor, u.name as creator, a.intro, a.type_id, a.state, a.views, date_format(a.create_time, '%Y-%m-%d %h:%i:%s') as createTime from ${app.config.table.article} a left join ${app.config.table.user} u on a.creator_id=u.id ${sqlWhere} order by a.create_time desc ` + (pageNow < 1 ? ';' : `limit ${app.mysql.escape(pageStart)},${app.mysql.escape(size)};`);
            let sqlTotal = `select count(*) as total from ${app.config.table.article} a ${sqlWhere};`;
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
    
    /**
     * 详情
     * @param id
     * @returns {Promise}
     */
    show({id}) {
        return new Promise(async (resolve, reject) => {
            const app = this.app;
            try {
                let sql = `select a.id, a.title, a.content, a.editor, u.name as creator, a.intro, a.type_id, a.state, a.views, date_format(a.create_time, '%Y-%m-%d %h:%i:%s') as createTime, date_format(a.update_time, '%Y-%m-%d %h:%i:%s') as updateTime from ${app.config.table.article} a left join ${app.config.table.user} u on a.creator_id=u.id where a.id=${app.mysql.escape(id)};`;
                let result = await app.mysql.query(sql);
                resolve(this.ctx.helper.toCamel(result[0]));
            } catch (err) {
                reject(err);
            }
        });
    }
    
    /**
     * 添加/编辑
     * @param id
     * @param creator_id
     * @param title
     * @param content
     * @param intro
     * @param typeId
     * @param state
     * @param editor
     * @returns {Promise<any>}
     */
    update({id, creatorId, title, content, intro, typeId, state, editor}) {
        return new Promise(async (resolve, reject) => {
            const app = this.app;
            try {
                let col = this.ctx.helper.filterEmptyKey({
                    title,
                    content,
                    intro,
                    type_id: typeId,
                    state,
                    editor
                });
                if (id) {
                    await app.mysql.update(app.config.table.article, {
                        ...col,
                        id,
                        update_time: new Date()
                    });
                    resolve(await this.show({id}));
                } else {
                    let result = await app.mysql.insert(app.config.table.article, {
                        ...col,
                        creator_id: creatorId,
                        create_time: new Date()
                    });
                    resolve(await this.show({id: result.insertId}));
                }
            } catch (err) {
                reject(err);
            }
        });
    }
    
    /**
     * 获取所有月份和文章数
     * @returns {Promise<any>}
     */
    getCreateDate() {
        return new Promise(async (resolve, reject) => {
            const app = this.app;
            const year = new Date().getFullYear();
            try {
                let sql = `select case when year(create_time)<${year} then date_format(create_time, '%Y年') when year(create_time)>= ${year} then date_format(create_time, '%Y年%c月') END as date, count(*) as total from ${app.config.table.article} group by date order by date desc`;
                let result = await app.mysql.query(sql);
                resolve(this.ctx.helper.toCamel(result));
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = Article;
