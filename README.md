# egg-simple-blog-demo

一个简单的博客示例，后台使用`eggjs`，使用了`egg-mysql`、`egg-graphql`、`egg-sockect.io`等插件。前端页面使用`vue2.x`，发送请求使用`fetch`。

如果`eggjs`仅用来作中间层，可以直接使用内置的`HttpClient`向后台发送请求获取数据来代替`service`层。

代码一般，仅供参考。

## 快速入门

参见 [egg 文档][egg]。

### 环境配置

- 数据库使用`MySql`, 将`blog.sql`导入。

- `egg-socket.io`使用`redis`, 还需要启动`redis`。

### 目录结构

```
|--------------------------------------------------
|---/app    // egg.js server 
|---|---/controller    // controller 层
|---|---/extend    // 框架的扩展方法
|---|---/graphql    // 后台graphql配置
|---|---|---/user   // 一个graphql模块
|---|---|---|---connector.js    // 编写 connector 逻辑, 主要是跟数据库之间的侨接
|---|---|---|---schema.js    // 编写对每个 query/mutation 的 resolver 逻辑
|---|---|---|---schema.graphql    // 编写 graphql 的 schema
|---|---|---/schema   // graphql的Query和Mutation类型放于此处
|---|---|---|---resolver.js    // 将每个GraphQL模块的 query/mutation 的 resolver 逻辑合并到此处, resolver逻辑跟Query和Mutation操作的schema.graphql文件在同一文件夹下才会被执行
|---|---|---|---schema.graphql    // 编写 graphql 的 Query和Mutation操作
|---|---/io    // 后台socket配置
|---|---/middleware    // 中间件
|---|---/model    // model层
|---|---/public    // 静态资源
|---|---/schedule    // 定时任务
|---|---/service    // service 层
|---|---/view    // 模板
|---|---router.js    // 路由
|---/config    // egg配置
|---/logs    // 日志, 自动生成
|---/run    // 框架和应用的启动配置, 自动生成
|---/src    // 前端资源, 将会被打包到/app/static
|---|---/common    // 公共资源
|---|---|---/components    // 公共vue组件
|---|---|---/images    // 公共图片
|---|---|---/fonts    // 公共字体文件
|---|---|---/plugin    // 公共自定义vue插件
|---|---|---/scss    // 公共scss
|---|---|---/utils    // 公共js方法
|---|---/modules    // 页面模块
|---|---/router    // 前端路由
|---|---app.js    // 前端入口
|---|---template.html    // 模板html
|---/test    // 测试目录, egg的测试必须以 **.test.js 方式命名
|---/app.js    // 本地开发自定义启动过程中加载的中间件,获取数据等
|---.babelrc    // babel配置
|---.eslintrc    // eslint配置
|---.stylelintrc    // stylelint配置
|---blog.sql    // 创建数据库脚本
|---package.json    // npm配置
|---README.md    // 项目介绍
|---webpack.conf.dev.js    // webpack开发环境配置
|---webpack.conf.pro.js    // webpack生产环境配置
|--------------------------------------------------
```

### 本地开发
```
$ npm install
$ npm run dev
```

### 部署

- 生产环境编译

```
npm run release
```

- 服务器只需要`app`和`config`两个文件夹

- 服务器安装依赖

```
npm install --production
```

- 使用`egg-script`来启动。

```
# 启动
$ npm start

# 停止
$ npm stop
```

### 单元测试
- [egg-bin] 内置了 [mocha], [thunk-mocha], [power-assert], [istanbul] 等框架，让你可以专注于写单元测试，无需理会配套工具。
- 断言库非常推荐使用 [power-assert]。
- 具体参见 [egg 文档 -单元测试](https://eggjs.org/zh-cn/core/unittest)。

- 使用 `npm test` 来执行单元测试。


[egg]: https://eggjs.org


## License

MIT