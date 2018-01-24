import Vue from 'vue';
import Tip from '../../components/tip.vue'

/**
 * 自定义提醒, 3秒消失
 * @param text
 * @param type // 可选'success','warn','error',其他值没有小图标
 */
export default function(text, type = 'warn') {
    let tip = new Vue({
        render(h){
            return (
                <tip text={text} type={type}></tip>
            )
        },
        components: {
            Tip
        },
    }).$mount();
    document.body.appendChild(tip.$el);
}