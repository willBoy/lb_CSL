/**
 * Created by Lingban on 2016/9/12.
 */
//我的课程
lbApp.controller('StudentCourseController', ['$scope', '$routeParams', 'UtilsService', 'RequestService', function ($scope, $routeParams, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'student',
        tabName: 'tabName'
    };

    //课程状态
    $scope.classesStatusMap = {
        '0': '未开课',
        '1': '开课中',
        '2': '已完结'
    }

    $scope.inflag = true;

    // 绑定弹框事件
    UtilsService.initPop($scope);
    $scope.s_myCourse = [];


    //查询条件
    $scope.conditions = {
        // 值查询
        common: {},
        // 分页信息
        pageInfo: {
            page: 1,
            pageSize: '10',
            totalPage: 0
        }
    }

    //班级列表
    $scope.t_classListArr = {};

    // 获取班级列表项
    $scope.getclasslist = function (page) {
        $scope.conditions.pageInfo.page = page || 1;
        RequestService.request({
            token: 's_course_list',
            method: 'GET',
            strParams: UtilsService.genConditions($scope.conditions),
            success: function (data) {
                console.log(data);
                $scope.conditions.pageInfo.totalPage = data.pages;
                $scope.s_myCourse = data.result;
                $scope.total = data.total;

            }
        });
    }
    $scope.getclasslist(1);

    //防止重复提交多次
    RequestService.request({
        token: 's_course_list',
        method: 'GET',
        strParams: UtilsService.genConditions($scope.conditions),
        success: function (data) {
            $scope.inflag = false;
            $scope.s_myCourse = data.result;
            console.log($scope.s_myCourse);
        }
    });


    document.onkeydown = function (event) {
        if (event && event.keyCode == 13) { // 按 4
            if($("#pop-class").is(':visible')){
                $scope.inflag = true;
                $scope.addCourse($scope.s_myCourse.sequenceNo);
            }

        }
    };
    $scope.emptyInput = function(){
        $scope.s_myCourse.sequenceNo = '';
    };
    //加入课程
    $scope.addCourse = function (sequenceNo) {
        RequestService.request({
            token: 's_addCourse',
            method: 'POST',
            data: UtilsService.serialize({sequenceNo: sequenceNo}),
            success: function () {
                $scope.inflag = false;
                $scope.closePop('pop-class');
                location.reload();
            },
            addClass:function(data){
                $scope.s_myCourse.sequenceNo = '';
            }
        })
    }
    //退出课程
    $scope.delCourse = function (classesId) {
        if (confirm("确定退出课程吗")) {
            RequestService.request({
                token: 's_delCourse',
                method: 'POST',
                params: {classesId: classesId},
                data: UtilsService.serialize({classesId: classesId}),
                success: function (data) {
                    location.reload();
                    //UtilsService.href("/class/courseSetting/"+classID);
                    $scope.s_courseList();
                }
            });
        }

    }


}]);