/**
 * 工具类服务
 */
lbApp.factory('UtilsService', ['$window', '$location', '$rootScope', function($window, $location, $rootScope) {
    "use strict";
    return {
        href: function(url) {
            console.log(url);
            if (url) {
                $location.path(url);
            }
        },
        /**
         * 获取url中的参数
         * 
         * @param paramName
         * @returns {*|string}
         */
        getUrlParam: function(paramName) {
            var params = $location.search();
            console.log(params);
            return params[paramName] || '';
        },
        /**
         * tab页
         *
         * @param $scope
         * @param tabId
         */
        genTabs: function($scope, tabId) {
            $scope.selectTab = function(tabId, index, callback) {
                if ($scope[tabId] === index) {
                    return;
                }
                $scope[tabId] = index;
                callback && callback();
            };
            $scope[tabId] = 1;
        },
        /**
         * 绑定弹框事件
         *
         * @param $scope
         */
        initPop: function($scope) {
            $scope.popName = '';
            $scope.openPop = function(id) {
                $('#trans-bg').show();
                var $pop = $('#' + id);
                $pop.css({top: ($(window).height() - $pop.height())/2}).show();
                $scope.popName = id;
            };
            $scope.closePop = function(id) {
                $('#trans-bg').hide();
                $('#' + id).hide();
            };
        },
        /**
         * 延迟定时器，比如用于获取验证码后1分钟内不能再次获取
         * 
         * @param sec
         * @param callback
         */
        delayTimer: function(sec, callback) {
            var timer = 'timer' + (new Date()).getTime();
            timer = setInterval(function() {
                callback(sec--);
                if (sec == -1) {
                    clearInterval(timer);
                }
            }, 1000);
        },
        /**
         * 生成只执行一次的函数
         * 
         * @param fun
         * @returns {Function}
         */
        once: function(fun) {
            var isExecuted = false;
            return function() {
                if (!isExecuted) {
                    fun();
                    isExecuted = true;
                }
            }
        },
        /**
         * 序列化对象
         *
         * @param obj
         * @returns {*|ArrayBuffer|string|Array|Array.<T>|Blob}
         */
        serialize: function(obj, key) {
            var ret = '';
            function parse(obj, parent) {
                if (typeof obj === 'string') {
                    ret += '&' + parent + '=' +obj;
                    return;
                }
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
                            parse(obj[key], key);
                        } else if (Object.prototype.toString.call(obj[key]) === '[object Array]') {
                            for (var i = 0; i < obj[key].length; i++) {
                                parse(obj[key][i], key + '[' + i + ']');
                            }
                        } else {
                            ret += '&' + (parent ? parent + '.' : '') + key + '=' + obj[key];
                        }
                    }
                }
            }
            parse(obj, '');
            return ret.slice(1);
        },
        /**
         * 生成查询条件
         *
         * @param conditions
         * {
         *      common: {
         *          p1: v1,
         *          p2: v2
         *      },
         *      order: {
         *          orderByP3: 0|1|-1
         *      },
         *      pageInfo: {
         *          page: 1,
         *          pageSize: '10',
         *          totalPage: 0
         *      }
         * }
         * @returns {string}
         */
        genConditions: function(conditions) {
            function translate(num) {
                var orderMap = {
                    '0': '',
                    '1': ' asc',
                    '-1': ' desc'
                };
                return orderMap['' + num];
            }

            var ret = '';
            if (conditions.common) {
                for (var key in conditions.common) {
                    if (conditions.common[key] != '') {
                        ret += '&' + key + '=' + conditions.common[key];
                    }
                }
                ret = ret.slice(1);
            }
            var orderCondition = '';
            if (conditions.order) {
                for (var key in conditions.order) {
                    if (conditions.order[key] != 0) {
                        orderCondition += ',' + key + translate(conditions.order[key]);
                    }
                }
                if (orderCondition !== '') {
                    ret += (ret === '' ? '' : '&') + 'orderBy=' + orderCondition.slice(1);
                }
            }
            if (conditions.pageInfo) {
                ret += (ret === '' ? '' : '&') + 'pageNum=' + conditions.pageInfo.page + '&pageSize=' + conditions.pageInfo.pageSize;
            }
            return ret;
        },
        changeOrder: function(num) {
            if (num == 0) {
                return 1;
            } else {
                return -num;
            }
        }
    };
}]);