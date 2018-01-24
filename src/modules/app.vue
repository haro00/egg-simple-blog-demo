<template>
    <div class="app">
        <header-nav></header-nav>
        <div class="main-wrap">
            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
        <footer class="footer">
            <p>Copyright © 2016-2018 </p>
        </footer>
    </div>
</template>

<script>
    import HeaderNav from './layout/header/header.vue'
    import Loading from '../common/components/loading.vue'

    import store from './store'

    export default {
        name: 'app',
        created() {
            this.$store.dispatch('getTypeList');
        },
        components: {
            HeaderNav,
            Loading
        },
        store
    }

</script>

<style lang="scss" type="text/scss">
    @import '../common/scss/base/variables';
    @import '../common/scss/base/mixin';
    @import '../common/scss/index';

    .app{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    }

    .main-wrap{
        position: relative;
        width: 100%;
        height: 100%;
        flex: 1;
        overflow: auto;
        box-sizing: border-box;
        background: #fff;
    }

    .footer{
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
        background: $content;
        font-size: 12px;
        overflow: hidden;
        p{
            width: 90%;
            line-height: 1.5em;
            color: #fff;
            text-align: center;
        }
    }

    .main{
        box-sizing: border-box;
    }
</style>