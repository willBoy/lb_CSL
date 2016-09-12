/**
 * Created by Lingban on 2016/9/12.
 */
//完成做题
lbApp.controller('StudyFinishController', ['$scope', '$routeParams', 'UtilsService', 'RequestService', function ($scope, $routeParams, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'student',
        tabName: 'tabName'
    };

    //课程ID
    $scope.courseID = $routeParams.courseID;
    RequestService.request({
        token: 's_exe_submit',
        method: 'POST',
        params: {chapterExerciseId: $routeParams.exerciseID},
        success: function (data) {
            $scope.exerciseResult = data;
            var r_Code = data.rightCount / (data.rightCount + data.wrongCount);
            console.log(r_Code);
            if(r_Code==1){
                $scope.percentCode = "100.00%";
            }else{
                var b = r_Code.toFixed(4);
                $scope.percentCode = b.slice(2, 4) + "." + b.slice(4, 6) + "%";
            }
            var startTime = data.startTimeStr;
            var endTime = data.endTimeStr;
            var startT_date = new Date(startTime);
            var endT_date = new Date(endTime);
            var m = parseInt(Math.abs(endT_date - startT_date));
            var count = data.rightCount + data.wrongCount;
            $scope.ave_time = parseInt((m - count * 3000) / count);
            keydown();

        }
    })
    function keydown(){
        document.onkeydown = function(event){
            if(event.keyCode == 13){
                RequestService.request({
                    token:'s_profile',
                    success:function(data){
                        UtilsService.href('/student/course_detail/'+$routeParams.courseID);
                    }
                });
            }
        }
    }


}]);