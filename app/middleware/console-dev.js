'use strict';

module.exports = (opt, app) => {
    let format = opt.format || '<:method> - :origin:url [:status] - ';
    return async (ctx, next) => {
        let start = new Date();
        await next();
        let str = format
            .replace(':method', ctx.method)
            .replace(':url', ctx.url)
            .replace(':origin', ctx.origin)
            .replace(':status', ctx.status);
        let duration = new Date() - start;
        console.log(`${app.dateFormat(start, 'yyyy-MM-dd hh:mm:ss')}  ${str}[${duration}ms]`);
    }
};