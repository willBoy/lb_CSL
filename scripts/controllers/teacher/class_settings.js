/**
 * Created by Lingban on 2016/9/9.
 */
//班级设置
lbApp.controller('ClassSettingsController', ['$scope', '$routeParams', 'UtilsService', 'RequestService', function ($scope, $routeParams, UtilsService, RequestService) {
    "use strict";
    // 设置边栏
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    //班级
    $scope.classes = {
        id:$routeParams.classID,
        course:{
            id:$routeParams.courseID,
            name:'',
            description:''
        },
        name:'',
        /*courseName:'',*/
        startTime:'',
        status:''
    };
    /*$scope.modify =false;*/
    $scope.modify = "";
    RequestService.request({
        token: 't_settingClass',
        method: 'post',
        strParams: 'id=' + $routeParams.classID,
        success: function (data) {
            console.log(data);
            $scope.classes.name= data.name;
            $scope.classes.course.name= data.courseName;
            $scope.classes.startTime= data.startTime;
            $scope.classes.course.description= data.course.description;
            $scope.classes.status = data.status + "";
            $scope.modify = data.status + "";
            /*if( data.status + "" == '0'){
             $scope.modify =true;
             }*/
        }
    });

    function initDatePicker(startTimeArray, endTimeArray) {
        // 选择开始日期
        $('#time-start-update').jdatepicker({
            selectedDate: {
                year: startTimeArray[0],
                month: startTimeArray[1],
                day: startTimeArray[2]
            },
            disableFn: function (date) {
                return date.getTime() < Date.now() - 86400000;
            },
            callback: function (dateString) {
                $scope.$apply(function () {
                    $scope.classes.startTime = dateString;
                    //checkTime();
                });
            }
        });
    }

    var now = new Date(),
        nowArray = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
    initDatePicker(nowArray, nowArray);

    //班级信息设置
    $scope.updateClass = function () {
        RequestService.request({
            token: 't_classUpdate',
            method: 'POST',
            data: UtilsService.serialize($scope.classes),
            success: function () {
                UtilsService.href('/teacher/classList');
            }
        })
    }
}]);