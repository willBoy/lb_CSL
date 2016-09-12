/**
 * Created by Lingban on 2016/9/1.
 */
//习题管理
lbApp.controller('ExerciseController', ['$scope', '$routeParams', 'UtilsService', 'RequestService', function ($scope, $routeParams, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    $scope.qingshengMap = {
        0: '无',
        1: '必读',
        2: '可读'
    };

    $scope.erhuaMap = {
        0: '无',
        1: '有'
    };

    $scope.speakerMap = {
        1: '普通话水平测试（男）',
        2: '普通话水平测试(女)'
    };
    $scope.hskLevelMap = {
        1: 'HSK-1',
        2: 'HSK-2',
        3: 'HSK-3',
        4: 'HSK-4',
        5: 'HSK-5',
        6: 'HSK-6',
        7: '超纲'
    };

    // 绑定弹框事件
    UtilsService.initPop($scope);

    $scope.t_exerciseList = [];
    RequestService.request({
        token: 't_chapterShow',
        method: 'POST',
        data: UtilsService.serialize({id: $routeParams.chapterID}),
        loading: true,
        success: function (data) {
            console.log(data);
            $scope.t_chapterInfo = data;
            $scope.t_chapterInfo.courseId = data.courseId;
            /*console.log($scope.t_chapterInfo.courseId);*/
            $scope.t_exe_List();
        }
    });
    //查询条件
    $scope.conditions = {
        // 值查询
        /*courseId:$routeParams.courseID,*/
        common: {
            chapterId: $routeParams.chapterID
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

// 获取章节列表项
    $scope.t_exe_List = function (page) {
        $scope.conditions.pageInfo.page = page || 1;
        RequestService.request({
            token: 't_exe_list',
            method: 'POST',
            /*strParams: UtilsService.genConditions($scope.conditions),*/
            strParams: UtilsService.genConditions($scope.conditions),
            success: function (data) {
                console.log(data);
                $scope.conditions.pageInfo.totalPage = data.pages;
                $scope.t_exerciseList = data.result;
                $scope.total = data.total;

            }
        });
    };
    $scope.t_exe_List(1);

    $scope.exe_del = function (ID) {
        RequestService.request({
            token: 't_exe_del',
            method: 'POST',
            params: {id: ID},
            loading: true,
            success: function (data) {
                console.log(data.result);
                location.reload();
                //$scope.t_exerciseList = data.result;
            }
        });
    }


}]);
