import request from '../../common/utils/superagent'

/**
 * 获取文章分类列表
 * @returns {Promise}
 */
export function reqTypes() {
    return new Promise((resolve, reject) => {
        let types = LocalStorage.get('types');
        if (types) {
            resolve(types);
        } else {
            request
                .get(BASE + '/article/type')
                .end((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (res.body.status == 200) {
                            // LocalStorage.set('types', res.body.data, {exp: 2 * 60 * 60});
                        }
                        resolve(res.body.data);
                    }
                });
        }
    });
}
