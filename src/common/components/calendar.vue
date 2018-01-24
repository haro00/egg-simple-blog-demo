<template>
    <div class="calendar-wrap">
        <label class="calendar-date">
            <input type="text" readonly :placeholder="placeholder" :value="time ? chooseTime : chooseDate" :class="{active: show}" :required="required" :disabled="disabled" @click="showCalendar">
            <em class="calendar-icon" :class="{active: show}"><i></i></em>
        </label>
        <transition name="slide">
            <div :class="['calendar', {'calendar-top': listTop}]" v-if="show">
                <div class="calendar-header">
                    <a href="javascript:void(0);" title="上一年" class="year-prev" :disabled="!prevYearAble" @click="yearPrev"></a>
                    <a href="javascript:void(0);" title="上一月" class="month-prev" :disabled="!prevMonthAble" @click="monthPrev"></a>
                    <div class="calendar-year">
                        <input type="text" class="year-text" readonly :value="year" @click="showYear">
                        <transition name="slide">
                            <ul class="list-down clearfix" v-show="showYearList">
                                <li v-for="yy in yearList" :class="{active: yy == year}" v-text="yy" @click="chooseYear(yy)"></li>
                            </ul>
                        </transition>
                    </div>
                    <div class="calendar-month">
                        <input type="text" class="month-text" readonly :value="monthListAll[parseInt(month) - 1]" @click="showMonth">
                        <transition name="slide">
                            <ul class="list-down clearfix" v-show="showMonthList">
                                <li v-for="(mm, index) of monthList" :class="{active: index == parseInt(month) - 1}" v-text="monthListAll[mm]" @click="chooseMonth(mm)"></li>
                            </ul>
                        </transition>
                    </div>
                    <a href="javascript:void(0);" title="下一月" class="month-next" :disabled="!nextMonthAble" @click="monthNext"></a>
                    <a href="javascript:void(0);" title="下一年" class="year-next" :disabled="!nextYearAble" @click="yearNext"></a>
                </div>
                <div class="calendar-body">
                    <table>
                        <thead>
                        <tr>
                            <th v-for="day in week" v-text="day"></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td v-for="td in firstTr">
                                <input type="text" readonly :value="td" :disabled="td > 7 || lessStart(td) || greaterEnd(td)" :class="{active: (td <= 7 && chooseDateArr[0] == year && chooseDateArr[1] == month && chooseDateArr[2] == td) || (td > 7 && chooseDateArr[0] == year && chooseDateArr[1] == month - 1 && chooseDateArr[2] == td)}" @mousedown="choose(td)">
                            </td>
                        </tr>
                        <tr v-for="tr in trs">
                            <td v-for="td in tr">
                                <input type="text" readonly :value="td" :disabled="lessStart(td) || greaterEnd(td)" :class="{active: chooseDateArr[0] == year && chooseDateArr[1] == month && chooseDateArr[2] == td}" @mousedown="choose(td)">
                            </td>
                        </tr>
                        <tr>
                            <td v-for="td in lastTr">
                                <input type="text" readonly :value="td" :disabled="td < 21 || lessStart(td) || greaterEnd(td)" :class="{active: (td >= 21 && chooseDateArr[0] == year && chooseDateArr[1] == month && chooseDateArr[2] == td) || (td < 21 && chooseDateArr[0] == year && chooseDateArr[1] == month + 1 && chooseDateArr[2] == td)}" @mousedown="choose(td)">
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="mask-list-down" v-show="showMonthList || showYearList || showHourList || showMinuteList || showSecondList" @click="hideListDown"></div>
                </div>
                <div class="calendar-footer" v-if="!time">
                    <input type="button" value="确定" @mousedown="hideCalendar">
                    <input type="button" value="今天" @mousedown="chooseToday" :disabled="!todayAble">
                    <input type="button" value="清空" @mousedown="clear">
                </div>
                <div class="calendar-footer time" v-if="!!time">
                    <div class="calendar-time">
                        <input type="text" readonly :value="hour" @click="showHour">
                        <transition name="slide">
                            <ul class="list-down clearfix" v-show="showHourList">
                                <li v-for="hh in hourList" :class="{active: hh == hour}" v-text="hh" @click="chooseHour(hh)"></li>
                            </ul>
                        </transition>
                    </div>
                    <span>:</span>
                    <div class="calendar-time">
                        <input type="text" readonly :value="minute" @click="showMinute">
                        <transition name="slide">
                            <ul class="list-down clearfix" v-show="showMinuteList">
                                <li v-for="mm in minuteList" :class="{active: mm == minute}" v-text="mm" @click="chooseMinute(mm)"></li>
                            </ul>
                        </transition>
                    </div>
                    <span>:</span>
                    <div class="calendar-time">
                        <input type="text" readonly :value="second" @click="showSecond">
                        <transition name="slide">
                            <ul class="list-down clearfix" v-show="showSecondList">
                                <li v-for="ss in minuteList" :class="{active: ss == second}" v-text="ss" @click="chooseSecond(ss)"></li>
                            </ul>
                        </transition>
                    </div>
                    <input type="button" value="确定" @mousedown="ensure"/>
                    <input type="button" value="清空" @mousedown="clear"/>
                </div>
            </div>
        </transition>
        <div class="mask-opacity" v-show="show" @click="hideCalendar"></div>
    </div>
</template>

<script>

    //将日月小于10的前边补0
    function format(i) {
        if (typeof i == 'number' && i < 10) {
            return '0' + i;
        }
        return i;
    }

    export default{
        name: 'calendar',
        props: {
            required: {
                default: false
            },
            disabled: {
                default: false
            },
            // 提示信息
            placeholder: {
                type: String,
                default: ''
            },
            // 默认日期
            date: String,
            // 是否显示时间选择
            time: {
                default: false
            },
            // 开始日期
            start: String,
            // 结束日期
            end: String,
            // 最大年份
            maxYear: {
                default: new Date().getFullYear() + 100
            },
            // 最小年份
            minYear: {
                default: 1970
            }
        },
        data() {
            return {
                //日期分隔符
                separator: '-',
                year: '',
                month: '',
                day: '',
                hour: '00',
                minute: '00',
                second: '00',
                chooseDate: '',
                chooseTime: '',
                week: ['日', '一', '二', '三', '四', '五', '六'],
                monthListAll: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                listTop: false,
                show: false,
                showMonthList: false,
                showYearList: false,
                showHourList: false,
                showMinuteList: false,
                showSecondList: false,
                startYear: this.minYear,
                endYear: this.maxYear,
                startMonth: 1,
                endMonth: 12
            }
        },
        computed: {
            // 选择的日期拆成数组,判断当前日期使用
            chooseDateArr(){
                return this.chooseDate.split(this.separator);
            },
            // 当前月第一天是星期几
            startDay() {
                return new Date(this.year, this.month - 1, 1).getDay()
            },
            // 当前月的下个月的第一天是星期几
            nextStartDay() {
                return new Date(this.year, this.month, 1).getDay()
            },
            // 当前月最后一天是几号
            endDate() {
                return new Date(this.year, this.month, 0).getDate()
            },
            // 当前月的上个月的最后一天是几号
            prevEndDate() {
                return new Date(this.year, this.month - 1, 0).getDate()
            },
            // 第一行
            firstTr(){
                let arr = [];
                let start = this.startDay == 0 ? 7 : this.startDay;
                // 上月的需要补全第一行的日期
                for (let i = 0; i < start; i++) {
                    arr.push(this.prevEndDate - start + i + 1);
                }
                // 当前月的第一行(第一天为星期天就不添加了)
                for (let j = 0; j < 7 - start; j++) {
                    arr.push(j + 1);
                }
                return arr;
            },
            // 最后一行
            lastTr(){
                let arr = [];
                // 当前月的最后一行(下月的第一天是星期天就不再添加了)
                for (let i = 0; i < this.nextStartDay; i++) {
                    arr.push(this.endDate - this.nextStartDay + i + 1);
                }
                // 下月需要补全最后一行的日期
                for (let j = 0; j < 7 - this.nextStartDay; j++) {
                    arr.push(j + 1);
                }
                return arr;
            },
            // 中间行
            trs(){
                let arr = [];
                // 中间行的第一天
                let start = this.startDay == 0 ? 1 : this.firstTr[this.firstTr.length - 1] + 1;
                let dateNum = start;
                // 中间行的最后一天
                let end = this.endDate - this.nextStartDay;
                // 行数遍历
                for (let i = 0; i < (end - start + 1) / 7; i++) {
                    arr[i] = [];
                    // 每行的日期遍历就是从中间行第一天开始每次加一天
                    for (let j = 0; j < 7; j++) {
                        arr[i].push(dateNum);
                        dateNum++;
                    }
                }
                return arr;
            },
            // 生成年份选择
            yearList(){
                let years = [];
                for (let i = this.startYear; i <= this.endYear; i++) {
                    years.push(i);
                }
                return years;
            },
            // 生产月份选择
            monthList(){
                let months = [];
                let start = this.year <= this.startYear ? this.startMonth : 1;
                let end = this.year >= this.endYear ? this.endMonth : 12;
                for (let i = start; i <= end; i++) {
                    months.push(i - 1);
                }
                return months;
            },
            // 生成小时选择
            hourList(){
                let hour = [];
                for (let i = 0; i < 24; i++) {
                    hour.push(format(i));
                }
                return hour;
            },
            // 生成分秒选择
            minuteList(){
                let minute = [];
                for (let i = 0; i < 60; i++) {
                    minute.push(format(i));
                }
                return minute;
            },
            // 上一月按钮可点击
            prevMonthAble(){
                return this.year > this.startYear || (this.year == this.startYear && this.month > this.startMonth);
            },
            // 下一月按钮可点击
            nextMonthAble(){
                return this.year < this.endYear || (this.year == this.endYear && this.month < this.endMonth);
            },
            // 上一年按钮可点击
            prevYearAble(){
                return this.year > this.startYear + 1 || (this.year == this.startYear + 1 && this.month >= this.startMonth);
            },
            // 下一年按钮可点击
            nextYearAble(){
                return this.year < this.endYear - 1 || (this.year == this.endYear - 1 && this.month <= this.endMonth);
            },
            // 今天可点击
            todayAble(){
                let date = new Date();
                let now = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
                let start = this.start && this.checkDate(this.start) ? this.changeDate(this.start) : new Date(this.startYear, this.startMonth - 1, 1).getTime();
                let end = this.end && this.checkDate(this.end) ? this.changeDate(this.end) : new Date(this.endYear, this.endMonth, 0).getTime();
                return now >= start && now <= end;
            }
        },
        watch: {
            date(date){
                if (!date) {
                    this.chooseDate = '';
                    this.chooseTime = '';
                } else {
                    this.init(date);
                }
            },
            start(date){
                if (date && this.checkDate(date)) {
                    let [startYear, startMonth, startDay] = date.split(this.separator);
                    this.startYear = parseInt(startYear);
                    this.startMonth = parseInt(startMonth);
                }
            },
            end(date){
                if (date && this.checkDate(date)) {
                    let [endYear, endMonth] = date.split(this.separator);
                    this.endYear = parseInt(endYear);
                    this.endMonth = parseInt(endMonth);
                }
            },
        },
        created(){
            if (!this.date) {
                this.chooseDate = '';
                this.chooseTime = '';
            } else {
                this.init(this.date);
            }
        },
        methods: {
            // 获取今天
            getToday(){
                let date = new Date();
                let now = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
                let start = this.start && this.checkDate(this.start) ? this.changeDate(this.start) : new Date(this.startYear, this.startMonth - 1, 1).getTime();
                let end = this.end && this.checkDate(this.end) ? this.changeDate(this.end) : new Date(this.endYear, this.endMonth, 0).getTime();
                if (now < start) {
                    this.year = this.startYear;
                    this.month = this.startMonth;
                    this.chooseDate = this.start;
                    this.chooseTime = `${this.chooseDate} 00:00:00`;
                } else if (now > end) {
                    this.year = this.endYear;
                    this.month = this.endMonth;
                    this.chooseDate = this.end;
                    this.chooseTime = `${this.chooseDate} 00:00:00`;
                } else {
                    this.year = date.getFullYear();
                    this.month = date.getMonth() + 1;
                    this.day = date.getDate();
                    this.chooseDate = this.year + this.separator + format(this.month) + this.separator + format(this.day);
                    this.chooseTime = `${this.chooseDate} 00:00:00`;
                }
                this.$emit('update:date', this.time ? this.chooseTime : this.chooseDate);
            },
            // 检查日期格式
            checkDate(date){
                let dateArr = String(date).split(this.separator);
                let time = new Date(date.replace(/-/g, '/'));
                if (dateArr.length == 3 && Object.prototype.toString.call(time) === '[object Date]' && !isNaN(time.getTime())) {
                    return true;
                } else {
                    console.warn('日期格式不正确');
                    return false;
                }
            },
            // 将符合格式的日期(到天)转成时间戳,否则返回0
            changeDate(date){
                let time = 0;
                if (this.checkDate(date)) {
                    let [year, month, day] = date.split(this.separator);
                    time = new Date(year, month - 1, day).getTime();
                }
                return time;
            },
            // 初始化
            init(date){
                this.showYearList = false;
                this.showMonthList = false;
                this.showHourList = false;
                this.showMinuteList = false;
                this.showSecondList = false;
                if (date && this.checkDate(date)) {
                    if (this.time) {
                        let time = date.split(' ');
                        this.year = time[0].split(this.separator)[0];
                        this.month = parseInt(time[0].split(this.separator)[1]);
                        this.chooseDate = time[0];
                        this.hour = time[1].split(':')[0];
                        this.minute = time[1].split(':')[1];
                        this.second = time[1].split(':')[2];
                        this.chooseTime = date;
                        //this.$emit('update:date', this.chooseTime);
                    } else {
                        let dateArr = date.split(this.separator);
                        this.year = dateArr[0];
                        this.month = parseInt(dateArr[1]);
                        this.chooseDate = date;
                        //this.$emit('update:date', this.chooseDate);
                    }
                } else {
                    this.getToday();
                }
                if (this.start && this.checkDate(this.start)) {
                    let [startYear, startMonth, startDay] = this.start.split(this.separator);
                    this.startYear = parseInt(startYear);
                    this.startMonth = parseInt(startMonth);
                } else {
                    this.startYear = this.minYear;
                    this.startMonth = 1;
                }
                if (this.end && this.checkDate(this.end)) {
                    let [endYear, endMonth] = this.end.split(this.separator);
                    this.endYear = parseInt(endYear);
                    this.endMonth = parseInt(endMonth);
                } else {
                    this.endYear = this.maxYear;
                    this.endMonth = 12;
                }
            },
            // 显示日历
            showCalendar(event){
                let win_height = window.innerHeight;
                let top = event.target.getBoundingClientRect().top;
                this.listTop = top > 300 && (top + 290) > 0.99 * win_height;
                this.show = true;
                this.init(this.time ? this.chooseTime : this.chooseDate);
            },
            // 隐藏日历
            hideCalendar(){
                this.show = false;
            },
            // 小于起始时间的禁止点击
            lessStart(day){
                if (this.start && this.checkDate(this.start)) {
                    let start = new Date(this.changeDate(this.start)).getTime();
                    let now = new Date(this.year, this.month - 1, day).getTime();
                    return now < start;
                } else {
                    return false;
                }
            },
            // 大于结束时间的禁止点击
            greaterEnd(day){
                if (this.end && this.checkDate(this.end)) {
                    let end = new Date(this.changeDate(this.end)).getTime();
                    let now = new Date(this.year, this.month - 1, day).getTime();
                    return now > end;
                } else {
                    return false;
                }
            },
            // 点击年份
            showYear(event){
                this.showYearList = true;
                this.showMonthList = false;
                this.showHourList = false;
                this.showMinuteList = false;
                this.showSecondList = false;
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    let ipt_dom = event.target;
                    let list_dom = ipt_dom.nextElementSibling;
                    let li_height = list_dom.firstElementChild.clientHeight;
                    let index = this.yearList.findIndex(item => item == this.year);
                    list_dom.scrollTop = li_height * Math.floor(index / 2);
                }, 10);
            },
            // 选择年份
            chooseYear(year){
                this.year = year;
                this.showYearList = false;
            },
            // 点击月份
            showMonth(){
                this.showYearList = false;
                this.showMonthList = true;
                this.showHourList = false;
                this.showMinuteList = false;
                this.showSecondList = false;
            },
            // 选择月份
            chooseMonth(index){
                this.month = index + 1;
                this.showMonthList = false;
            },
            // 点击小时
            showHour(event){
                this.showYearList = false;
                this.showMonthList = false;
                this.showHourList = true;
                this.showMinuteList = false;
                this.showSecondList = false;
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    let ipt_dom = event.target;
                    let list_dom = ipt_dom.nextElementSibling;
                    let li_height = list_dom.firstElementChild.clientHeight;
                    let index = parseInt(this.hour);
                    list_dom.scrollTop = li_height * index;
                }, 10);
            },
            // 选择小时
            chooseHour(hour){
                this.hour = hour;
                this.showHourList = false;
            },
            // 点击分钟
            showMinute(event){
                this.showYearList = false;
                this.showMonthList = false;
                this.showHourList = false;
                this.showMinuteList = true;
                this.showSecondList = false;
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    let ipt_dom = event.target;
                    let list_dom = ipt_dom.nextElementSibling;
                    let li_height = list_dom.firstElementChild.clientHeight;
                    let index = parseInt(this.minute);
                    list_dom.scrollTop = li_height * index;
                }, 10);
            },
            // 选择分钟
            chooseMinute(minute){
                this.minute = minute;
                this.showMinuteList = false;
            },
            // 点击秒
            showSecond(event){
                this.showYearList = false;
                this.showMonthList = false;
                this.showHourList = false;
                this.showMinuteList = false;
                this.showSecondList = true;
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    let ipt_dom = event.target;
                    let list_dom = ipt_dom.nextElementSibling;
                    let li_height = list_dom.firstElementChild.clientHeight;
                    let index = parseInt(this.second);
                    list_dom.scrollTop = li_height * index;
                }, 10);
            },
            // 选择秒
            chooseSecond(second){
                this.second = second;
                this.showSecondList = false;
            },
            // 收起所有下拉选择
            hideListDown(){
                this.showYearList = false;
                this.showMonthList = false;
                this.showHourList = false;
                this.showMinuteList = false;
                this.showSecondList = false;
            },
            // 上一个月
            monthPrev(){
                if (this.prevMonthAble) {
                    this.month--;
                    if (this.month < 1) {
                        this.month = 12;
                        this.year--;
                    }
                }
            },
            // 下一个月
            monthNext(){
                if (this.nextMonthAble) {
                    this.month++;
                    if (this.month > 12) {
                        this.month = 1;
                        this.year++;
                    }
                }
            },
            // 上一年
            yearPrev(){
                if (this.prevYearAble) {
                    this.year--;
                }
            },
            // 下一年
            yearNext(){
                if (this.nextYearAble) {
                    this.year++;
                }
            },
            // 选择日期
            choose(date){
                this.chooseDate = this.year + this.separator + format(this.month) + this.separator + format(date);
                this.chooseTime = `${this.chooseDate} ${this.hour}:${this.minute}:${this.second}`;
                if (!this.time) {
                    this.show = false;
                }
                this.$emit('update:date', this.time ? this.chooseTime : this.chooseDate);
            },
            // 点击今天
            chooseToday(){
                this.getToday();
                this.show = false;
                this.$emit('update:date', this.chooseDate);
            },
            // 时间选择时点击确定
            ensure(){
                this.chooseTime = this.chooseDate ? `${this.chooseDate} ${this.hour}:${this.minute}:${this.second}` : '';
                this.hideCalendar();
                this.$emit('update:date', this.chooseTime);
            },
            // 清空
            clear(){
                this.chooseDate = '';
                this.chooseTime = '';
                this.hideCalendar();
                this.$emit('update:date', '');
            }
        }
    }
</script>

<style lang="scss" type="text/scss">
    @import '../../common/scss/base/variables';
    @import '../../common/scss/base/mixin';
    
    $header-height: 36px;
    $arrow-height: 8px;
    $index-popup: 100;
    
    .slide-enter-active{
        transform: scaleY(1) rotateX(0deg);
        transition: all .2s ease;
    }
    
    .slide-leave-active{
        transform: scaleY(0) rotateX(-90deg);
        transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    
    .slide-enter{
        transform: scaleY(0) rotateX(90deg);
    }
    
    .calendar-wrap{
        position: relative;
        .calendar-date{
            position: relative;
            display: block;
            width: 100%;
            height: 28px;
            input[type='text']{
                position: relative;
                z-index: 2;
                width: 100%;
                height: 100%;
                border: 1px solid $border-color;
                border-radius: 2px;
                background: transparent;
                text-indent: .5em;
                font-size: 12px;
                box-sizing: border-box;
                cursor: pointer;
                &.active{
                    border-color: $theme !important;
                }
            }
            .calendar-icon{
                position: absolute;
                top: 7px;
                right: 5px;
                display: block;
                width: 16px;
                height: 16px;
                overflow: hidden;
                i{
                    position: relative;
                    display: block;
                    width: 16px;
                    height: 100%;
                    @include background('../images/calendar.png');
                    box-sizing: border-box;
                }
                &.active i{
                    width: 32px;
                    left: -16px;
                    border-right: 16px solid transparent;
                    -webkit-filter: drop-shadow(16px 0 0 $theme);
                    filter: drop-shadow(16px 0 0 $theme);
                }
            }
        }
        .calendar{
            position: absolute;
            top: 32px;
            left: 0;
            z-index: $index-popup;
            width: 280px;
            border: 2px solid $green;
            background: #fff;
            color: #111;
            transform-origin: top;
            line-height: 1em;
            &.calendar-top{
                top: auto;
                bottom: 32px;
                transform-origin: bottom;
            }
            .calendar-header{
                height: $header-height;
                background: $green;
                > div{
                    position: relative;
                    float: left;
                    width: 72px;
                    height: 24px;
                    margin: ($header-height - 24px) / 2 10px;
                    line-height: 1em;
                }
                .list-down{
                    position: absolute;
                    top: ($header-height + 24px) / 2;
                    left: 0;
                    z-index: $index-popup + 2;
                    width: 120px;
                    max-height: 120px;
                    background: #fff;
                    border: 1px solid #ccc;
                    overflow: auto;
                    transform-origin: top;
                    box-sizing: content-box;
                    li{
                        float: left;
                        width: 50%;
                        height: 20px;
                        line-height: 20px;
                        text-align: center;
                        cursor: pointer;
                        &:hover{
                            background: #ccc;
                        }
                        &.active{
                            background: $green;
                            color: #fff;
                        }
                    }
                }
                input{
                    width: 100%;
                    height: 100%;
                    border: 0;
                    background: #fff;
                    text-align: center;
                    cursor: pointer;
                }
                a{
                    position: relative;
                    float: left;
                    width: 0;
                    height: 0;
                    margin: $header-height / 2 - $arrow-height 5px 0;
                    border-top: $arrow-height solid transparent;
                    border-bottom: $arrow-height solid transparent;
                    &[class *= 'prev']{
                        border-right: $arrow-height solid #fff;
                        &[disabled]{
                            border-right-color: #ccc;
                            cursor: default;
                        }
                    }
                    &[class *= 'next']{
                        border-left: $arrow-height solid #fff;
                        &[disabled]{
                            border-left-color: #ccc;
                            cursor: default;
                        }
                    }
                }
                .year-prev{
                    margin-left: 15px;
                    &[disabled]:after{
                        border-right-color: #ccc;
                    }
                    &:after{
                        content: '';
                        display: block;
                        width: 0;
                        height: 0;
                        border-top: $arrow-height solid transparent;
                        border-bottom: $arrow-height solid transparent;
                        border-right: $arrow-height solid #fff;
                        position: absolute;
                        top: -$arrow-height;
                        left: 2px - $arrow-height;
                    }
                }
                .year-next{
                    margin-right: 15px;
                    &[disabled]:after{
                        border-left-color: #ccc;
                    }
                    &:after{
                        content: '';
                        display: block;
                        width: 0;
                        height: 0;
                        border-top: $arrow-height solid transparent;
                        border-bottom: $arrow-height solid transparent;
                        border-left: $arrow-height solid #fff;
                        position: absolute;
                        top: -$arrow-height;
                        right: 2px - $arrow-height;
                    }
                }
            }
            .calendar-body{
                position: relative;
                border-top: 2px solid #fff;
                border-bottom: 2px solid #fff;
                table{
                    text-align: center;
                    vertical-align: middle;
                    th{
                        width: 40px;
                        height: 24px;
                    }
                    td{
                        height: 24px;
                        input{
                            width: 100%;
                            height: 100%;
                            border: 1px solid #fff;
                            background: transparent;
                            text-align: center;
                            color: $green;
                            box-sizing: border-box;;
                            cursor: pointer;
                            &:hover{
                                background: #f2f3f4;
                            }
                            &:disabled{
                                color: #666;
                                cursor: default;
                                &:hover{
                                    background: transparent;
                                }
                            }
                            &.active{
                                background: $green;
                                color: #fff;
                                &:hover{
                                    background: $green;
                                }
                            }
                        }
                    }
                }
                .mask-list-down{
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: $index-popup + 1;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, 0);
                }
            }
            .calendar-footer{
                padding: 5px 10px;
                background: $green;
                text-align: center;
                input[type = 'button']{
                    height: 24px;
                    margin: 0 5px;
                    padding: 0 15px;
                    border: 1px solid rgba(255, 255, 255, .1);
                    background: rgba(255, 255, 255, 0);
                    color: rgba(255, 255, 255, .8);
                    line-height: 22px;
                    font-size: 12px;
                    box-sizing: border-box;
                    cursor: pointer;
                    &:hover{
                        background: rgba(255, 255, 255, .1);
                        color: #fff;
                    }
                    &:disabled{
                        background: rgba(0, 0, 0, .1);
                        color: rgba(255, 255, 255, .5);
                        cursor: default;
                    }
                }
                &.time{
                    @include clearfix();
                    span{
                        float: left;
                        margin: 0 5px;
                        height: 24px;
                        line-height: 24px;
                        color: #fff;
                        font-weight: bold;
                    }
                    input[type='button']{
                        height: 24px;
                        padding: 0;
                        margin: 0 0 0 8px;
                        border: 0;
                    }
                    .calendar-time{
                        position: relative;
                        float: left;
                        width: 50px;
                        height: 24px;
                        input[type='text']{
                            width: 100%;
                            height: 100%;
                            border-radius: 2px;
                            border: 0;
                            background: #fff;
                            font-size: 14px;
                            text-align: center;
                            &:focus{
                                border-color: $green;
                            }
                        }
                        .list-down{
                            position: absolute;
                            bottom: 26px;
                            left: 0;
                            z-index: $index-popup + 2;
                            width: 100%;
                            max-height: 160px;
                            background: #fff;
                            border: 1px solid #ccc;
                            overflow: auto;
                            transform-origin: bottom;
                            box-sizing: content-box;
                            li{
                                width: 100%;
                                height: 20px;
                                line-height: 20px;
                                text-align: center;
                                cursor: pointer;
                                &:hover{
                                    background: #ccc;
                                }
                                &.active{
                                    background: $green;
                                    color: #fff;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    .mask-opacity{
        position: fixed;
        top: 0;
        left: 0;
        z-index: $index-popup - 1;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0);
    }
</style>