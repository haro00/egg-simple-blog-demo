/**
 * vue自定义指令 v-title
 */
export default {
    inserted(el, {value}) {
        document.title = value ? `BLOG-${value}` : 'BLOG';
    }
}
