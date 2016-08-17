/**
 * 拦截器
 */
lbApp.factory('InterceptorService', ['$q', '$location', '$rootScope', 'UtilsService', function($q, $location, $rootScope, UtilsService) {
    "use strict";
    return {
        request: function(config) {
            if (config.url.indexOf('loading=1') > -1) {
                $rootScope.loading = true;
            }
            return config;
        },
        response: function(res) {
            var url = res.config.url,
                data = res.data;
            // 如果有loading标志，就去掉loading
            if (url.indexOf('loading=1') > -1) {
                $rootScope.loading =false;
            }
            // 开发时会返回模板字符串，这种情况就不做处理了
            if (typeof data == 'string') {
                return res;
            }
            
            // 如果结果中有登录用户，则保存下来
            if (data.result && data.result.currUser) {
                $rootScope.currentUser = data.result.currUser;
            }
            return res;
        },
        requestError: function(rejectoin) {
            return $q.reject(rejectoin);
        },
        responseError: function(rejection) {
            return rejection;
        }
    };
}]);