(function ($) {
    /**
     * Jtime构造函数
     *
     * @param options
     * @constructor
     */
    function Jtime(options) {
        if (options.time) {
            this.hour = options.time.hour;
            this.minute = options.time.minute;
        } else {
            this.hour = '00';
            this.minute = '00';
        }
        this.callback = options.callback;
        this.$jt = _initTimeHtml(this);
    }
    // Jtime计数器
    Jtime.id = 0;
    // Jtime原型
    Jtime.prototype = {
        /**
         * 设置小时
         *
         * @param hour
         */
        setHour: function(hour) {
            this.hour = hour;
        },
        /**
         * 增加1小时
         */
        addHour: function() {
            if (this.hour == '23') {
                this.hour = '00';
            } else {
                this.hour = 1 + parseInt(this.hour);
                this.hour = (this.hour < 10 ? '0' : '') + this.hour;
            }
        },
        /**
         * 减少1小时
         */
        subHour: function() {
            if (this.hour == '00') {
                this.hour = '23';
            } else {
                this.hour = parseInt(this.hour) - 1;
                this.hour = (this.hour < 10 ? '0' : '') + this.hour;
            }
        },
        /**
         * 设置分钟数
         *
         * @param minute
         */
        setMinute: function(minute) {
            this.minute = minute;
        },
        /**
         * 增加1分钟
         */
        addMinute: function() {
            if (this.minute == '59') {
                this.minute = '00';
            } else {
                this.minute = 1 + parseInt(this.minute);
                this.minute = (this.minute < 10 ? '0' : '') + this.minute;
            }
        },
        /**
         * 减少1分钟
         */
        subMinute: function() {
            if (this.minute == '00') {
                this.minute = '59';
            } else {
                this.minute = parseInt(this.minute) - 1;
                this.minute = (this.minute < 10 ? '0' : '') + this.minute;
            }
        }
    };

    function _initTimeHtml(jtime) {
        var jId = 'jtime-' + ++Jtime.id;
        var timeHtml = "<div id='" + jId + "' class='jtime'>" +
            "<div class='main'>" +
            "<div class='row spacefix'>" +
            "<div class='col-5'><div class='hour-plus btn-wrapper'><span class='up-arrow'></span></div></div>" +
            "<div class='col-2'></div>" +
            "<div class='col-5'><div class='minute-plus btn-wrapper'><span class='up-arrow'></span></div></div>" +
            "</div>" +
            "<div class='row spacefix'>" +
            "<div class='col-5'><span class='time jt-hour'></span></div>" +
            "<div class='col-2'><span class='colon'>:</span></div>" +
            "<div class='col-5'><span class='time jt-minute'></span></div>" +
            "</div>" +
            "<div class='row spacefix'>" +
            "<div class='col-5'><div class='hour-sub btn-wrapper'><span class='down-arrow'></span></div></div>" +
            "<div class='col-2'><span class='btn-confirm'>OK</span></div>" +
            "<div class='col-5'><div class='minute-sub btn-wrapper'><span class='down-arrow'></span></div></div>" +
            "</div>" +
            "</div>" +
            "<div class='hour-select'>" +
            "<div class='row'>" +
            "<div class='col-2'><span class='hour-minute hour-00'>00</span></div>" +
            "<div class='col-2'><span class='hour-minute hour-01'>01</span></div>" +
            "<div class='col-2'><span class='hour-minute hour-02'>02</span></div>" +
            "<div class='col-2'><span class='hour-minute hour-03'>03</span></div>" +
            "<div class='col-2'><span class='hour-minute hour-04'>04</span></div>" +
            "<div class='col-2'><span class='hour-minute hour-05'>05</span></div>" +
            "</div>" +
            "<div class='row'>" +
            "<div class='col-2'><span class='hour-minute hour-06'>06</span></div>" +
            "<div class='col-2'><span class='hour-minute hour-07'>07</span></div>" +
            "<div class='col-2'><span class='hour-minute hour-08'>08</span></div>" +
            "<div class='col-2'><span class='hour-minute hour-09'>09</span></div>" +
            "<div class='col-2'><span class='hour-minute hour-10'>10</span></div>" +
            "<div class='col-2'><span class='hour-minute hour-11'>11</span></div>" +
            "</div>" +
            "<div class='row'>" +
            "<div class='col-2'><span class='hour-minute hour-12'>12</span></div>" +
            "<div class='col-2'><span class='hour-minute hour-13'>13</span></div>" +
            "<div class='col-2'><span class='hour-minute hour-14'>14</span></div>" +
            "<div class='col-2'><span class='hour-minute hour-15'>15</span></div>" +
            "<div class='col-2'><span class='hour-minute hour-16'>16</span></div>" +
            "<div class='col-2'><span class='hour-minute hour-17'>17</span></div>" +
            "</div>" +
            "<div class='row'>" +
            "<div class='col-2'><span class='hour-minute hour-18'>18</span></div>" +
            "<div class='col-2'><span class='hour-minute hour-19'>19</span></div>" +
            "<div class='col-2'><span class='hour-minute hour-20'>20</span></div>" +
            "<div class='col-2'><span class='hour-minute hour-21'>21</span></div>" +
            "<div class='col-2'><span class='hour-minute hour-22'>22</span></div>" +
            "<div class='col-2'><span class='hour-minute hour-23'>23</span></div>" +
            "</div>" +
            "</div>" +
            "<div class='minute-select'>" +
            "<div class='row'>" +
            "<div class='col-2'><span class='hour-minute minute-00'>00</span></div>" +
            "<div class='col-2'><span class='hour-minute minute-05'>05</span></div>" +
            "<div class='col-2'><span class='hour-minute minute-10'>10</span></div>" +
            "<div class='col-2'><span class='hour-minute minute-15'>15</span></div>" +
            "<div class='col-2'><span class='hour-minute minute-20'>20</span></div>" +
            "<div class='col-2'><span class='hour-minute minute-25'>25</span></div>" +
            "</div>" +
            "<div class='row'>" +
            "<div class='col-2'><span class='hour-minute minute-30'>30</span></div>" +
            "<div class='col-2'><span class='hour-minute minute-35'>35</span></div>" +
            "<div class='col-2'><span class='hour-minute minute-40'>40</span></div>" +
            "<div class='col-2'><span class='hour-minute minute-45'>45</span></div>" +
            "<div class='col-2'><span class='hour-minute minute-50'>50</span></div>" +
            "<div class='col-2'><span class='hour-minute minute-55'>55</span></div>" +
            "</div>" +
            "</div>" +
            "</div>";
        $('body').append(timeHtml);
        var $jtime = $('#' + jId);
        $jtime.find('.jt-hour').text(jtime.hour);
        $jtime.find('.jt-minute').text(jtime.minute);
        $jtime.find('.hour-select .hour-' + jtime.hour).addClass('selected');
        $jtime.find('.minute-select .minute-' + jtime.minute).addClass('selected');

        // 绑定增加1小时
        $jtime.on('click', '.hour-plus', function () {
            jtime.addHour();
            $jtime.find('.jt-hour').text(jtime.hour);
            $jtime.find('.hour-select .selected').removeClass('selected');
            $jtime.find('.hour-select .hour-' + this.hour).addClass('selected');
        });
        // 绑定减少1小时的事件
        $jtime.on('click', '.hour-sub', function() {
            jtime.subHour();
            $jtime.find('.jt-hour').text(jtime.hour);
            $jtime.find('.hour-select .selected').removeClass('selected');
            $jtime.find('.hour-select .hour-' + jtime.hour).addClass('selected');
        });

        // 绑定增加1分钟
        $jtime.on('click', '.minute-plus', function() {
            jtime.addMinute();
            $jtime.find('.jt-minute').text(jtime.minute);
            $jtime.find('.minute-select .selected').removeClass('selected');
            $jtime.find('.minute-select .minute-' + jtime.minute).addClass('selected');
        });
        // 绑定减少1分钟
        $jtime.on('click', '.minute-sub', function() {
            jtime.subMinute();
            $jtime.find('.jt-minute').text(jtime.minute);
            $jtime.find('.minute-select .selected').removeClass('selected');
            $jtime.find('.minute-select .minute-' + jtime.minute).addClass('selected');
        });

        // 绑定单击小时的事件
        $jtime.on('click', '.jt-hour', function() {
            $jtime.find('.main').hide();
            $jtime.find('.hour-select').show();
        });
        // 绑定单击分钟的事件
        $jtime.on('click', '.jt-minute', function() {
            $jtime.find('.main').hide();
            $jtime.find('.minute-select').show();
        });
        // 绑定选择小时的事件
        $jtime.on('click', '.hour-select .hour-minute', function() {
            var hour = $(this).text();
            $jtime.find('.hour-select .selected').removeClass('selected');
            $(this).addClass('selected');
            jtime.setHour(hour);
            $jtime.find('.jt-hour').text(hour);
            $jtime.find('.hour-select').hide();
            $jtime.find('.main').show();
        });
        // 绑定选择分钟的事件
        $jtime.on('click', '.minute-select .hour-minute', function() {
            var minute = $(this).text();
            $jtime.find('.minute-select .selected').removeClass('selected');
            $(this).addClass('selected');
            jtime.setMinute(minute);
            $jtime.find('.jt-minute').text(minute);
            $jtime.find('.minute-select').hide();
            $jtime.find('.main').show();
        });
        // 绑定OK按钮
        $jtime.on('click', '.btn-confirm', function() {
            jtime.callback(jtime.hour + ':' + jtime.minute);
            $jtime.hide();
        });
        // 阻止冒泡
        $jtime.on('click', function (e) {
            e.stopPropagation();
        });
        return $jtime;
    }

    // 扩展jQuery的方法
    $.prototype.jtime = function(options) {
        var that = $(this);
        that.jt = new Jtime(options);
        var $jt = that.jt.$jt;
        that.on('click', function(e) {
            $('.jtime').hide();
            $jt.css({left: that.offset().left, top: that.offset().top + that.height() + 5}).show();
            e.stopPropagation();
        });
        $('body').on('click', function() {
            $jt.hide();
        });
    };
})(jQuery);