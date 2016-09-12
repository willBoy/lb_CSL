/**
 * Created by Lingban on 2016/9/9.
 */
//新建班级
lbApp.controller('CreateClassController', ['$scope', 'UtilsService', 'RequestService', function ($scope, UtilsService, RequestService) {
    //
    "use strict";
    // 设置边栏
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    //班级信息
    $scope.classes = {
        /*//班级名称
         name: '',
         //课程名称
         course.name: '',
         // 课程简介
         course.description: '',
         //开课时间
         startTime: ''
         //班级状态*/

    };

    $scope.classAdd = function () {
        RequestService.request({
            token: 't_classAdd',
            method: 'POST',
            data: $.param($scope.classes),
            /*strParams:'name'+name+'courseName=' + courseName + '&startTime='+ startTime,*/
            success: function (data) {
                console.log(data);
                /*alert("创建班级成功");*/
                UtilsService.href('/teacher/classList');
            }
        })
    };
    function initDatePicker(startTimeArray, endTimeArray) {
        // 选择开始日期
        $('#time-start').jdatepicker({
            selectedDate: {
                year: startTimeArray[0],
                month: startTimeArray[1],
                //day: startTimeArray[2]
            },
            //disableFn: function(date) {
            //    return date.getTime() < Date.now() - 86400000;
            //},
            callback: function (dateString) {
                $scope.$apply(function () {
                    $scope.classes.startTime = dateString;
                    checkTime();
                });
            }

        });
    }

    var now = new Date(),
        nowArray = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
    initDatePicker(nowArray, nowArray);

    function checkTime() {
        // 是否填写了开始时间

        if (!$scope.classes.startTime) {
            $scope.dateError = '请选择开始日期';
            $scope.showDateError = true;
            return false;
        }

        $scope.showDateError = false;
        return true;
    }

    /*$scope.showDateError = false;*/
}]);