<template>
    <div class="main status-wrap" v-title="'404'"></div>
</template>

<script>
    export default {
        name: 'status404',
        mounted(){
            let scriptDom = document.createElement('script');
            scriptDom.type = 'text/javascript';
            scriptDom.src = '//qzonestyle.gtimg.cn/qzone/hybrid/app/404/search_children.js';
            scriptDom.setAttribute('homePageUrl', '/');
            scriptDom.setAttribute('homePageName', '返回首页');
            document.head.appendChild(scriptDom);
        }
    }
</script>

