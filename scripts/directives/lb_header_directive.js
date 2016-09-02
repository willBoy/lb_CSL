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
            $scope.teacherUserShow;
            RequestService.request({
                token:''
            });
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
