/**
 * Created by Lingban on 2016/9/9.
 */
//章节设置
lbApp.controller('ChapterController', ['$scope', '$routeParams', 'UtilsService', 'RequestService', function ($scope, $routeParams, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    //章节信息
    $scope.t_chapter = {
        classesId: '',
        //章节名称
        name: '',
        // 章节简介
        descriptionContent: '',
        // 章节状态
        status: '',
        //呈现顺序
        orderNo: '',
        //练习流程
        pattern: ''
    };
    $scope.courseId='';
    $scope.kecheng = function(){
        console.log($scope.t_chapter.courseId);
        UtilsService.href("/teacher/course/" + $scope.t_chapter.courseId);
    };
    //面包屑导航
    /*$scope.Navigation=function(id){
     RequestService.request({
     token: 't_findNavigationById',
     method: 'POST',
     /!*strParams: 'courseId=' + id,*!/
     success: function (data) {
     UtilsService.href("/class/courseSetting" + data.courseId);
     }
     })

     }*/
    RequestService.request({
        token: 't_chapterShow',
        method: 'POST',
        data: UtilsService.serialize({id: $routeParams.chapterID}),
        success: function (data) {
            console.log(data);
            $scope.t_chapter = data;
            $scope.t_chapter.orderNo = data.orderNo + "";
            $scope.t_chapter.courseId = data.courseId;
            $scope.t_chapter.pattern = data.pattern + "";
            $scope.t_chapter.status = data.status + "";
            $scope.t_chapter.descriptionCn = data.descriptionCn;
            $scope.t_chapter.questionCount = 0;
            $scope.t_chapter.classesId = $routeParams.classID;
        }
    });


    $scope.chapterUpdate = function () {
        RequestService.request({
            token: 't_chapterUpdate',
            method: 'POST',
            data: UtilsService.serialize($scope.t_chapter),
            success: function (data) {
                console.log($scope.t_chapter.courseId);
                UtilsService.href("/teacher/course/" + $scope.t_chapter.courseId);
            }
        });
    }

}]);