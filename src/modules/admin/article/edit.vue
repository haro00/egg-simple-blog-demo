<template>
    <div class="main" v-title="id ? '编辑文章' : '添加文章'">
        <div class="edit-article">
            <transition name="opacity">
                <p class="recover-tip" v-if="recover">退出前未提交, 您可以<a href="JavaScript:void(0);" @click="handleRecover">点此恢复</a>
                </p>
            </transition>
            <h2 v-text="id ? '编辑文章' : '添加文章'"></h2>
            <validate ref="validate">
                <ul class="form-list">
                    <li class="form-item">
                        <p class="item-title"><span class="required">标题</span></p>
                        <input type="text" class="input-text" placeholder="请输入标题" required maxLength="50" v-model="article.title">
                    </li>
                    <li class="form-item article-content">
                        <p class="item-title">
                            <span class="required">内容</span>
                            <a href="javascript:void(0);" class="editor-btn" @click="changeEditor" v-text="article.editor == 1 ? '(使用MarkDown格式)' : '(使用HTML格式)'"></a>
                        </p>
                    </li>
                    <li class="form-item">
                        <div class="content-editor" v-show="article.editor != 1">
                            <textarea class="editor textarea" placeholder="请使用markdown格式输入" required v-model="article.content" @input="inputMarkdown" @scroll="scrollMd"></textarea>
                            <div class="editor-view md" v-html="html"></div>
                        </div>
                        <div class="content-editor" v-show="article.editor == 1">
                            <div class="editor md" id="htmlEditor"></div>
                        </div>
                    </li>
                    <li class="form-item">
                        <p class="item-title">分类</p>
                        <label class="input-checkbox" v-for="type in typeObj" :key="type.id" v-if="type.id > 1">
                            <input type="checkbox" :value="type.id" v-model="typeCheck">
                            <span v-text="type.name"></span>
                        </label>
                    </li>
                    <li class="form-item">
                        <p class="item-title"><span class="required">简介</span></p>
                        <textarea class="textarea_intro textarea" placeholder="请输入简介" required v-model="article.intro"></textarea>
                    </li>
                    <li class="form-item">
                        <p class="item-title"><span class="required">状态</span></p>
                        <label class="input-radio">
                            <input type="radio" :value="1" v-model="article.state">
                            <span>公开</span>
                        </label>
                        <label class="input-radio">
                            <input type="radio" :value="0" v-model="article.state">
                            <span>不公开</span>
                        </label>
                    </li>
                    <li class="form-item">
                        <input type="button" :value="id ? '保存' : '添加'" class="btn-default w100" :disabled="submitDisabled" @click="submit">
                    </li>
                </ul>
            </validate>
        </div>
    </div>
</template>

<script type="text/babel">
    import WangEditor from 'wangeditor'
    import toMarkdown from 'to-markdown'
    import marked from 'marked'

    marked.setOptions({
        breaks: true,
        sanitize: true,
        highlight(code) {
            return require('highlight.js').highlightAuto(code).value;
        }
    });
    export default {
        name: 'articleEdit',
        props: {
            // 文章id
            id: {
                type: [String, Number],
                default: ''
            }
        },
        data() {
            return {
                // 文章
                article: {
                    // 标题
                    title: '',
                    // 内容
                    content: '',
                    // 简介
                    intro: '',
                    // 封面
                    cover: '',
                    // 分类id
                    typeId: '',
                    // 编辑器0:md,1:富文本
                    editor: 0,
                    // 文章公开状态
                    state: 1
                },
                // 文章内容html格式
                html: '',
                // 选中的文章分类
                typeCheck: [],
                // 是否恢复了
                recover: false,
                // 是否保存了
                bySaveBtn: false,
                // 富文本编辑器对象
                editor: '',
                // 提交可用
                submitDisabled: false,
                loading: false
            }
        },
        computed: {
            user() {
                return this.$store.getters.getUser;
            },
            typeObj() {
                return this.$store.state.typeObj;
            }
        },
        methods: {
            //获取文章内容
            getArticle() {
                this.loading = true;
                this.fetchGraphql({
                    query: `query($data: IdIpt) {
                        article(data: $data) {
                            title
                            author
                            content
                            editor
                            cover
                            intro
                            typeId
                            type
                            state
                        }
                    }`,
                    variables: {
                        data: {
                            id: Number(this.id)
                        }
                    }
                }).then(({status, data: {article}}) => {
                    if (status === 200) {
                        this.article = article;
                        if (article.editor == 1) {
                            this.html = article.content;
                            this.useHtml();
                        } else {
                            this.inputMarkdown();
                        }
                        let typeStr = article.typeId.replace(/1(,)?/g, '').replace('/\\s/g', '');
                        this.typeCheck = typeStr ? typeStr.split(',') : [];
                    }
                    this.loading = false;
                }).catch(err => {
                    this.article = {
                        title: '',
                        content: '',
                        intro: '',
                        cover: '',
                        typeId: '',
                        editor: 0,
                        state: 1
                    };
                    this.loading = false;
                });
            },
            // 切换编辑器
            changeEditor() {
                this.article.editor = this.article.editor == 1 ? 0 : 1;
                if (this.article.editor == 1) {
                    this.useHtml();
                } else {
                    this.useMarkdown();
                }
            },
            // 使用富文本
            useHtml() {
                if (!this.editor) {
                    let _this = this;
                    this.editor = new WangEditor('htmlEditor');
                    this.editor.config.menuFixed = false;
                    this.editor.config.jsFilter = false;
                    this.editor.config.pasteFilter = false;
                    this.editor.config.printLog = false;
                    this.editor.config.uploadImgUrl = this.fileBase + '/api/upload/editor';
                    this.editor.config.uploadImgFileName = 'file';
                    let reg = new RegExp('(^|; |;)csrfToken=([^; |;]*)(; |;|$)');
                    let result = document.cookie.match(reg);
                    let csrfToken = result ? result[2] : null;
                    this.editor.config.uploadHeaders = {
                        'x-auth-token': this.user.token,
                        'x-csrf-token': csrfToken
                    };
                    this.editor.config.menus = [
                        'source',
                        '|',
                        'bold',
                        'underline',
                        'italic',
                        'strikethrough',
                        'eraser',
                        'forecolor',
                        'bgcolor',
                        '|',
                        'quote',
                        'fontfamily',
                        'fontsize',
                        'head',
                        'unorderlist',
                        'orderlist',
                        'alignleft',
                        'aligncenter',
                        'alignright',
                        '|',
                        'link',
                        'unlink',
                        'table',
                        'emotion',
                        '|',
                        'img',
                        'video',
                        //'location',
                        'insertcode',
                        '|',
                        'undo',
                        'redo',
                        'fullscreen'
                    ];
                    this.editor.onchange = function () {
                        _this.html = _this.editor.$txt.html();
                    };
                    this.editor.create();
                }
                this.editor.$txt.html(this.html);
            },
            // 使用md
            useMarkdown() {
                //html转换md
                this.article.content = toMarkdown(this.html);
            },
            // md转换html
            inputMarkdown() {
                this.html = marked(this.article.content);
            },
            // md格式编辑区域滚动,内容区域跟着滚动到对应位置
            scrollMd(event) {
                let dom = event.target;
                let siblingDom = event.target.nextSibling;
                let height = dom.scrollHeight;
                let siblingHeight = siblingDom.scrollHeight;
                let top = dom.scrollTop;
                siblingDom.scrollTop = siblingHeight / height * top;
            },
            //选择图片
            chooseImg(event) {
                let fileDom = event.target;
                if (fileDom.value != '') {
                    let file = fileDom.files[0];
                    if (file.type.indexOf('image') == -1) {
                        return false;
                    }
                    if (file.size > 5 * 1024 * 1024) {
                        return false;
                    }
                }
            },
            //恢复未保存的内容
            handleRecover() {
                let article = LocalStorage.get('addArticle');
                if (article) {
                    this.article = article;
                    this.typeCheck = article.typeId.split(',');
                    this.inputMarkdown();
                    LocalStorage.del('addArticle');
                }
                this.recover = false;
            },
            //添加/保存文章
            submit() {
                if (!this.$refs.validate.validForm()) {
                    return false;
                }
                let article = this.article.editor === 1 ? {
                    ...this.article,
                    id: this.id ? Number(this.id) : '',
                    typeId: this.typeCheck.length > 0 ? this.typeCheck.toString().replace(/^,+/, '').replace(/,+$/, '') : '1',
                    creatorId: this.user.id,
                    content: this.html
                } : {
                    ...this.article,
                    id: this.id ? Number(this.id) : undefined,
                    typeId: this.typeCheck.length > 0 ? this.typeCheck.toString().replace(/^,+/, '').replace(/,+$/, '') : '1',
                    creatorId: this.user.id,
                };
                this.submitDisabled = true;
                this.fetchGraphql({
                    query: `mutation($data: ArticleUpdateIpt) {
                        article(data: $data) {
                            id
                            updateTime
                        }
                    }`,
                    variables: {
                        data: article
                    }
                }).then(async ({status, data: {article}}) => {
                    if (status === 200) {
                        this.bySaveBtn = true;
                        if (this.article.state === 1) {
                            let socketData = {
                                creator: this.user.name,
                                title: this.article.title,
                                time: article.updateTime,
                                id: article.id,
                                edit: !!this.id
                            };
                            await this.socket.emit('updateArticle', socketData);
                        }
                        if (this.id) {
                            this.tip('保存文章成功', 'success');
                            this.$router.go(-1);
                        } else {
                            this.tip('添加文章成功', 'success');
                            LocalStorage.del('addArticle');
                            this.$router.push({name: 'adminArticle'});
                        }
                    }
                    this.submitDisabled = false;
                }).catch(err => {
                    this.tip(this.id ? '保存文章失败' : '添加文章失败', 'error');
                    this.article = {};
                    this.submitDisabled = false;
                });
            },
        },
        created() {
            if (this.id) {
                this.getArticle();
            }
        },
        mounted() {
            if (!this.id && LocalStorage.get('addArticle')) {
                this.recover = true;
            }
            let vm = this;
            //添加文章时,刷新页面前保存未保存的内容
            window.onbeforeunload = function () {
                if (!vm.id && !vm.bySaveBtn && (vm.article.title || vm.article.content || vm.article.cover || vm.article.intro)) {
                    let date = new Date();
                    vm.article.typeId = vm.typeCheck.toString();
                    localStorage.setItem('addArticle', JSON.stringify({
                        c: date.getTime(),
                        e: date.getTime() + 2 * 60 * 60 * 1000,
                        v: vm.article
                    }));
                }
            }
        },
        beforeRouteLeave(to, from, next) {
            //添加文章时,前端路由跳转前保存未保存的内容
            if (!this.id && !this.bySaveBtn && (this.article.title || this.article.content || this.article.cover || this.article.intro)) {
                this.article.typeId = this.typeCheck.toString();
                LocalStorage.set('addArticle', this.article, {hour: 2});
            }
            next();
        }
    }
</script>

<style lang="scss" type="text/scss">
    @import "../../../common/scss/base/variables";
    @import "../../../common/scss/base/mixin";
    @import "../../../common/scss/plug/md";
    @import "../../../common/scss/plug/editor";
    @import "../../../../node_modules/highlight.js/styles/tomorrow.css";

    .edit-article{
        position: relative;
        padding: 20px;
        .recover-tip{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 20px;
            line-height: 20px;
            a{
                color: $theme;
            }
        }
        .form-item{
            padding-left: 50px;
            &.article-content{
                .item-title{
                    width: 300px;
                    text-align: left;
                    text-indent: 11px;
                }
            }
            .item-title{
                width: 50px;
            }
            .input-text, .textarea{
                width: 50%;
            }
            .textarea{
                width: 50%;
                height: 120px;
            }
            .editor-btn{
                margin-left: 10px;
                color: $blue;
            }
            .content-editor{
                position: relative;
                width: 100%;
                @include clearfix();
                .editor{
                    float: left;
                    height: 500px;
                }
                .wangEditor-container{
                    overflow: auto;
                }
                .editor-view{
                    float: left;
                    width: 49%;
                    height: 500px;
                    padding: 10px;
                    margin-left: 1%;
                    background: #fff;
                    border: 1px solid $border-color;
                    border-radius: 4px;
                    box-sizing: border-box;
                    overflow-y: auto;
                }
            }
        }
    }
</style>