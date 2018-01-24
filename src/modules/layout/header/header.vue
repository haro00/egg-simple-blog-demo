<template>
    <header class="header">
        <!--<a href="/" class="header-logo"><span>APIMOCK</span></a>-->
        <h1 class="header-logo">
            <a href="/" class="img-box">
                <img src="./logo.png" alt="logo">
            </a>
        </h1>
        <nav class="header-nav">
            <router-link :to="{name: 'articleNav'}">
                <span class="nav-text"><span data-txt="文章列表">文章列表</span></span>
            </router-link>
            <router-link :to="{name: 'adminArticle'}" v-if="user && user.roleId < 3">
                <span class="nav-text"><span data-txt="文章管理">文章管理</span></span>
            </router-link>
            <router-link :to="{name: 'userNav'}" v-if="user && user.roleId === 1">
                <span class="nav-text"><span data-txt="用户管理">用户管理</span></span>
            </router-link>
        </nav>
        <template v-if="!isProd">
            <div class="header-login" v-if="user && user.name">
                <a href="javascript:void(0);" v-text="user.name"></a>
                <span>&nbsp;</span>
                <a href="javascript:void(0);" class="ml10" @click="logout">退出</a>
            </div>
            <div class="header-login" v-if="!user || !user.name">
                <router-link :to="{name: 'login'}">登录</router-link>
                <span>|</span>
                <router-link :to="{name: 'register'}">注册</router-link>
            </div>
        </template>
        <div class="header-search">
            <input type="text" class="input-text" placeholder="搜索文章" v-model="searchText" @keyup.enter="search"/>
            <a href="javascript: void(0);" class="search-icon" @click="search"></a>
        </div>
    </header>
</template>

<script>
    export default {
        name: 'headerNav',
        data() {
            return {
                searchText: '',
            }
        },
        computed: {
            user() {
                return this.$store.getters.getUser;
            },
            isProd() {
                return process.env.NODE_ENV === 'production';
            }
        },
        methods: {
            search() {
                this.$router.push({
                    name: 'articleList',
                    params: {page: 1},
                    query: {search: this.searchText.toLocaleLowerCase()}
                });
            },
            logout() {
                this.$store.commit('SET_USER', {});
                LocalStorage.del('user');
                this.$router.push('/');
            }
        }
    }

</script>
<style lang="scss" type="text/scss">
    @import '../../../common/scss/base/variables';
    @import '../../../common/scss/base/mixin';

    .header{
        position: relative;
        z-index: $index-header;
        width: 100%;
        height: $header-height;
        background: #15171f;
        box-sizing: border-box;
        transition: height .2s ease;
        @include clearfix();

        .header-logo{
            float: left;
            width: 200px;
            height: 100%;
            transition: all .2s ease;
            overflow: hidden;
            a{
                display: block;
                width: 100%;
                height: 80%;
                margin-top: 4%;
            }
        }
        /*.header-logo{
            float: left;
            width: 200px;
            height: $header-height;
            transition: all .2s ease;
            overflow: hidden;
            text-align: center;
            line-height: $header-height;
            span{
                color: #fff;
                font-size: 24px;
                font-weight: bold;
                !*animation: filter 5s infinite alternate ease-in-out;*!
                transform: translate3d(0, 0, 0);
                letter-spacing: .2rem;
                filter: blur(.05rem);
            }
            @keyframes filter{
                10%{
                    letter-spacing: .2rem;
                    filter: blur(.05rem);
                }
                60%{
                    filter: blur(.4rem);
                }
                90%{
                    letter-spacing: -5.5rem;
                    filter: blur(.1rem);
                }
                100%{
                    letter-spacing: -5.5rem;
                    filter: blur(.1rem);
                }
            }
        }*/
        .header-nav{
            float: left;
            display: block;
            height: 100%;
            @include clearfix();
            a{
                float: left;
                transition: all 0.4s ease;
                &.router-link-active{
                    background: #25272f;
                }
                &:hover{
                    .nav-text{
                        &:after{
                            transform: scaleX(1);
                        }
                        span:before{
                            width: 100%;
                        }
                    }
                }
            }
            .nav-text{
                display: block;
                float: left;
                padding: 0 20px;
                text-align: center;
                line-height: $header-height;
                color: #ddd;
                font-size: 16px;
                overflow: hidden;
                position: relative;
                transition: all .2s ease;
                span{
                    display: block;
                    position: relative;
                    text-align: center;
                    &:before{
                        content: attr(data-txt);
                        display: block;
                        width: 0;
                        height: 100%;
                        color: #fff;
                        position: absolute;
                        top: 0;
                        left: 0;
                        z-index: 2;
                        white-space: nowrap;
                        overflow: hidden;
                        transition: all 0.4s ease;
                    }

                }
                &:after{
                    content: "";
                    width: 100%;
                    height: 100%;
                    background: #35373f;
                    position: absolute;
                    top: 0;
                    right: 0;
                    transform-origin: right;
                    transform: scaleX(0);
                    transition: all 0.4s ease;
                    z-index: 0;
                }
            }
        }
        .header-search{
            position: relative;
            float: right;
            margin: 0 30px;
            height: $header-height;
            padding: 9px 0;
            box-sizing: border-box;
            .input-text{
                width: 100px;
                padding-right: 26px;
                border: 1px solid #ddd;
                background: transparent;
                color: #ddd;
                transition: all .2s ease;
                &:focus{
                    width: 200px;
                }
            }
            .search-icon{
                @include search(
                    $width: 14px,
                    $color: #ddd,
                    $color-hover: #fff
                );
                position: absolute;
                top: ($header-height - 14px) / 2;
                right: 5px;
            }
        }
        .header-login{
            float: right;
            height: $header-height;
            margin-right: 20px;
            color: #fff;
            line-height: $header-height;
            font-size: 14px;
            transition: all .2s ease;
            a{
                float: left;
                color: #fff;
            }
            span{
                float: left;
                margin: 0 5px;
            }
        }
    }

    @media screen and(max-width: 800px){
        .header{
            .header-logo{
                width: 150px;
            }
            .header-nav{
                display: none;
            }
        }
    }
    @media screen and(max-width: 410px){
        .header{
            .header-search{
                display: none;
            }
        }
    }
</style>

