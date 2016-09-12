/**
 * Created by Lingban on 2016/9/12.
 */
// 教师登录
lbApp.controller('TeacherLoginController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    "use strict";
    // 密码登录信息
    $scope.pwdLoginInfo = {
        userName: '531402593@qq.com',
        password: '123456'
    };
    //密码base64加密

    $scope.myFunction = function(){
        loginByPwd();
    };
    UtilsService.genTabs($scope, 'tabLogin');

    //$scope.getCodeText = '获取语音验证码';
    //$scope.isCalling = false;

    /**
     * 密码登录
     */
    $scope.loginByPwd = function() {
        var encode = new Base64();
        $scope.passwordTemp = encode.encode($scope.pwdLoginInfo.password);
        RequestService.request({
            token: 't_login',
            method: 'POST',
            data: UtilsService.serialize({userName:$scope.pwdLoginInfo.userName,password:$scope.passwordTemp}),
            success: function(data) {
                UtilsService.href('/teacher/classList');
            },
            password:function(data){
                alert('用户名或者密码错误，请重新输入');
                var decode = new Base64();
                $scope.pwdLoginInfo.password = decode.decode($scope.passwordTemp);
            }
        });
    };

}]);