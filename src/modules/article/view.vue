<template>
    <div class="blog-article" v-title="article.title">
        <transition name="fade" mode="out-in">
            <article class="article-info" v-if="!loading && article.id">
                <h4 class="article-title">
                    <span class="title-name" v-text="article.title"></span>
                    <svg class="title-line">
                        <line class="top" x1="0" y1="1" x2="100%" y2="1"></line>
                        <line class="bottom" x1="0" y1="2" x2="100%" y2="2"></line>
                    </svg>
                </h4>
                <div class="article-msg">
                    <p class="article-time" v-text="`发表于${getTimeFormat(article.createTime)}(${article.createTime.split(' ')[0]})`"></p>
                    <p class="article-author">
                        <i class="author-icon"></i>
                        <span v-text="article.creator"></span>
                    </p>
                    <router-link class="article-type" v-for="item of changeType(article.typeId)" :key="item.id" :to="{name: 'articleTypeList', params: {page: 1, type: item.id}}" :title="item.name">
                        <span class="type-icon" v-text="item.name.charAt(0)"></span>
                    </router-link>
                </div>
                <hr class="strip">
                <div class="article-content md">
                    <div v-html="html"></div>
                    <svg class="title-line">
                        <line class="top" x1="0" y1="1" x2="100%" y2="1"></line>
                        <line class="bottom" x1="0" y1="2" x2="100%" y2="2"></line>
                    </svg>
                </div>
                <div class="article-tag-list">
                    <router-link class="article-tag" v-for="item of changeType(article.typeId)" :key="item.id" v-text="item.name" :to="{name: 'articleTypeList', params: {page: 1, type: item.id}}"></router-link>
                </div>
            </article>
        </transition>
        <loading v-if="loading"></loading>
    </div>
</template>

<script type="text/babel">
    import marked from 'marked'
    //import mdc from 'markdown-core'
    marked.setOptions({
        breaks: true,
        sanitize: true,
        highlight(code) {
            return require('highlight.js').highlightAuto(code).value;
        }
    });

    export default {
        name: 'articleView',
        props: {
            id: {
                default: ''
            }
        },
        data() {
            return {
                // 文章内容
                article: {},
                loading: false
            }
        },
        computed: {
            user() {
                return this.$store.getters.getUser;
            },
            // 文章内容转成html
            html() {
                return this.article.editor == 1 ? this.article.content : marked(this.article.content);
            },
            typeObj() {
                return this.$store.state.typeObj;
            },
        },
        created() {
            this.fetchArticle();
        },
        methods: {
            // 获取文章内容
            async getArticle() {
                try {
                    let article = await this.db.get('article', Number(this.id));
                    if (article) {
                        this.article = article;
                        return false;
                    }
                    this.fetchArticle();
                } catch (err) {
                    this.fetchArticle();
                }
            },
            // 发送请求获取文章内容
            fetchArticle() {
                this.loading = true;
                this.fetchGraphql({
                    query: `query($data: IdIpt) {
                        article(data: $data) {
                            id
                            title
                            creator
                            content
                            editor
                            cover
                            typeId
                            views
                            createTime
                        }
                    }`,
                    variables: {
                        data: {
                            id: Number(this.id)
                        }
                    }
                }, true).then(({status, data: {article}}) => {
                    if (status === 200) {
                        this.article = article;
                    }
                    this.loading = false;
                }).catch(err => {
                    this.article = {};
                    this.loading = false;
                });
            },
            // 将分类id字符串转成分类id和名的数组
            changeType(ids) {
                if (!ids || !this.typeObj) {
                    return [];
                }
                let arr = ids.split(',');
                return arr.map(id => this.typeObj[id]);
            }
        }
    }
</script>

<style lang="scss" type="text/scss">
    @import "../../common/scss/plug/md";
    @import "../../../node_modules/highlight.js/styles/tomorrow.css";
</style>