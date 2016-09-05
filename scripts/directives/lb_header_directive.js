lbApp.directive('lbHeaderDirective', ['UtilsService','RequestService',function(UtilsService,RequestService){
    "use strict";
    return {
        restrict: 'A',
        replace: true,
        scope: true,
        templateUrl: 'views/directives/lb_header_directive.html',
        controller: function($scope,UtilsService, $element, $attrs, $transclude) {
            // 是否显示用户操作
            $scope.userOpIsShow = false;
            // 教师修改密码
            $scope.updatePassword = function(password) {
                RequestService.request({
                    token: 't_updatePassword',
                    method:'POST',
                    strParams:'id='+$scope.currentUser.id+'&password='+password,
                    success:function(){
                        alert("修改成功");
                        $scope.closePop('pop-updatePassword')
                    }
                });
            };
            //教师端-退出
            $scope.t_logout = function () {
                RequestService.request({
                    token: 't_logout',
                    method:'POST',
                    success:function(){
                        UtilsService.href('/');
                    }
                });
            };
            //学生端-退出
            $scope.s_logout = function () {
                RequestService.request({
                    token: 's_logout',
                    method:'POST',
                    success:function(){
                        UtilsService.href('/');
                    }
                });
            };
            var timer;
            $scope.showUserOp = function() {
                clearTimeout(timer);
                $scope.userOpIsShow = true;
            };
            $scope.hideUserOp = function() {
                timer = setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.userOpIsShow = false;
                    });
                }, 300);
            };

        }
    };

}]);
