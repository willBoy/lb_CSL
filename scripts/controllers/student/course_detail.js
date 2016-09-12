/**
 * Created by Lingban on 2016/9/12.
 */
//我的课程详情
lbApp.controller('StudentCourseDetailController', ['$scope', '$routeParams', 'UtilsService', 'RequestService', function ($scope, $routeParams, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'student',
        tabName: 'tabName'
    };
    //查询条件
    $scope.conditions = {
        // 值查询
        common: {
            courseId: $routeParams.courseID
        },
        // 分页信息
        pageInfo: {
            page: 1,
            pageSize: '20',
            totalPage: 0
        }
    }

    //班级列表
    $scope.t_classListArr = {};

    //请求章节列表数据
    $scope.getclasslist = function (page) {
        $scope.conditions.pageInfo.page = page || 1;
        RequestService.request({
            token: 's_chapterList',
            method: 'GET',
            strParams: UtilsService.genConditions($scope.conditions),
            success: function (data) {
                console.log(data);
                $scope.conditions.pageInfo.totalPage = data.pages;
                $scope.total = data.total;
                $scope.courseChapter = data.result;

            }
        });
    }
    $scope.getclasslist(1);


    $scope.course = {
        //课程名
        name: '',
        //课程简介
        description: ''
    }
    //课程信息
    console.log($routeParams.courseID);
    RequestService.request({
        token: 's_course',
        method: 'post',
        data: UtilsService.serialize({courseId: $routeParams.courseID}),
        success: function (data) {
            console.log(data);
            $scope.course = data;
            s_chapterList($scope.course.id);
        }
    });

    //判断是否为空
    function isEmptyObject(obj) {
        for (var n in obj) {
            return false
        }
        return true;
    }

    $scope.courseChapter = [];
    $scope.courseID = $routeParams.courseID;
    // 请求章节列表数据
    function s_chapterList() {
        RequestService.request({
            token: 's_chapterList',
            method: 'GET',
            strParams: 'courseId=' + $routeParams.courseID,
            loading: true,
            success: function (data) {
                console.log(data);
                $scope.courseChapter = data.result;
            }
        });
    }
}]);