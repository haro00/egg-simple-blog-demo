<template>
    <div class="main home-wrap" v-title="'欢迎'">
        <div class="welcome">
            <h2>欢迎</h2>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'home',
        data() {
            return {
                loading: false
            }
        },
    }
</script>

<style lang="scss" type="text/scss">
    @import "../../common/scss/base/variables";
    @import "../../common/scss/base/mixin";

    .home-wrap{
        padding: 0 20px;
    }
</style>