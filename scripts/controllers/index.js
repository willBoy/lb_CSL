// 首页
lbApp.controller('IndexController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
}]);

// dashboard
lbApp.controller('DashboardController', ['$scope', 'RequestService', function($scope, RequestService) {
    "use strict";
    RequestService.request({
        token: 'tk_data',
        method: 'GET',
        loading: true,
        success: function(data) {
            $scope.data = data.data;
        }
    });
}]);