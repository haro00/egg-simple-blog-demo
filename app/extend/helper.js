'use strict';

module.exports = {
    /**
     * 处理controller的错误
     * @param ctx
     * @param err
     */
    handleError(ctx, err) {
        let error = err && err.length && err.length > 0 ? err[0].message : err;
        ctx.logger.error(error);
        ctx.body = {
            data: {},
            message: error,
            status: this.app.config.status.error
        };
    },
    /**
     * 将下划线命名转成驼峰命名
     * @param arg
     * @returns {*}
     */
    toCamel(arg) {
        if (Object.prototype.toString.call(arg) === '[object Object]') {
            let obj = {};
            for (let k in arg) {
                obj[k.replace(/_(\w)/g, ($0, $1) => $1.toUpperCase())] = this.toCamel(arg[k]);
            }
            return obj;
        }
        if (Object.prototype.toString.call(arg) === '[object Array]') {
            return arg.map(item => this.toCamel(item));
        }
        return arg;
    },
    /**
     * 驼峰转下划线
     * @param arg
     * @returns {*}
     */
    toUnderline(arg) {
        if (Object.prototype.toString.call(arg) === '[object Object]') {
            let obj = {};
            for (let k in arg) {
                obj[k.replace(/([A-Z])/g, '_$1').toLowerCase()] = this.toUnderline(arg[k]);
            }
            return obj;
        }
        if (Object.prototype.toString.call(arg) === '[object Array]') {
            return arg.map(item => this.toUnderline(item));
        }
        return arg;
    },
    
    /**
     * 去掉对象里value为false的key
     * @param obj
     * @returns {{}}
     */
    filterEmptyKey(obj) {
        let newObj = {};
        for (let k in obj) {
            if (obj[k] || obj[k] === 0) {
                newObj[k] = obj[k];
            }
        }
        return newObj;
    }
};