// 登录
lbApp.controller('LoginController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    "use strict";
    // 密码登录信息
    $scope.pwdLoginInfo = {
        userName: '',
        password: ''
    };


    UtilsService.genTabs($scope, 'tabLogin');
    
    //$scope.getCodeText = '获取语音验证码';
    //$scope.isCalling = false;

    /**
     * 密码登录
     */
    $scope.loginByPwd = function() {
        RequestService.request({
            token: 't_login',
            method: 'POST',
            data: UtilsService.serialize($scope.pwdLoginInfo),
            success: function(data) {
                alert("登录成功");
                UtilsService.href('/classList');
            }
        });
    };

    /**
     * 动态密码登录
     */
    $scope.loginByCode = function() {
        RequestService.request({
            token: 'tk_loginByVV',
            method: 'POST',
            data: UtilsService.serialize($scope.verifyCodeInfo),
            success: function(data) {
                UtilsService.href('/profile');
            }
        })
    };
}]);

// 注册
lbApp.controller('RegController', ['$scope', '$rootScope', 'RequestService', 'UtilsService', function($scope, $rootScope, RequestService, UtilsService) {
    "use strict";

    // 注册信息
    $scope.t_regInfo = {
        phoneNumber:'',
        email: '', // 邮箱
        password: '', // 密码
        chineseName:''
    };
    /**
     * 注册
     */
    $scope.t_reg = function() {
        RequestService.request({
            token: 't_reg',
            method: 'POST',
            data: UtilsService.serialize($scope.t_regInfo),
            success: function(data) {
                console.log(data);
                alert("注册成功");
                UtilsService.href('/classList');
            }
        });
    };
    

}]);

