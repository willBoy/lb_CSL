//  ◊“≥
lbApp.controller('StudentProfileController', ['$scope', '$routeParams','UtilsService', 'RequestService', function($scope,$routeParams, UtilsService, RequestService) {
    //
    "use strict";
    // …Ë÷√±ﬂ¿∏
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    RequestService.request({
        token:'',
        method:'',
        loading:true,
        
    })


}]);
