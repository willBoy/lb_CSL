/**
 * Created by Lingban on 2016/9/12.
 */
// 学生个人信息
lbApp.controller('StudentProfileController', ['$rootScope', '$scope', '$routeParams', 'UtilsService', 'RequestService', function ($rootScope, $scope, $routeParams, UtilsService, RequestService) {
    //
    "use strict";
    // 设置边栏
    $scope.asideTab = {
        listName: 'student',
        tabName: 'tabName'
    };
    RequestService.request({
        token: 's_profile',
        method: 'GET',
        loading: true,
        success: function (data) {
            $scope.studentInfo = data;
        }
    });
}]);