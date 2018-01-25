import title from './directive/title'

import IndexdDB from 'indexeddb-promise'
import confirm from './function/confirm'
import tip from './function/tip'
import {fetchApi, fetchGraphql} from './function/fetch'
import io from '../../../node_modules/socket.io-client'

import VueSelect from '../../common/components/select.vue'
import Loading from '../../common/components/loading.vue'
import Validate from '../../common/components/validate.vue'
import TableList from '../../common/components/table-list.vue'
import Popup from '../../common/components/popup.vue'
import Pages from '../../common/components/pages.vue'

export default {
    install(Vue) {
        /**
         * 自定义指令
         */
        // 改变title
        Vue.directive('title', title);
        
        /**
         *自定义属性
         */
        Vue.prototype.db = new IndexdDB('blog');
        Vue.prototype.fileBase = 'http://localhost:4000';
        Vue.prototype.socket = io('http://localhost:4000');
        
        /**
         * 自定义方法
         * @type {Function}
         */
        // confirm
        Vue.prototype.confirm = confirm;
        // tip提示信息
        Vue.prototype.tip = tip;
        // 使用fetch请求graphql
        Vue.prototype.fetchGraphql = fetchGraphql;
        // 发送fetch请求
        Vue.prototype.fetch = fetchApi;
        // 将false值(除0外)设为''
        Vue.prototype.filterFalse = (value, filterValue = '') => (value || value == 0) ? value : filterValue;
        // 判断空对象
        Vue.prototype.isEmptyObject = (obj) => Reflect.ownKeys(obj).length < 1;
        /**
         * 将 date 转化为指定格式的String
         * 月(M)、日(d)、小时(h/H)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符
         * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
         * dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
         * dateFormat(new Date(), 'yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
         * @param date
         * @param fmt
         * @returns String
         */
        Vue.prototype.dateFormat = (date, fmt) => {
            if (Object.prototype.toString.call(date) !== '[object Date]' || isNaN(date.getTime())) {
                return '';
            }
            let o = {
                'M+': date.getMonth() + 1, //月份
                'd+': date.getDate(), //日
                'h+': date.getHours(), //小时
                'm+': date.getMinutes(), //分
                's+': date.getSeconds(), //秒
                'q+': Math.floor((date.getMonth() + 3) / 3), //季度
                'S': date.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
            for (let k in o)
                if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
            return fmt;
        };
        
        /**
         * 将当前时间之前的时间转换为'XX前'格式
         * @param startTime
         * @returns String
         */
        Vue.prototype.getTimeFormat = (startTime) => {
            let startTimeMills = new Date(startTime).getTime();
            let endTimeMills = new Date().getTime();
            let diff = parseInt((endTimeMills - startTimeMills) / 1000);//秒
            let day_diff = parseInt(Math.floor(diff / 86400));//天
            let buffer = '';
            if (diff < 0) {
                return '[error],时间越界...';
            }
            if (day_diff == 0 && diff < 60) {
                if (diff <= 0) diff = 1;
                buffer = diff + '秒前';
            } else if (day_diff == 0 && diff < 120) {
                buffer = '1 分钟前';
            } else if (day_diff == 0 && diff < 3600) {
                buffer = Math.round(Math.floor(diff / 60)) + '分钟前';
            } else if (day_diff == 0 && diff < 7200) {
                buffer = '1小时前';
            } else if (day_diff == 0 && diff < 86400) {
                buffer = Math.round(Math.floor(diff / 3600)) + '小时前';
            } else if (day_diff == 1) {
                buffer = '1天前';
            } else if (day_diff < 7) {
                buffer = day_diff + '天前';
            } else if (day_diff < 30) {
                buffer = Math.round(Math.floor(day_diff / 7)) + ' 星期前';
            } else if (day_diff >= 30 && day_diff <= 179) {
                buffer = Math.round(Math.floor(day_diff / 30)) + '个月前';
            } else if (day_diff >= 180 && day_diff < 365) {
                buffer = '半年前';
            } else if (day_diff >= 365) {
                buffer = Math.round(Math.floor(day_diff / 30 / 12)) + '年前';
            }
            return buffer;
        };
        
        /**
         * 全局组件
         */
        // 自定义select
        Vue.component(VueSelect.name, VueSelect);
        // 加载动画
        Vue.component(Loading.name, Loading);
        // 表单校验
        Vue.component(Validate.name, Validate);
        // 表格列表
        Vue.component(TableList.name, TableList);
        // 弹出层
        Vue.component(Popup.name, Popup);
        // 分页
        Vue.component(Pages.name, Pages);
    }
};