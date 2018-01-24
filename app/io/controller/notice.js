const Controller = require('egg').Controller;

/**
 * socket通知
 */
class NoticeController extends Controller {
    async updateArticle() {
        const data = this.ctx.args[0];
        await this.ctx.socket.broadcast.emit('updateArticle', data);
    }
}

module.exports = NoticeController;