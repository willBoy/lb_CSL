/**
 * Created by Lingban on 2016/9/12.
 */
// 学生注册
lbApp.controller('StudentRegController', ['$scope', '$rootScope', 'RequestService', 'UtilsService', function($scope, $rootScope, RequestService, UtilsService) {
    "use strict";

    // 注册信息
    $scope.s_regInfo = {
        phoneNumber:'',//电话
        email: '', // 邮箱
        password: '', // 密码
        chineseName:'',//中文名
        englishName:'',//英文名字
        age:'',//年龄
        gender:'0',//性别
        nationality:'',//国籍
        motherTongue:''//母语
    };

    /**
     * 注册
     */
    $scope.s_reg = function() {
        //密码base64加密
        var encode = new Base64();
        $scope.RPasswordTemp = encode.encode($scope.s_regInfo.password);
        console.log($scope.s_regInfo);
        RequestService.request({
            token: 's_reg',
            method: 'POST',
            data: UtilsService.serialize({phoneNumber:$scope.s_regInfo.phoneNumber,email:$scope.s_regInfo.email,password:$scope.RPasswordTemp,chineseName:$scope.s_regInfo.chineseName,englishName:$scope.s_regInfo.englishName,age:$scope.s_regInfo.age,gender:$scope.s_regInfo.gender,nationality:$scope.s_regInfo.nationality,motherTongue:$scope.s_regInfo.motherTongue}),
            success: function(data) {
                console.log(data);
                alert("学生注册成功");
                UtilsService.href('/student/login');
            },
            sRegister:function(data){
                alert('该邮箱已存在，请重新输入');
                var decode = new Base64();
                $scope.s_regInfo.password = decode.decode($scope.RPasswordTemp);
            }
        });
    };
}]);