/**
 * Created by Lingban on 2016/9/12.
 */
//开始学习
lbApp.controller('StudyPrepareController', ['$scope', '$routeParams', 'UtilsService', 'RequestService', function ($scope, $routeParams, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'student',
        tabName: 'tabName'
    };
    $scope.courseID = $routeParams.courseID;
    //页面切换
    $scope.p_status = '1';
    //页面切换的状态码
    $scope.pageStatus = {
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4'
    }
    $scope.keyJudgeMap = {
        'key-1': false,
        'key-2': false,
        'key-3': false,
        'key-4': false,
        'key-5': false
    }

    document.onkeydown = function (event) {
        if ( event.keyCode == 13) { // 按 enter
            RequestService.request({
                token:'s_profile',
                success:function(){
                    pageS();
                }
            });

        }
    }

    //音量校准
    function pageS(){
        //切换
        $scope.p_status = '2';
        //音量校准
        var musicAudio = document.getElementById("musicAudio");
        musicAudio.play();
        document.onkeydown = function (event) {
            if ( event.keyCode == 13) { // 按 enter
                RequestService.request({
                    token:'s_profile',
                    success:function(){
                        keyCode();
                    }
                });
            }
        }
    }
    //键盘标准
    function keyCode(){
        $scope.p_status = '3';
        var musicAudio = document.getElementById("musicAudio");
        musicAudio.pause();
        //键盘校准 1 ， 2 ， 3 ， 4 ， 回车
        document.onkeydown = function (event) {
            var e = event || window.event;
            if (e && e.keyCode == 49) { // 按 1
                $(".key-1").addClass("bgcolor-blue");
                $scope.keyJudgeMap['key-1'] = true;
                if ($scope.keyJudgeMap['key-1'] && $scope.keyJudgeMap['key-2'] && $scope.keyJudgeMap['key-3'] && $scope.keyJudgeMap['key-4'] && $scope.keyJudgeMap['key-5']) {
                    $("#prepare").show();
                    $("#keyCodeAlign").hide();
                    startExe();
                }
            }
            if (e && e.keyCode == 50) { // 按 2
                $(".key-2").addClass("bgcolor-blue");
                $scope.keyJudgeMap['key-2'] = true;
                if ($scope.keyJudgeMap['key-1'] && $scope.keyJudgeMap['key-2'] && $scope.keyJudgeMap['key-3'] && $scope.keyJudgeMap['key-4'] && $scope.keyJudgeMap['key-5']) {
                    $("#prepare").show();
                    $("#keyCodeAlign").hide();
                    startExe();
                }
            }
            if (e && e.keyCode == 51) { // 按 3
                $(".key-3").addClass("bgcolor-blue");
                $scope.keyJudgeMap['key-3'] = true;
                if ($scope.keyJudgeMap['key-1'] && $scope.keyJudgeMap['key-2'] && $scope.keyJudgeMap['key-3'] && $scope.keyJudgeMap['key-4'] && $scope.keyJudgeMap['key-5']) {
                    $("#prepare").show();
                    $("#keyCodeAlign").hide();
                    startExe();
                }
            }
            if (e && e.keyCode == 52) { // 按 4
                $(".key-4").addClass("bgcolor-blue");
                $scope.keyJudgeMap['key-4'] = true;
                if ($scope.keyJudgeMap['key-1'] && $scope.keyJudgeMap['key-2'] && $scope.keyJudgeMap['key-3'] && $scope.keyJudgeMap['key-4'] && $scope.keyJudgeMap['key-5']) {
                    $("#prepare").show();
                    $("#keyCodeAlign").hide();
                    startExe();
                }
            }
            if (e && e.keyCode == 13) { // 按 enter
                $(".key-5").addClass("bgcolor-blue");
                $scope.keyJudgeMap['key-5'] = true;
                if ($scope.keyJudgeMap['key-1'] && $scope.keyJudgeMap['key-2'] && $scope.keyJudgeMap['key-3'] && $scope.keyJudgeMap['key-4'] && $scope.keyJudgeMap['key-5']) {
                    $("#prepare").show();
                    $("#keyCodeAlign").hide();
                    startExe();
                }
            }
        };

    }

    //请准备页面，点击回车，开始做题
    function startExe() {
        document.onkeydown = function (event) {
            if (event.keyCode == 13) { // 按 enter
                RequestService.request({
                    token: 's_course_list',
                    method: 'GET',
                    success: function (data) {
                        UtilsService.href('/student/study_keying/' + $scope.execiseID+'/'+$scope.courseID);
                    }
                });
            }
        };


    }


    RequestService.request({
        token: 't_chapterShow',
        method: 'POST',
        data: UtilsService.serialize({id: $routeParams.chapterID}),
        success: function (data) {
            $scope.chapterInfo = data;
            shengcheng();
        }
    });

    function shengcheng() {
        RequestService.request({
            token: 't_exercise_list',
            method: 'GET',
            params: {chapterId: $routeParams.chapterID},
            success: function (data) {
                $scope.execiseID = data;
            }
        })
    }
}]);