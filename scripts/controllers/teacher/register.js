/**
 * Created by Lingban on 2016/9/12.
 */
// 注册
lbApp.controller('TeacherRegController', ['$scope', '$rootScope', 'RequestService', 'UtilsService', function($scope, $rootScope, RequestService, UtilsService) {
    "use strict";

    // 注册信息
    $scope.t_regInfo = {
        phoneNumber:'',
        email: '', // 邮箱
        password: '', // 密码
        chineseName:'',
        schoolName:'北京大学'
    };

    /**
     * 注册
     */
    $scope.t_reg = function() {
        //密码base64加密
        var encode = new Base64();
        $scope.t_regInfo.passwordTemp = encode.encode($scope.t_regInfo.password);
        console.log($scope.t_regInfo);
        RequestService.request({
            token: 't_reg',
            method: 'POST',
            data: UtilsService.serialize({phoneNumber:$scope.t_regInfo.phoneNumber,email:$scope.t_regInfo.email,password:$scope.t_regInfo.passwordTemp,chineseName:$scope.t_regInfo.chineseName,schoolName:$scope.t_regInfo.schoolName}),
            success: function(data) {
                console.log(data);
                alert("注册成功");
                UtilsService.href('/teacher/login');
            },
            sRegister:function(data){
                alert("该邮箱已注册，请重新输入");

            }
        });
    };


}]);