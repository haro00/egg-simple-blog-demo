'use strict';

module.exports = app => {
    // graphQL路由
    app.post('/api/graphql', app.controller.graphql.index);
    // 富文本上传图片路由
    app.post('/api/upload/editor', app.controller.files.editorUploadFile);
    
    // socket路由
    app.io.route('updateArticle', app.io.controller.notice.updateArticle);
    
    // 获取html页面
    app.get('/', app.controller.html.index);
    app.get('/*', app.controller.html.index);
};