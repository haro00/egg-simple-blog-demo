/**
 * html5 storage
 *
 * 使用:
 * 1. localStorage: `let LocalStorage = new WebStorage();`
 * 2. sessionStorage: `let SessionStorage = new WebStorage('sessionStorage');`
 *
 *
 * API:
 * 1. set(key, value, option):
 * 添加/修改缓存数据
 * @param key: 缓存的key
 * @param val: 缓存的value
 * @param option(可选): 缓存时间或过期时间, 其格式为 => exp: 值为Date或number(单位秒); hour,day,week,month,year: 值为number
 *
 * 例如:
 * LocalStorage.set('token', '123456');
 * LocalStorage.set('token', '123456', {day: 1});
 * LocalStorage.set('token', '123456', {exp: 24 * 3600});
 * LocalStorage.set('token', '123456', {exp: new Date(2017, 0, 1)});
 *
 *
 * 2. get(key):
 * 获取缓存数据
 * @param key: 缓存的key
 * @returns {*}: 过期或不存在的缓存会返回null
 *
 * 例如:
 * LocalStorage.get('token');
 *
 *
 * 3. del(key):
 * 删除缓存数据
 * @param key
 * @returns {*}: 返回key
 *
 * 例如:
 * LocalStorage.del('token');
 *
 *
 * 4. clearExpires():
 * 清空所有过期的缓存数据
 * @returns {Array}: 返回所有删除的key的数组
 *
 *
 * 5. clear();
 * 清空所有缓存数据, 也包含通过原始storage API添加的缓存
 *
 *
 * 6. touch(key, option):
 * 重置过期时间
 * @param key: 缓存的key
 * @param option(可选): 缓存时间或过期时间, 其格式为 => exp: 值为Date或number(单位秒); hour,day,week,month,year: 值为number
 * @returns {boolean}
 *
 * 例如:
 * LocalStorage.touch('token', {hour: 2});
 *
 *
 * 7. replace(key, val):
 * 重置value, 过期时间不变
 * @param key: 缓存的key
 * @param val: 缓存的value
 * @returns {boolean}
 *
 * 例如:
 * LocalStorage.replace('token', '666666');
 *
 *
 * 8. add(key, val, option):
 * 当key不存在或过期了才添加缓存数据
 * @param key: 缓存的key
 * @param val: 缓存的value
 * @param option(可选): 缓存时间或过期时间, 其格式为 => exp: 值为Date或number(单位秒); hour,day,week,month,year: 值为number
 * @returns {boolean}
 *
 * 例如:
 * LocalStorage.add('token', '123456');
 * LocalStorage.add('token', '123456', {day: 1});
 */

export default class WebStorage {
    
    constructor(storage = 'localStorage') {
        if (!this.supported(window[storage])) {
            console.error('Your browser is not support html5 storage api.');
            return Object.create(null);
        }
        if (typeof storage === 'string' && window[storage] instanceof Storage) {
            this.storage = window[storage];
        } else {
            this.storage = window.localStorage;
        }
        this.clearExpires();
    }
    
    // json格式转换
    jsonFormat = {
        toString(item) {
            return JSON.stringify(item);
        },
        toJson(data) {
            let json = {};
            try {
                json = JSON.parse(data);
            } catch (err) {
                console.error(err);
                return {};
            }
            return json;
        }
    };
    
    // 最大过期时间
    _maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');
    
    // 检查是否为Date类型
    _isValidDate(date) {
        return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
    }
    
    /**
     * 获取过期时间
     * @param opt 的key => exp: 值为Date或number(单位秒); hour,day,week,month,year: 值为number
     * @param now
     * @returns {*}
     * @private
     */
    _getExpiresDate(opt, now) {
        now = now || new Date();
        if (opt.exp) {
            let expires = opt.exp;
            if (typeof expires === 'number') {
                expires = expires === Infinity ? this._maxExpireDate : new Date(now.getTime() + expires * 1000);
            } else if (typeof expires === 'string') {
                expires = expires.trim() === '' ? this._maxExpireDate : new Date(expires);
            }
            
            if (expires && !this._isValidDate(expires)) {
                throw new Error('`exp` parameter cannot be converted to a valid Date instance');
            }
            return expires;
        }
        if (opt.hour) {
            let time = parseFloat(opt.hour);
            if (isNaN(time)) {
                throw new Error('`hour` parameter must start with number');
            }
            return time === Infinity ? this._maxExpireDate : new Date(now.getTime() + time * 3600000);
        }
        if (opt.day) {
            let time = parseFloat(opt.day);
            if (isNaN(time)) {
                throw new Error('`day` parameter must start with number');
            }
            return time === Infinity ? this._maxExpireDate : new Date(now.getTime() + time * 24 * 3600000);
        }
        if (opt.week) {
            let time = parseFloat(opt.hour);
            if (isNaN(time)) {
                throw new Error('`week` parameter must start with number');
            }
            return time === Infinity ? this._maxExpireDate : new Date(now.getTime() + time * 7 * 24 * 3600000);
        }
        if (opt.month) {
            let time = parseFloat(opt.month);
            if (isNaN(time)) {
                throw new Error('`month` parameter must start with number');
            }
            return time === Infinity ? this._maxExpireDate : new Date(now.getTime() + time * 30 * 24 * 3600000);
        }
        if (opt.year) {
            let time = parseFloat(opt.hour);
            if (isNaN(time)) {
                throw new Error('`year` parameter must start with number');
            }
            return time === Infinity ? this._maxExpireDate : new Date(now.getTime() + time * 365 * 30 * 24 * 3600 * 1000);
        }
        throw new Error('`option` parameter cannot be converted to a valid Date instance');
    }
    
    // 格式化缓存数据
    _getCacheItem(value, exp) {
        let expires = exp ? this._getExpiresDate(exp) : this._maxExpireDate;
        return {
            c: new Date().getTime(),
            e: expires.getTime(),
            v: value
        }
    }
    
    // 检查缓存数据格式
    _isCacheItem(item) {
        if (typeof item !== 'object') {
            return false;
        }
        if (item) {
            if ('c' in item && 'e' in item && 'v' in item) {
                return true;
            }
        }
        return false;
    }
    
    // 检查key是否为字符串
    _checkKey(key) {
        if (typeof key !== 'string') {
            if (typeof key === 'object') {
                throw new Error('Key must not be an object.');
            }
            console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
        }
        return key;
    }
    
    // 检查是否可用
    _checkEffective(cacheItem) {
        let timeNow = Date.now();
        return timeNow < cacheItem.e;
    }
    
    /**
     * 判断浏览器是否支持html5 storage api
     * @param storage
     * @returns {boolean}
     */
    supported(storage) {
        let support = false;
        if (storage && storage.setItem) {
            support = true;
            let key = '__' + Math.round(Math.random() * 1e7);
            try {
                storage.setItem(key, key);
                storage.removeItem(key);
            } catch (err) {
                support = false;
            }
        }
        return support;
    }
    
    /**
     * 添加/修改缓存数据
     * @param key
     * @param val
     * @param option
     * @returns {*}
     */
    set(key, val, option) {
        key = this._checkKey(key);
        if (val === undefined) {
            return this.del(key);
        }
        let cacheItem = this._getCacheItem(val, option);
        try {
            this.storage.setItem(key, this.jsonFormat.toString(cacheItem));
        } catch (err) {
            console.error(err);
        }
        return val;
    }
    
    /**
     * 重置过期时间
     * @param key
     * @param option
     * @returns {boolean}
     */
    touch(key, option) {
        key = this._checkKey(key);
        let cacheItem = null;
        try {
            cacheItem = this.jsonFormat.toJson(this.storage.getItem(key));
        } catch (err) {
            console.error(err);
            return false;
        }
        if (this._isCacheItem(cacheItem)) {
            if (this._checkEffective(cacheItem)) {
                this.set(key, cacheItem.v, option);
                return true;
            } else {
                this.del(key);
            }
        }
        return false;
    }
    
    /**
     * 重置value, 过期时间不变
     * @param key
     * @param val
     * @returns {boolean}
     */
    replace(key, val) {
        key = this._checkKey(key);
        let cacheItem = null;
        try {
            cacheItem = this.jsonFormat.toJson(this.storage.getItem(key));
        } catch (err) {
            console.error(err);
            return false;
        }
        if (this._isCacheItem(cacheItem)) {
            if (this._checkEffective(cacheItem)) {
                cacheItem.v = val;
                this.storage.setItem(key, this.jsonFormat.toString(cacheItem));
                return true;
            } else {
                this.del(key);
            }
        }
        return false;
    }
    
    /**
     * 当key不存在或过期了才添加缓存数据
     * @param key
     * @param val
     * @param option
     * @returns {boolean}
     */
    add(key, val, option) {
        key = this._checkKey(key);
        try {
            let cacheItem = this.jsonFormat.toJson(this.storage.getItem(key));
            if (!this._isCacheItem(cacheItem) || !this._checkEffective(cacheItem)) {
                this.set(key, val, option);
                return true;
            }
        } catch (err) {
            this.set(key, val, option);
            return true;
        }
        return false;
    }
    
    /**
     * 获取缓存数据
     * @param key
     * @returns {*}
     */
    get(key) {
        key = this._checkKey(key);
        let cacheItem = null;
        try {
            cacheItem = this.jsonFormat.toJson(this.storage.getItem(key));
        } catch (err) {
            console.error(err);
            return null;
        }
        if (this._isCacheItem(cacheItem)) {
            if (this._checkEffective(cacheItem)) {
                return cacheItem.v;
            } else {
                this.storage.removeItem(key);
            }
        }
        return null;
    }
    
    /**
     * 删除缓存数据
     * @param key
     * @returns {*}
     */
    del(key) {
        key = this._checkKey(key);
        this.storage.removeItem(key);
        return key;
    }
    
    /**
     * 清空所有过期的缓存数据
     * @returns {Array}
     */
    clearExpires() {
        let length = this.storage.length;
        let deleteKeys = [];
        for (let i = 0; i < length; i++) {
            let key = this.storage.key(i);
            let cacheItem = null;
            try {
                cacheItem = this.jsonFormat.toJson(this.storage.getItem(key));
            } catch (err) {
                console.error(err);
            }
            
            if (cacheItem !== null && cacheItem.e !== undefined) {
                let timeNow = Date.now();
                if (timeNow >= cacheItem.e) {
                    deleteKeys.push(key);
                    this.storage.removeItem(key);
                }
            }
        }
        return deleteKeys;
    }
    
    /**
     * 清空所有缓存数据
     */
    clear() {
        this.storage.clear();
    }
}

const LocalStorage = new WebStorage();
const SessionStorage = new WebStorage('sessionStorage');

export {LocalStorage, SessionStorage};