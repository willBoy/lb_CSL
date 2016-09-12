/**
 * Created by Lingban on 2016/9/12.
 */
// 修改密码
lbApp.controller('StudentEditPwdController', ['$rootScope', '$scope', '$routeParams', 'UtilsService', 'RequestService', function ($rootScope, $scope, $routeParams, UtilsService, RequestService) {
    //
    "use strict";
    // 设置边栏
    $scope.asideTab = {
        listName: 'student',
        tabName: 'tabName'
    };
    $scope.password = {
        'oldPassword': '',
        'newPassword': ''
    };
    RequestService.request({
        token:'s_profile',
        method:'GET',
        success:function(){

        }
    })

    //密码base64加密

    $scope.submitPassword = function () {
        var encode = new Base64();
        $scope.password.oldPasswordTemp = encode.encode($scope.password.oldPassword);
        $scope.password.newPasswordTemp = encode.encode($scope.password.newPassword);
        RequestService.request({
            token: 's_editPwd',
            method: 'POST',
            data: UtilsService.serialize({oldPassword:$scope.password.oldPasswordTemp,newPassword:$scope.password.newPasswordTemp}),
            loading: true,
            success: function (data) {
                alert('修改成功，请重新登录');
                UtilsService.href('/student/login');
            },
            password:function(data){
                alert(data);
                var decode = new Base64();
                $scope.password.oldPassword = decode.decode($scope.password.oldPasswordTemp);
                $scope.password.newPassword = decode.decode($scope.password.newPasswordTemp);
            }
        })
    }

}]);