import Vue from 'vue';
import Confirm from '../../components/confirm.vue'

/**
 * confirm
 * @param title
 * @param html
 * @returns {Promise}
 */
export default function ({title = '', html = ''}) {
    return new Promise((resolve, reject) => {
        let confirm = new Vue({
            methods: {
                confirm(val) {
                    resolve(val);
                }
            },
            render(h){
                return (
                    <confirm title={title} html={html} onConfirm={this.confirm}></confirm>
                )
            },
            components: {
                Confirm
            }
        }).$mount();
        document.body.appendChild(confirm.$el);
    });
}