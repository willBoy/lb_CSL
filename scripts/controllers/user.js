// 教师登录
lbApp.controller('LoginController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
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
                UtilsService.href('/classList');
            },
            password:function(data){
                alert('用户名或者密码错误，请重新输入');
                var decode = new Base64();
                $scope.pwdLoginInfo.password = decode.decode($scope.passwordTemp);
            }
        });
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
                UtilsService.href('/t_login');
            },
            sRegister:function(data){
                alert("该邮箱已注册，请重新输入");

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
                UtilsService.href('/s_login');
            },
            sRegister:function(data){
                alert('该邮箱已存在，请重新输入');
                var decode = new Base64();
                $scope.s_regInfo.password = decode.decode($scope.RPasswordTemp);
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

