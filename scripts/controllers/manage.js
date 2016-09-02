// 角色管理
lbApp.controller('RoleManageController', ['$scope', function($scope) {
    "use strict";
    // 个人中心标签
    $scope.asideTab = {
        listName: 'account',
        tabName: 'profile'
    };
    // lbTitleDirective会读取该字段并渲染到模板中
    $scope.titleInfo = {
        title: '个人中心',
        paths: [
            {
                name: '首页',
                url: '/'
            },
            {
                name: '个人中心'
            }
        ]
    };
}]);