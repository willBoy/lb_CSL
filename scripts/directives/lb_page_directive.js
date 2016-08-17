// 分页指令
lbApp.directive('lbPageDirective', function() {
    "use strict";
    return {
        restrict: 'A',
        replace: true,
        scope: {
            data: '=',
            fetch: '=',
            pageInfo: '='
        },
        templateUrl: 'views/directives/lb_page_directive.html',
        controller: function($scope, $element, $attrs) {
            $scope.pageBtnList = [];
            /**
             * 计算需要显示的分页按钮的页数
             */
            function calcPageBtn() {
                $scope.pageBtnList.length = 0;
                var page = $scope.pageInfo.page,
                    pageSize = parseInt($scope.pageInfo.pageSize),
                    totalPage = $scope.pageInfo.totalPage;
                if (totalPage <= 5) {
                    for (var i = 1; i <= totalPage; i++) {
                        $scope.pageBtnList.push(i);
                    }
                } else if (totalPage > 5) {
                    if (page <=3) {
                        $scope.pageBtnList = [1, 2, 3, 4, 5];
                    } else if (totalPage - page < 3) {
                        for (var j = totalPage - 4; j <= totalPage; j++) {
                            $scope.pageBtnList.push(j);
                        }
                    } else {
                        $scope.pageBtnList = [page - 2, page - 1, page , page + 1, page + 2];
                    }
                }
            }
            $scope.$watch('pageInfo.totalPage', function() {
                calcPageBtn();
            });
            $scope.$watch('pageInfo.page', function() {
                calcPageBtn();
            });
        }
    };
});