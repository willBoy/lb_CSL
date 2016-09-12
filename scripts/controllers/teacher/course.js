/**
 * Created by Lingban on 2016/9/9.
 */
//课程管理
lbApp.controller('CourseController', ['$scope', '$routeParams', 'UtilsService', 'RequestService', function ($scope, $routeParams, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    //班级课程
    $scope.classCourse = {
        courseName: '',
        description: ''
    };

    //课程详情
    RequestService.request({
        token: 't_classCourse',
        method: 'POST',
        strParams: 'courseId=' + $routeParams.courseID,
        success: function (data) {
            $scope.classCourse = data;
            /*console.log(data);*/
            /*console.log($routeParams.courseID);*/
            /*$scope.chapterList($routeParams.courseID);*/
            $scope.chapterList(1);
        }
    })

    //章节列表
    $scope.classCourseChapter = [];
    $scope.orderNoMap = {
        '0': '随机',
        '1': '顺序'
    };
    $scope.statusMap = {
        '0': '准备中',
        '1': '已开放'
    };
    $scope.statusList = [
        {key:'0',value:'准备中'},
        {key:'1',value:'以开放'}
    ]
    $scope.patternMap = {
        '0': '错题重做一次',
        '1': '错题重做到正确'
    };
    //查询条件
    $scope.conditions = {
        // 值查询
        /*courseId:$routeParams.courseID,*/
        common: {
            courseId:$routeParams.courseID
        },
        // 排序条件
        order: {},
        // 分页信息
        pageInfo: {
            page: 1,
            pageSize: '10',
            totalPage: 0
        }
    }

// 获取章节列表项
    $scope.chapterList = function (page) {
        $scope.conditions.pageInfo.page = page || 1;
        RequestService.request({
            token: 't_courseChapter',
            method: 'POST',
            /*strParams: UtilsService.genConditions($scope.conditions),*/
            strParams: UtilsService.genConditions($scope.conditions),
            success: function (data) {
                console.log(data);
                $scope.conditions.pageInfo.totalPage = data.pages;
                $scope.classCourseChapter = data.result;
                $scope.total = data.total;

            }
        });
    }
    //删除章节
    $scope.chapterDel = function (ID) {
        if(confirm("确定要删除吗？"))
        {
            RequestService.request({
                token: 't_chapterDel',
                method: 'POST',
                params: {chapterId: ID},
                loading: true,
                success: function (data) {
                    console.log(data)
                    location.reload();
                }
            });
        }

    }

}]);