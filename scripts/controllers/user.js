// 登录
lbApp.controller('LoginController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    "use strict";
    // 密码登录信息
    $scope.pwdLoginInfo = {
        userName: '',
        password: ''
    };
    // 动态密码登录
    $scope.verifyCodeInfo = {
        phone: '',
        code: ''
    };

    UtilsService.genTabs($scope, 'tabLogin');
    
    $scope.getCodeText = '获取语音验证码';
    $scope.isCalling = false;

    /**
     * 获取动态验证码
     */
    $scope.getCode = function() {
        if ($scope.isCalling) {
            return;
        }
        $scope.isCalling = true;
        RequestService.request({
            token: 'tk_getCodeByLogin',
            method: 'GET',
            strParams: 'phone=' + $scope.verifyCodeInfo.phone,
            success: function(data) {
                UtilsService.delayTimer(60, function(sec) {
                    $scope.$apply(function() {
                        if (sec == 0) {
                            $scope.getCodeText = '获取语音验证码';
                            $scope.isCalling = false;
                        } else {
                            $scope.getCodeText = sec + 's';
                        }
                    });
                });
                alert('正在给您拨打电话，请注意接听');
            },
            error: function() {
                $scope.isCalling = false;
            }
        });
    };
    /**
     * 密码登录
     */
    $scope.loginByPwd = function() {
        RequestService.request({
            token: 'tk_login',
            method: 'POST',
            data: UtilsService.serialize($scope.pwdLoginInfo),
            success: function(data) {
                UtilsService.href('/profile');
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
                alert(1);
                UtilsService.href('/classList');
            }
        });
    };
    

}]);

