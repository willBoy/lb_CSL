(function($) {
    "use strict";
    /**
     * 日历构造函数
     *
     * @param options
     * 可选项为
     *      selectedDate: {Date}
     *      disableFn: {Function(Date)} 返回boolean
     *      callback: {Function('2015-2-1')}选择日期后的回调函数
     * @constructor
     */
    function Jdatepicker(options) {
        var now = new Date();
        var selectedDate = options.selectedDate || {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
        this.year = selectedDate.year;
        this.month = selectedDate.month;
        this.selectedDate = {
            year: selectedDate.year,
            month: selectedDate.month,
            day: selectedDate.day
        };
        this.dateList = _generateDateList(this.year, this.month);
        this.disableFn = options.disableFn || function() {return false;};
        this.callback = options.callback || function() {};
        this.$jdp = _initDatepicker(this);
    }
    Jdatepicker.id = 0;

    Jdatepicker.prototype = {
        /**
         * 设置为上个月
         */
        prevMonth: function() {
            var prevYearAndMonth = _getPrev(this.year, this.month);
            this.year = prevYearAndMonth.year;
            this.month = prevYearAndMonth.month;
            this.dateList = _generateDateList(this.year, this.month);
        },
        /**
         * 设置为下个月
         */
        nextMonth: function() {
            var nextYearAndMonth = _getNext(this.year, this.month);
            this.year = nextYearAndMonth.year;
            this.month = nextYearAndMonth.month;
            this.dateList = _generateDateList(this.year, this.month);
        },
        /**
         * 选择日期
         *
         * @param year
         * @param month
         * @param day
         */
        selectDate: function(year, month, day) {
            this.year = year;
            this.month = month;
            this.selectedDate = {
                year: year,
                month: month,
                day: day
            };
        }
    };

    /**
     * 获取指定年份和月份的日期列表
     *
     * @param year
     * @param month
     * @returns {Array}
     * @private
     */
    function _generateDateList(year, month) {
        year = parseInt(year);
        month = parseInt(month);
        // 当月1号的星期
        var index = (new Date(year, month - 1, 1)).getDay();
        // 当月的天数
        var monthDays = _getMonthDays(year, month);
        // 上个月的年份、月份和天数
        var prevYearAndMonth = _getPrev(year, month);
        var prevMonthDays = _getMonthDays(prevYearAndMonth.year, prevYearAndMonth.month);

        var ret = [];
        // 补全前一个月的日期
        for (var i = 0; i < index; i++) {
            ret.push({
                year: prevYearAndMonth.year,
                month: prevYearAndMonth.month,
                day: prevMonthDays - (index - i - 1),
                isCurrent: false
            });
        }
        // 存入当月的日期
        for (var i = 1; i <= monthDays; i++) {
            ret.push({
                year: year,
                month: month,
                day: i,
                isCurrent: true
            });
        }
        // 下个月的年份、月份和天数
        var nextMonthYear = year + 1;
        var nextYearAndMonth = _getNext(year, month);
        // 补全后一个月的日期
        var current = ret.length;
        for (var i = 1; current + i <= 42; i++) {
            ret.push({
                year: nextYearAndMonth.year,
                month: nextYearAndMonth.month,
                day: i,
                isCurrent: false
            });
        }
        return ret;
    }

    /**
     * 返回闰年的天数
     *
     * @param year
     * @param month
     * @returns {*}
     * @private
     */
    function _getMonthDays(year, month) {
        year = parseInt(year);
        month = '' + month;
        // 普通年份月份对应的天数
        var months = {
            '1': 31,
            '2': 28,
            '3': 31,
            '4': 30,
            '5': 31,
            '6': 30,
            '7': 31,
            '8': 31,
            '9': 30,
            '10': 31,
            '11': 30,
            '12': 31
        };
        // 如果是闰年的二月返回29天
        if (month === '2' && (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0))) {
            return 29;
        }
        return months[month];
    }

    /**
     * 获取下个月的年份和月份
     *
     * @param currentYear
     * @param currentMonth
     * @returns {{year: *, month: *}}
     * @private
     */
    function _getNext(currentYear, currentMonth) {
        var nextYear, nextMonth;
        if (currentMonth === 12) {
            nextYear = currentYear + 1;
            nextMonth = 1;
        } else {
            nextYear = currentYear;
            nextMonth = currentMonth + 1;
        }
        return {
            year: nextYear,
            month: nextMonth
        }
    }

    /**
     * 获取上个月的年份和月份
     *
     * @param currentYear
     * @param currentMonth
     * @returns {{year: *, month: *}}
     * @private
     */
    function _getPrev(currentYear, currentMonth) {
        var prevYear, prevMonth;
        if (currentMonth === 1) {
            prevYear = currentYear - 1;
            prevMonth = 12;
        } else {
            prevYear = currentYear;
            prevMonth = currentMonth - 1;
        }
        return {
            year: prevYear,
            month: prevMonth
        }
    }

    /**
     * 生成日期的html
     *
     * @param dateList
     * @param selectedDay {year: 2014, month: 2, day: 12}
     * @param disableFn
     * @returns {string}
     * @private
     */
    function _renderDaysHtml(dateList, selectedDay, disableFn) {
        var html = '';
        var dateListLength = dateList.length;
        var date, oneRowHtml = '';
        for (var i = 1; i <= dateListLength; i++) {
            date = dateList[i - 1];
            var d = new Date(date.year, date.month - 1, date.day);
            var isDisable = disableFn(d);
            var style = '';
            if (isDisable) {
                style = 'disabled';
            } else if (selectedDay.year == date.year && parseInt(selectedDay.month) === date.month && parseInt(selectedDay.day) == date.day) {
                style = 'selected';
            } else if (date.isCurrent) {
                style = 'current';
            }
            oneRowHtml += "<td class='day " + style + "' data-year='" + date.year + "' data-month='" + date.month + "' data-day='" + date.day + "'>" + date.day + "</td>";
            if ((i + 7) % 7 === 0) {
                html += "<tr>" + oneRowHtml + "</tr>";
                oneRowHtml = '';
            }
        }
        return html;
    }

    /**
     * 初始化日历选择框
     *
     * @private
     */
    function _initDatepicker(jdp) {
        var jId = 'jdp-' + ++Jdatepicker.id;
        var jdpHtml = "<div id='" + jId + "' class='jdatepicker'>" +
            "<table>" +
            "<thead>" +
            "<tr class='jdp-head'>" +
            "<th class='jdp-prev'>‹</th>" +
            "<th class='jdp-title' colspan='5'>" + jdp.year + '年' + jdp.month + '月' + "</th>" +
            "<th class='jdp-next'>›</th>" +
            "</tr>" +
            "<tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>" +
            "</thead>" +
            "<tbody>" + _renderDaysHtml(jdp.dateList, jdp.selectedDate, jdp.disableFn) + "</tbody>" +
            "</table>" +
            "</div>";
        $('body').append(jdpHtml);
        var $jdp = $('#' + jId);
        // 选择日期的事件
        $jdp.on('click', '.day', function() {
            var that = $(this);
            if (!that.hasClass('disabled')) {
                jdp.selectDate(that.data('year'), that.data('month'), that.data('day'));
                jdp.callback(that.data('year') + '-' + that.data('month') + '-' + that.data('day'));
                $jdp.hide();
            }
        });
        // 上一个月
        $jdp.on('click', '.jdp-prev', function() {
            jdp.prevMonth();
            $jdp.find('.jdp-title').text(jdp.year + '年' + jdp.month + '月');
            $jdp.find('tbody').html(_renderDaysHtml(jdp.dateList, jdp.selectedDate, jdp.disableFn));
        });
        // 下个月
        $jdp.on('click', '.jdp-next', function() {
            jdp.nextMonth();
            $jdp.find('.jdp-title').text(jdp.year + '年' + jdp.month + '月');
            $jdp.find('tbody').html(_renderDaysHtml(jdp.dateList, jdp.selectedDate, jdp.disableFn));
        });
        $jdp.on('click', function(e) {
            e.stopPropagation();
        });
        return $jdp;
    }

    /**
     * 扩展jQuery的方法
     *
     * @param options
     *      selectedDate: {year: 2014, month: 2, day: 20}
     *      disableFn: function(date) {return {boolean}}
     *      callback: function(dateString) {}
     */
    $.prototype.jdatepicker = function(options) {
        var that = $(this);
        that.jdp = new Jdatepicker(options);
        var $jdp = that.jdp.$jdp;
        that.on('click', function(e) {
            $('.jdatepicker').hide();
            $jdp.find('tbody').html(_renderDaysHtml(that.jdp.dateList, that.jdp.selectedDate, that.jdp.disableFn));
            $jdp.css({left: that.offset().left, top: that.offset().top + that.height() + 5}).show();
            e.stopPropagation();
        });
        $('body').on('click', function(e) {
            $jdp.hide();
        });
    };
})(jQuery);