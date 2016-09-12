/**
 * Created by Lingban on 2016/9/12.
 */
//做题
lbApp.controller('StudyKeyingController', ['$scope', '$routeParams', 'UtilsService', 'RequestService', function ($scope, $routeParams, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'student',
        tabName: 'tabName'
    };
    //课程ID
    $scope.courseID = $routeParams.courseID;
    //退出
    $scope.exe_out = function(){
        if(confirm("练习还未完成，确定退出吗？")){
            UtilsService.href('/student/course_detail/'+$routeParams.courseID);
        }
    }

    //练习
    $scope.exerciseInfo = {};
    //答题
    $scope.execiseAnswer = {
        chapterExerciseId: '',
        exerciseId: '',
        answer: '',
        answerBody: ''
    };
    $("#imgShow").hide();
    $("#enterFont").hide();
    //等待加载嘟嘟嘟~
    setTimeout(function () {
        $("#dududu").hide();
        $("#exerciseQ").show();
    }, 1000);

    //判断是否为空
    function isEmptyObject(obj) {
        for (var n in obj) {
            return false
        }
        return true;
    }
    //提取习题
    RequestService.request({
        token: 's_chapterExercise',
        method: 'GET',
        params: {chapterExerciseId: $routeParams.exerciseID},
        success: function (data) {
            console.log(data);
            if(isEmptyObject(data)){
                alert("没有可以练习的习题");
                UtilsService.href('/student/course');
            }else{
                $scope.userFirstAnswer = true;
                chapterExercise(data);
            }

        }
    });
    function chapterExercise(data) {
        $("#dududu").show();
        $("#exerciseQ").hide();
        $scope.exerciseInfo = data;
        $scope.execiseAnswer.chapterExerciseId = data.chapterExerciseId;
        $scope.execiseAnswer.exerciseId = data.id;
        $scope.musicSrc = '../../vendor/mp3/' + $scope.exerciseInfo.questionsPronunciation.filePath;
        var imgSrcNum = $scope.exerciseInfo.questionsId;
        $scope.imgSrc = '../../vendor/png/' + imgSrcNum + '.png';

        var dududu_Audio = document.getElementById('dududu_Audio');
        dududu_Audio.play();
        var musicAudio = document.getElementById('musicAuto');
        dududu_Audio.onended = function(){
            setTimeout(function(){
                $("#dududu").hide();
                $("#exerciseQ").show();
                $("#answer").find('.answer_empty').css('border-bottom','3px solid white');
                musicAuto.play();
            },1000);
        }
        $("#answer").html("");
        if ($scope.exerciseInfo.questionsPronunciation.tones.length == 1) {
            var html = '<div class="key-1">' +
                '<span class="answer_empty">' + '</span>' +
                '</div>';
        } else if ($scope.exerciseInfo.questionsPronunciation.tones.length == 2) {
            var html = '<div class="key-2">' +
                '<span class="answer_empty">' + '</span>' +
                '<span class="answer_empty">' + '</span>'
                + '</div>';
        } else if ($scope.exerciseInfo.questionsPronunciation.tones.length == 3) {
            var html = '<div class="key-3">' +
                '<span class="answer_empty">' + '</span>' +
                '<span class="answer_empty">' + '</span>' +
                '<span class="answer_empty">' + '</span>'
                + '</div>'
        } else if ($scope.exerciseInfo.questionsPronunciation.tones.length == 4) {
            var html = '<div class="key-4">' +
                '<span class="answer_empty">' + '</span>' +
                '<span class="answer_empty">' + '</span>' +
                '<span class="answer_empty">' + '</span>' +
                '<span class="answer_empty">' + '</span>'
                + '</div>'
        }
        $("#answer").html(html);
        var flag = true;
        document.onkeydown = function (event) {
            if (event.keyCode == 49) { // 按 1
                if ($("#exerciseQ").is(":visible")) {
                    select(-1, 1);
                }
            }
            if (event.keyCode == 50) { // 按 2
                if ($("#exerciseQ").is(":visible")) {
                    select(-1, 2);
                }
            }
            if (event.keyCode == 51) { // 按 3
                if ($("#exerciseQ").is(":visible")) {
                    select(-1, 3);
                }
            }
            if (event.keyCode == 52) { // 按 4
                if ($("#exerciseQ").is(":visible")) {
                    select(-1, 4);
                }
            }
        };
        var userAnswer = [];
        $("#answer").find('.answer_empty').html('');
        $("#answer").find('.answer_empty').css('border-bottom','3px solid white');
        var rightAnswer = [];
        function select(num, code,T_F) {
            userAnswer.push(code);
            var codeT = '';
            codeT = userAnswer.join('') + "";
            console.log(codeT);
            $.each(userAnswer,function(n,value){
                var selectHtml = '<span class="icon border-3-white icons-' + value + '"></span>';
                $("#answer").find('.answer_empty').eq(n).html('');
                $("#answer").find('.answer_empty').eq(n).html(selectHtml);
                $("#answer").find('.answer_empty').eq(n).css('border','0');
            })
            $scope.execiseAnswer.answerBody = codeT;
            var TonsAnswer = $scope.exerciseInfo.questionsPronunciation.tones + "";
            if (TonsAnswer == codeT) {
                if($scope.userFirstAnswer){
                    $scope.execiseAnswer.answer = true;
                }
                $scope.userFirstAnswer = false;
                $("#answer").find('.icon').addClass('border-3-green');
                //初始化暂存答案的数组
                userAnswer = [];
                setTimeout(function(){
                    nextExe();
                },1000);
            } else {
                if (TonsAnswer.length == codeT.length) {
                    if($scope.userFirstAnswer){
                        $scope.execiseAnswer.answer = false;
                    }
                    $scope.userFirstAnswer = false;
                    var rightA = TonsAnswer.split("");
                    var userA = codeT.split("");
                    for(var i = 0 ; i < rightA.length ; i++){
                        if(rightA[i] == userA[i]){
                            $("#answer").find('.icon').eq(i).addClass('border-3-green');
                        }else{
                            $("#answer").find('.icon').eq(i).addClass('border-3-red');
                        }
                    }
                    $("#imgShow").show();
                    $("#enterFont").show();
                    flag = false;
                    document.onkeydown = function (event) {
                        if (event && event.keyCode == 13) { // 按 1
                            $("#imgShow").hide();
                            $("#enterFont").hide();
                            flag = true;
                            //初始化暂存答案的数组
                            userAnswer = [];
                            $("#answer").find('.answer_empty').html('');
                            if($scope.exerciseInfo.pattern == 0){
                                var repeatTimes = false;
                                $("#dududu").show();
                                $("#exerciseQ").hide();
                                var dududu_Audio = document.getElementById('dududu_Audio');
                                dududu_Audio.play();
                                var musicAudio = document.getElementById('musicAuto');
                                dududu_Audio.onended = function(){
                                    setTimeout(function(){
                                        $("#dududu").hide();
                                        $("#exerciseQ").show();
                                        $("#answer").find('.answer_empty').css('border-bottom','3px solid white');
                                        musicAuto.play();
                                    },1000);
                                }
                                document.onkeydown = function (event) {
                                    if (event.keyCode == 49) { // 按 1
                                        if ($("#exerciseQ").is(":visible")) {
                                            selectFactory(-1, 1,repeatTimes);
                                        }
                                    }
                                    if (event.keyCode == 50) { // 按 2
                                        if ($("#exerciseQ").is(":visible")) {
                                            selectFactory(-1, 2,repeatTimes);
                                        }
                                    }
                                    if (event.keyCode == 51) { // 按 3
                                        if ($("#exerciseQ").is(":visible")) {
                                            selectFactory(-1, 3,repeatTimes);
                                        }
                                    }
                                    if (event.keyCode == 52) { // 按 4
                                        if ($("#exerciseQ").is(":visible")) {
                                            selectFactory(-1, 4,repeatTimes);
                                        }
                                    }
                                };

                            }else if($scope.exerciseInfo.pattern == 1){
                                var repeatTimes = true;
                                $("#answer").find('.answer_empty').html('');
                                $("#dududu").show();
                                $("#exerciseQ").hide();
                                var dududu_Audio = document.getElementById('dududu_Audio');
                                dududu_Audio.play();
                                var musicAudio = document.getElementById('musicAuto');
                                dududu_Audio.onended = function(){
                                    setTimeout(function(){
                                        $("#dududu").hide();
                                        $("#exerciseQ").show();
                                        $("#answer").find('.answer_empty').css('border-bottom','3px solid white');
                                        musicAuto.play();
                                    },1000);
                                }
                                document.onkeydown = function (event) {
                                    if (event.keyCode == 49) { // 按 1
                                        if ($("#exerciseQ").is(":visible")) {
                                            select(-1, 1,repeatTimes);
                                        }
                                    }
                                    if (event.keyCode == 50) { // 按 2
                                        if ($("#exerciseQ").is(":visible")) {
                                            select(-1, 2,repeatTimes);
                                        }
                                    }
                                    if (event.keyCode == 51) { // 按 3
                                        if ($("#exerciseQ").is(":visible")) {
                                            select(-1, 3,repeatTimes);
                                        }
                                    }
                                    if (event.keyCode == 52) { // 按 4
                                        if ($("#exerciseQ").is(":visible")) {
                                            select(-1, 4,repeatTimes);
                                        }
                                    }
                                };
                            }

                        }

                    };
                }
            }
        }

        function selectFactory(num, code,T_F) {
            userAnswer.push(code);
            var codeT = '';
            codeT = userAnswer.join('') + "";
            console.log(codeT);
            $.each(userAnswer,function(n,value){
                var selectHtml = '<span class="icon border-3-white icons-' + value + '"></span>';
                $("#answer").find('.answer_empty').eq(n).html('');
                $("#answer").find('.answer_empty').eq(n).html(selectHtml);
                $("#answer").find('.answer_empty').eq(n).css('border','0');
            })
            var TonsAnswer = $scope.exerciseInfo.questionsPronunciation.tones + "";
            if (TonsAnswer == codeT) {
                $("#answer").find('.icon').addClass('border-3-green');
                setTimeout(function(){
                    nextExe();
                },1000);
            } else {
                if (TonsAnswer.length == codeT.length) {
                    var rightA = TonsAnswer.split("");
                    var userA = codeT.split("");
                    for(var i = 0 ; i < rightA.length ; i++){
                        if(rightA[i] == userA[i]){
                            $("#answer").find('.icon').eq(i).addClass('border-3-green');
                        }else{
                            $("#answer").find('.icon').eq(i).addClass('border-3-red');
                        }
                    }
                    $("#imgShow").show();
                    $("#enterFont").show();
                    flag = false;
                    document.onkeydown = function (event) {
                        if (event && event.keyCode == 13) { // 按 1
                            $("#imgShow").hide();
                            $("#enterFont").hide();
                            flag = true;
                            $("#answer").find('.answer_empty').html('');
                            if(!T_F){
                                nextExe();
                            }else{
                                var repeatTimes = true;
                                $("#dududu").show();
                                $("#exerciseQ").hide();
                                var dududu_Audio = document.getElementById('dududu_Audio');
                                dududu_Audio.play();
                                var musicAudio = document.getElementById('musicAuto');
                                dududu_Audio.onended = function(){
                                    setTimeout(function(){
                                        $("#dududu").hide();
                                        $("#exerciseQ").show();
                                        $("#answer").find('.answer_empty').css('border-bottom','3px solid white');
                                        musicAuto.play();
                                    },1000);
                                }
                                document.onkeydown = function (event) {
                                    if (event.keyCode == 49) { // 按 1
                                        if ($("#exerciseQ").is(":visible")) {
                                            select(-1, 1,repeatTimes);
                                        }
                                    }
                                    if (event.keyCode == 50) { // 按 2
                                        if ($("#exerciseQ").is(":visible")) {
                                            select(-1, 2,repeatTimes);
                                        }
                                    }
                                    if (event.keyCode == 51) { // 按 3
                                        if ($("#exerciseQ").is(":visible")) {
                                            select(-1, 3,repeatTimes);
                                        }
                                    }
                                    if (event.keyCode == 52) { // 按 4
                                        if ($("#exerciseQ").is(":visible")) {
                                            select(-1, 4,repeatTimes);
                                        }
                                    }
                                };
                            }
                        }

                    };
                }
            }
        }

        //判断是否为空
        function isEmptyObject(obj) {
            for (var n in obj) {
                return false
            }
            return true;
        }

        function nextExe() {
            if (flag) {
                console.log($scope.execiseAnswer);
                RequestService.request({
                    token: 's_exe_sub',
                    method: 'POSt',
                    data: UtilsService.serialize($scope.execiseAnswer),
                    success: function (data) {
                        console.log(data);
                        if (isEmptyObject(data)) {
                            //$scope.exe_submit();
                            userAnswer = [];
                            UtilsService.href('/student/study_finish/' + $routeParams.exerciseID+'/'+$routeParams.courseID);
                        } else {
                            userAnswer = [];
                            $scope.userFirstAnswer = true;
                            chapterExercise(data);
                        }

                    }
                })
            }
        };

    }
}]);