lbApp.directive('lbHeaderTeacherDirective', ['UtilsService','RequestService',function(UtilsService,RequestService)  {
    "use strict";
    return {
        restrict: 'A',
        replace: true,
        scope: true,
        templateUrl: 'views/directives/lb_header_directive_teacher.html',
        controller: function($scope,UtilsService, $element, $attrs, $transclude) {
            // 是否显示用户操作
            $scope.userOpIsShow = false;
            $scope.Passwordshow = false;

            var timer;
            // 绑定弹框事件
            UtilsService.initPop($scope);
            // 教师修改密码
            $scope.updatePassword = function(password) {
                //密码base64加密
                var b = new Base64();
                password = b.encode(password);
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
            $scope.updatePasswordshow = function() {
                $scope.Passwordshow = true;
            };

        }

    };
}]);
