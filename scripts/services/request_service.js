/**
 * 请求服务
 */
lbApp.factory('RequestService', ['$http', 'UtilsService', function($http, UtilsService) {
    "use strict";
    var baseUrl = '/t';
    var tokenMap = {
        // 提交注册信息
        //'tk_reg': '/companyInfo',
        // 校验邮箱
        //'tk_verifyEmail': '/checkemail',
        // 获取用户信息
        //'tk_currentUser': '/currentUser',
        // 登录
        //'tk_login': '/login',
        // 重新设置密码
        //'tk_resetPwd': '/change/pwd',
        // 退出
        //'tk_logout': '/logout',
        // 获取企业和个人信息
        //'tk_profile': '/personalCenterPage',
        //获取课程章节列表
        'lb_subjectTemplate':'/subjectTemplates'
    };
    return {
        tokenMap: tokenMap,
        request: function(reqConfig) {
            var url = tokenMap[reqConfig.token];
            if (!url) {
                console.log('请求token错误');
                return;
            }
            // 替换url中的占位符参数
            if (reqConfig.params) {
                console.log(reqConfig.params);
                for(var key in reqConfig.params) {
                    url = url.replace(':' + key, reqConfig.params[key]);
                }
            }

            // strParams为url上的参数
            if (reqConfig.strParams) {
                url += '?' + reqConfig.strParams;
            }
            // 判断是否加载loading动画, 在url上加上loading参数用于拦截器进行判断，当发出请求时使用loading动画，当返回响应时去掉loading动画
            if (reqConfig.loading) {
                url += url.indexOf('?') > -1 ? '&' : '?' + 'loading=1';
            }
            // 请求的对象
            var reqObj = {
                url: "http://www.csl.pi/data/a.json",
                //method: reqConfig.method || 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            // body中的数据
            if(reqConfig.data) {
                reqObj.data = reqConfig.data;
            }
            // 发送请求
            $http(reqObj)
                .success(function(data, status, headers, config) {
                    console.log(data);
                    if (/5\d{2}/.test(status)) {
                        //alert('服务器出错');
                        return;
                    }
                    switch (data.code) {
                        case 0:
                            reqConfig.success(data.result);
                            break;
                        case 10010:
                            UtilsService.href('/login');
                            break;
                        case 10073:
                            alert('请您先到注册邮箱中点击链接进行验证');
                            UtilsService.href('/login');
                            break;
                        case 10074:
                            alert('请到个人中心提交营业执照进行审核');
                            UtilsService.href('/profile');
                            break;
                        default:
                            reqConfig.error && reqConfig.error(data);
                            alert(data.msg);
                    }
                })
                .error(function(data, status, headers, config) {
                    reqConfig.error && reqConfig.error(data);
                })
        }
    };
}]);