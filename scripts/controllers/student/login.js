// login
// 学生登录
lbApp.controller('StudentLoginController', ['$scope','$rootScope', 'UtilsService', 'RequestService', function($scope,$rootScope, UtilsService, RequestService) {
    "use strict";
    // 密码登录信息
    $scope.student_login = {
        userName: '531402593@qq.com',
        password: '123456'
    };

    //密码base64加密

    UtilsService.genTabs($scope, 'tabLogin');

    //$scope.getCodeText = '获取语音验证码';
    //$scope.isCalling = false;

    /**
     * 密码登录
     */
    $scope.s_loginByPwd = function() {
        var encode = new Base64();
        $scope.tPasswordTemp = encode.encode($scope.student_login.password);
        RequestService.request({
            token: 's_login',
            method: 'POST',
            data: UtilsService.serialize({userName:$scope.student_login.userName,password:$scope.tPasswordTemp}),
            success: function(data) {
                $rootScope.currentUser = data;
                $scope.dataTest = data;
                UtilsService.href('/student/course');
            },
            password:function(data){
                alert('用户名或者密码错误，请重新输入');
                var decode = new Base64();
                $scope.student_login.password = decode.decode($scope.tPasswordTemp);
            }
        });
    };

}]);

