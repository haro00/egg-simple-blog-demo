'use strict';

const Service = require('egg').Service;
const md5 = require('md5');
const uuid = require('uuid');

/**
 * 用户
 */
class User extends Service {
    /**
     * 登录
     * @param name
     * @param password
     * @param save
     * @returns {Promise<any>}
     */
    login({name, password, save}) {
        return new Promise(async (resolve, reject) => {
            password = md5(password);
            const app = this.app;
            try {
                let result = await app.mysql.select(app.config.table.user, {
                    where: {name}
                });
                if (result.length === 0) {
                    reject('用户名不存在');
                    return false;
                }
                if (result[0].password !== password) {
                    reject('密码错误');
                    return false;
                }
                if (result[0].state !== 1) {
                    reject('用户已被禁用, 请联系管理员');
                    return false;
                }
                let {token, expiration} = result[0];
                let resRst = this.ctx.helper.toCamel(result[0]);
                let now = Date.now();
                let expNew = now + (save ? 24 * 3600 * 1000 : 6 * 3600 * 1000);
                if (token && expiration > now) {
                    await app.mysql.update(app.config.table.user, {
                        expiration: expNew
                    }, {
                        where: {name}
                    });
                    resolve(resRst);
                    return false;
                }
                let tokenNew = uuid.v4();
                await app.mysql.update(app.config.table.user, {
                    token: tokenNew,
                    expiration: expNew
                }, {
                    where: {name}
                });
                resolve({
                    ...resRst,
                    token: tokenNew
                });
            } catch (err) {
                reject(err);
            }
        });
    }
    
    /**
     * 获取列表
     * @param page  当前页
     * @param pageSize  每页条数
     * @param roleId
     * @param state
     * @param search
     * @returns {Promise<any>}
     */
    index({page = 1, pageSize = 10, roleId, state, search}) {
        return new Promise(async (resolve, reject) => {
            const app = this.app;
            // 当前页开始的位置
            let size = app.toNumber(pageSize, 10);
            let pageNow = app.toNumber(page, 1);
            let pageStart = size * (pageNow - 1);
            let sqlWhere = '';
            if (roleId) {
                sqlWhere += ` and role_id=${app.mysql.escape(roleId)}`;
            }
            if (search) {
                sqlWhere += ' and name like ' + app.mysql.escape(`%${search}%`);
            }
            let sql = `select id,name,role_id,email,state,date_format(create_time, '%Y-%m-%d %h:%i:%s') as createTime from ${app.config.table.user} where 1=1 ${sqlWhere} order by role_id, create_time desc ` + (pageNow < 1 ? ';' : `limit ${app.mysql.escape(pageStart)},${app.mysql.escape(size)};`);
            let sqlTotal = `select count(*) as total from ${app.config.table.user} where 1=1 ${sqlWhere};`;
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
                let result = await app.mysql.select(app.config.table.user, {
                    where: {id},
                    columns: ['id', 'name', 'role_id', 'email', 'state', 'create_time']
                });
                resolve(this.ctx.helper.toCamel(result[0]));
            } catch (err) {
                reject(err);
            }
        })
    }
    
    /**
     * 添加/编辑
     * @param id
     * @param name
     * @param password
     * @param email
     * @param roleId
     * @param state
     * @returns {Promise<any>}
     */
    update({id, name, password, email = '', roleId = 3, state = 1}) {
        return new Promise(async (resolve, reject) => {
            const app = this.app;
            try {
                let newName = await app.mysql.select(app.config.table.user, {
                    where: {name},
                    columns: ['id']
                });
                let newEmail = await app.mysql.select(app.config.table.user, {
                    where: {email},
                    columns: ['id']
                });
                // 编辑
                if (id) {
                    let oldUser = await app.mysql.select(app.config.table.user, {
                        where: {id},
                        columns: ['name', 'email']
                    });
                    if (name !== oldUser[0].name && newName.length > 0) {
                        reject('用户名已存在');
                        return false;
                    }
                    if (email !== oldUser[0].email && newEmail.length > 0) {
                        reject('该邮箱已被注册');
                        return false;
                    }
                    let updateCol = this.ctx.helper.filterEmptyKey({
                        id,
                        name,
                        email,
                        role_id: roleId,
                        state
                    });
                    if (password) {
                        updateCol.password = md5(password);
                    }
                    await app.mysql.update(app.config.table.user, updateCol);
                    resolve(await this.login({name, password}));
                    return false;
                }
                // 添加
                if (newName.length > 0) {
                    reject('用户名已存在');
                    return false;
                }
                if (newEmail.length > 0) {
                    reject('该邮箱已被注册');
                    return false;
                }
                let result = await app.mysql.insert(app.config.table.user, {
                    name,
                    password: md5(password),
                    email,
                    role_id: roleId,
                    state,
                    create_time: new Date()
                });
                resolve(await this.login({name, password}));
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = User;
