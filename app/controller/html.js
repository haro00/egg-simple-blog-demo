'use strict';

const fs = require('fs');
const path = require('path');
const Controller = require('egg').Controller;

/**
 * 返回页面
 */
class HtmlController extends Controller {
    async index() {
        this.ctx.set('Content-Type', 'text/html; charset=utf-8');
        this.ctx.body = fs.readFileSync(path.join(process.cwd(), 'app/view/index.html'), 'utf8');
    }
}

module.exports = HtmlController;