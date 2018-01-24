import tip from './tip';
import md5 from 'md5'

export function fetchApi(url, opt) {
    return new Promise((resolve, reject) => {
        if (Object.prototype.toString.call(opt) !== '[object Object]') {
            opt = {};
        }
        let user = LocalStorage.get('user');
        let base = process.env.NODE_ENV === 'production' ? '' : '';
        let headers = new Headers({
            'x-auth-token': user ? user.token : ''
        });
        if (opt.method && opt.method !== 'GET') {
            let reg = new RegExp('(^|; |;)csrfToken=([^; |;]*)(; |;|$)');
            let result = document.cookie.match(reg);
            let csrfToken = result ? result[2] : null;
            headers.set('x-csrf-token', csrfToken);
            if (Object.prototype.toString.call(opt.body) === '[object Object]') {
                headers.set('Content-Type', 'application/json;charset=UTF-8');
                opt.body = JSON.stringify(opt.body);
            }
        } else {
            if (Object.prototype.toString.call(opt.body) === '[object Object]') {
                let arr = [];
                for (let k in opt.body) {
                    arr.push(`${k}=${opt.body[k]}`);
                }
                if (arr.length > 0) {
                    url += `?${arr.join('&')}`;
                }
            }
            Reflect.deleteProperty(opt, 'body');
        }
        if (Object.prototype.toString.call(opt.headers) === '[object Object]') {
            for (let k in opt.headers) {
                headers.set(k, opt.headers[k]);
            }
        }
        Reflect.deleteProperty(opt, 'headers');
        let req = new Request(base + url, {
            method: 'GET',
            headers,
            ...opt
        });
        
        fetch(req).then(res => {
            if (res.ok) {
                resolve(res.json());
                return false;
            }
            if (res.status === 401) {
                tip('登录超时, 请重新登录');
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    location.href = '/login';
                }, 1500);
            }
            if (res.status === 407) {
                tip('无权限操作');
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    location.href = '/';
                }, 1500);
            }
        }).catch(err => {
            reject(err);
        });
    });
}

/**
 * 使用fetch请求graphql
 * @param body
 * @param auth  // true不需要权限, false需要权限
 * @returns {Promise<any>}
 */
export function fetchGraphql(body, auth) {
    return new Promise((resolve, reject) => {
        let user = LocalStorage.get('user');
        if(!auth && !user){
            tip('请先登录');
            let timer = setTimeout(() => {
                clearTimeout(timer);
                location.href = '/login';
            }, 1500);
            return false;
        }
        let reg = new RegExp('(^|; |;)csrfToken=([^; |;]*)(; |;|$)');
        let result = document.cookie.match(reg);
        let csrfToken = result ? result[2] : null;
        let base = process.env.NODE_ENV === 'production' ? '' : '';
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'x-auth-token': user ? user.token : '',
            'x-csrf-token': csrfToken
        });
        if(auth) {
            let date = new Date();
            let authCode = md5(date.getFullYear() + date.getMonth() + date.getDate());
            headers.set('x-auth-code', authCode);
        }
        fetch(base + '/api/graphql', {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        }).then(res => {
            if (res.ok) {
                resolve(res.json());
                return false;
            }
            if (res.status === 401) {
                tip('登录超时, 请重新登录');
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    location.href = '/login';
                }, 1500);
            }
            if (res.status === 407) {
                tip('无权限操作');
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    location.href = '/';
                }, 1500);
            }
        }).catch(err => {
            reject(err);
        });
    });
}