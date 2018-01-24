'use strict';

const Controller = require('egg').Controller;

/**
 * files
 */
class FilesController extends Controller {
    /**
     * 富文本编辑器上传文件
     * @returns {Promise<void>}
     */
    async editorUploadFile() {
        const ctx = this.ctx;
        let stream = await ctx.getFileStream();
        try {
            let result = await ctx.service.files.editorUploadFile(stream);
            ctx.body = result;
        } catch (err) {
            ctx.logger.error(err);
            ctx.status = 500;
            ctx.body = 'error|server error';
        }
    }
}

module.exports = FilesController;
