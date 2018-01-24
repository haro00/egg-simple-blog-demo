'use strict';

const fs = require('fs');
const path = require('path');
const sendToWormhole = require('stream-wormhole');
const Service = require('egg').Service;

// 判断文件夹是否存在,不存在就创建文件夹
function hasDir(dirpath) {
    return new Promise((resolve, reject) => {
        fs.exists(dirpath, function (exists) {
            if (exists) {
                resolve(true);
            } else {
                fs.mkdir(dirpath, function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
                });
            }
        });
    });
}

// 将文件流写入文件
function saveStream(stream, filepath) {
    return new Promise((resolve, reject) => {
        try {
            let ws = fs.createWriteStream(filepath);//创建一个可写流
            stream.pipe(ws);
            ws.on('finish', function () {
                resolve(true)
            });
            ws.on('error', function (err) {
                reject(err)
            });
        } catch (err) {
            sendToWormhole(stream);
            throw err;
        }
    });
}

class Files extends Service {
    /**
     * 富文本编辑器上传文件
     */
    async editorUploadFile(stream) {
        return new Promise(async (resolve, reject) => {
            let name_arr = stream.filename.split('.');
            let name_extension = name_arr.pop();
            let name_new = name_arr.join('.') + '_' + new Date().getTime() + '.' + name_extension;
            try {
                await hasDir(path.join(process.cwd(), '/app/public/files/'));
                let newPath = path.join(process.cwd(), '/app/public/files/', name_new);
                await saveStream(stream, newPath);
                resolve('/public/files/' + name_new);
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = Files;
