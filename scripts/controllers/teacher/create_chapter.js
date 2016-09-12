/**
 * Created by Lingban on 2016/9/9.
 */
//新建章节
lbApp.controller('CreateChapterController', ['$scope', '$routeParams', 'UtilsService', 'RequestService', function ($scope, $routeParams, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    //章节
    $scope.t_chapter = {
        courseId: $routeParams.courseID,
        name: '',
        descriptionContent: '',
        status: '0',
        orderNo: '0',
        pattern: '0'
    };
    $scope.engineer = {
        name: "Dani",
        currentActivity: "2016"
    };
    $scope.activities={
        1:'准备中',
        2:'已开放'
    }

    $scope.addChapter = function (courseId) {
        console.log(courseId);
        RequestService.request({
            token: 't_addChapter',
            method: 'POST',
            data: UtilsService.serialize($scope.t_chapter),
            success: function (data) {
                console.log(data);
                UtilsService.href('/teacher/course/' + courseId)
            }
        })
    }
}]);