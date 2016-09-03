
// 教师登录
lbApp.controller('LoginController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    "use strict";
    // 密码登录信息
    $scope.pwdLoginInfo = {
        userName: '531402593@qq.com',
        password: '123456'
    };

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
        console.log($scope.pwdLoginInfo);
        RequestService.request({
            token: 't_login',
            method: 'POST',
            data: UtilsService.serialize($scope.pwdLoginInfo),
            success: function(data) {
                /*$rootScope.currentUser = data;*/
                $rootScope.currentUserData.role = '03';
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
lbApp.controller('t_RegController', ['$scope', '$rootScope', 'RequestService', 'UtilsService', function($scope, $rootScope, RequestService, UtilsService) {
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
        RequestService.request({
            token: 't_reg',
            method: 'POST',
            data: UtilsService.serialize($scope.t_regInfo),
            success: function(data) {
                console.log(data);
                alert("注册成功");
                UtilsService.href('/t_login');
            }
        });
    };
    

}]);
// 学生登录
lbApp.controller('s_LoginController', ['$scope','$rootScope', 'UtilsService', 'RequestService', function($scope,$rootScope, UtilsService, RequestService) {
    "use strict";
    // 密码登录信息
    $scope.student_login = {
        userName: '531402593@qq.com',
        password: '123456'
    };


    UtilsService.genTabs($scope, 'tabLogin');

    //$scope.getCodeText = '获取语音验证码';
    //$scope.isCalling = false;

    /**
     * 密码登录
     */
    $scope.s_loginByPwd = function() {
        console.log($scope.student_login);
        RequestService.request({
            token: 's_login',
            method: 'POST',
            data: UtilsService.serialize($scope.student_login),
            success: function(data) {
                $rootScope.currentUser = data;
                $rootScope.currentUserData.role = '02';
                $scope.dataTest = data;
                UtilsService.href('/student/course');
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
// 学生注册
lbApp.controller('S_RegController', ['$scope', '$rootScope', 'RequestService', 'UtilsService', function($scope, $rootScope, RequestService, UtilsService) {
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
        console.log($scope.s_regInfo);
        RequestService.request({
            token: 's_reg',
            method: 'POST',
            data: UtilsService.serialize($scope.s_regInfo),
            success: function(data) {
                console.log(data);
                alert("学生注册成功");
                UtilsService.href('/s_login');
            }
        });
    };


}]);
lbApp.controller('updatePassword', ['$scope', '$rootScope', 'RequestService', 'UtilsService', function($scope, $rootScope, RequestService, UtilsService) {
    "use strict";

    // 绑定弹框事件
    UtilsService.initPop($scope);
    // 教师修改密码
    $scope.t_updatePassword = function(password) {
        RequestService.request({
            token: 't_updatePassword',
            method:'POST',
            strParams:'id='+$scope.currentUser.id+'&password='+password,
            /*data:UtilsService.serialize({classID:$routeParams.classID,studentId:$routeParams.studentId,remark:$scope.studentInfo_r.remark}),*/
            success:function(){
                alert("修改成功");
                $scope.closePop('pop-resetpwd')
            }
        });
    };


}]);

