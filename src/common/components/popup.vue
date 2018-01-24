<template>
    <div class="popup-wrap" v-if="show">
        <div class="popup">
            <a href="javascript: void(0);" @click="hide" class="pop-close"></a>
            <h4 class="pop-title">
                <slot name="title"></slot>
            </h4>
            <div class="pop-content">
                <slot name="content"></slot>
            </div>
            <div class="pop-btn-box">
                <slot name="btn"></slot>
            </div>
        </div>
        <div class="mask"></div>
    </div>
</template>

<script>
    export default {
        name: 'popup',
        props: {
            // 显示弹出层
            show: {
                required: true,
                type: Boolean,
            }
        },
        methods: {
            hide() {
                this.$emit('update:show', false);
            }
        }
    }
</script>
<style lang="scss" type="text/scss">
    @import '../scss/base/variables';
    @import '../scss/base/mixin';
    
    .popup-wrap{
        .mask{
            position: fixed;
            top: 0;
            left: 0;
            z-index: $index-popup - 1;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .4);
        }
    }
    
    .popup{
        $title-height: 40px;
        
        width: 600px;
        max-height: 80vh;
        position: fixed;
        top: 50%;
        left: 50%;
        z-index: $index-popup;
        box-shadow: 0 0 1px #ccc;
        background-color: white;
        border-radius: 4px;
        overflow: hidden;
        font-size: 14px;
        transform: translate(-50%, -50%);
        .pop-close{
            @include close(18px);
            position: absolute;
            top: 12px;
            right: 12px;
            z-index: 2;
        }
        .pop-title{
            height: $title-height;
            padding: 0 35px 0 15px;
            background: #fff;
            border-bottom: 1px solid $border-color;
            border-radius: 8px 8px 0 0;
            color: $content;
            line-height: $title-height;
            font-size: 16px;
        }
        
        .pop-content{
            position: relative;
            overflow: auto;
            max-height: calc(80vh - 100px);
            padding: 15px;
            box-sizing: border-box;
            line-height: 1.5em;
            word-wrap: break-word;
        }
        
        .pop-btn-box{
            height: $title-height;
            padding: 0 15px;
            margin-bottom: 10px;
            text-align: center;
            line-height: $title-height;
            .pop-btn-default{
                @include button(
                        $width: 80px,
                        $height: 30px,
                        $bgcolor: $green,
                        $font-color: #fff,
                        $radius: 2px
                );
                margin: 0 5px;
            }
            .pop-btn-cancel{
                @include button(
                        $width: 80px,
                        $height: 30px,
                        $bgcolor: #fff,
                        $font-color: $content,
                        $radius: 2px,
                        $border: true,
                        $bdcolor: $border-color
                );
                margin: 0 5px;
            }
        }
    }
</style>