/**
 * Created by Lingban on 2016/9/9.
 */
// 教師端-班級管理
lbApp.controller('ClassListController', ['$scope', 'UtilsService', 'RequestService', function ($scope, UtilsService, RequestService) {
    //
    "use strict";
    // 设置边栏
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    // 绑定弹框事件
    UtilsService.initPop($scope);

    //班级状态
    $scope.statusMap = {
        '0': '准备中',
        '1': '开课中',
        '2': '已结课'
    };
    //班级总数
    $scope.total = 0;
    //查询条件
    $scope.conditions = {
        // 值查询
        common: {
            // 班级名字
            name: '',
            // 开课时间
            startYear: '2016'
        },
        // 排序条件
        order: {},
        // 分页信息
        pageInfo: {
            page: 1,
            pageSize: '10',
            totalPage: 0
        }
    };
    $(".hove").mouseover(function(){
        console.log(111);
        $(".hovemoue").show();
    });
    //班级列表
    $scope.t_classListArr = {};

    // 获取班级列表项
    $scope.getclasslist = function (page) {
        $scope.conditions.pageInfo.page = page || 1;
        RequestService.request({
            token: 't_classList',
            method: 'POST',
            strParams: UtilsService.genConditions($scope.conditions),
            success: function (data) {
                console.log(data);
                $scope.conditions.pageInfo.totalPage = data.pages;
                $scope.t_classListArr = data.result;
                $scope.total = data.total;

            }
        });
    }
    $scope.getclasslist(1);

    $scope.engineer = {
        name: "Dani",
        currentActivity: "2016"
    };

    $scope.activities =
        [
            "2016",
            "2017"
        ];
    $scope.delclass = function(id){
        if(confirm("确定要删除吗？"))
        {
            RequestService.request({
                token: 't_classDel',
                method: 'POST',
                data: UtilsService.serialize({id: id}),
                loading: true,
                success: function (data) {
                    UtilsService.href('/teacher/delClass/'+id);
                }
            });
        }
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


}]);