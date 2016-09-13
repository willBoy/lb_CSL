/**
 * Created by Lingban on 2016/9/1.
 */
//教师端-修改密码
lbApp.controller('EditPwdController', ['$scope', '$routeParams', 'UtilsService', 'RequestService', function ($scope, $routeParams, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };

    //获取教师端用户信息，刷新页面header显示图标
    RequestService.request({
        token:'t_teachershow',
        method:'POST',
        success:function(){

        }
    });


    $scope.t_password = {
        oldPassword:'',
        newPassword:''
    }
    $scope.t_submitPassword = function(){
        var encode = new Base64();
        $scope.t_password.oldPasswordTmp = encode.encode($scope.t_password.oldPassword);
        $scope.t_password.newPasswordTmp = encode.encode($scope.t_password.newPassword);
        console.log($scope.t_password);
        RequestService.request({
            token:'t_updatePassword',
            method:'POST',
            data:UtilsService.serialize({oldPassword:$scope.t_password.oldPasswordTmp,newPassword:$scope.t_password.newPasswordTmp}),
            success:function(data){
                alert("密码修改成功，请重新登录");
                UtilsService.href('/');
            }
        })
    }


}]);
