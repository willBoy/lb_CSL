/**
 * Created by Lingban on 2016/9/1.
 */
//习题管理
lbApp.controller('ExerciseController', ['$scope', '$routeParams', 'UtilsService', 'RequestService', function ($scope, $routeParams, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    $scope.qingshengMap = {
        0: '无',
        1: '必读',
        2: '可读'
    };

    $scope.erhuaMap = {
        0: '无',
        1: '有'
    };

    $scope.speakerMap = {
        1: '普通话水平测试（男）',
        2: '普通话水平测试(女)'
    };
    $scope.hskLevelMap = {
        1: 'HSK-1',
        2: 'HSK-2',
        3: 'HSK-3',
        4: 'HSK-4',
        5: 'HSK-5',
        6: 'HSK-6',
        7: '超纲'
    };

    // 绑定弹框事件
    UtilsService.initPop($scope);
    $scope.t_exerciseList = [];
    RequestService.request({
        token: 't_chapterShow',
        method: 'POST',
        data: UtilsService.serialize({id: $routeParams.chapterID}),
        loading: true,
        success: function (data) {
            $scope.t_chapterInfo = data;
            t_exe_show();
        }
    });

    function t_exe_show() {
        RequestService.request({
            token: 't_exe_list',
            method: 'POST',
            data: UtilsService.serialize({chapterId: $routeParams.chapterID}),
            /*loading:true,*/
            success: function (data) {
                console.log(data.result);
                $scope.t_exerciseList = data.result;

            }
        });
    }

    $scope.exe_del = function (ID) {
        RequestService.request({
            token: 't_exe_del',
            method: 'POST',
            params: {id: ID},
            loading: true,
            success: function (data) {
                console.log(data.result);
                location.reload();
                //$scope.t_exerciseList = data.result;
            }
        });
    }

}]);
//添加习题
lbApp.controller('ExerciseAddController', ['$scope', '$routeParams', 'UtilsService', 'RequestService', function ($scope, $routeParams, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    // 绑定弹框事件
    UtilsService.initPop($scope);
    $scope.t_sel_exeList = [];
    $scope.exeIndex = {};

    // 选择的习题
    $scope.selectedCallList = {};

    $scope.getExerciseList = function () {
        RequestService.request({
            token: 't_exeIndex',
            method: 'POST',
            data: UtilsService.serialize($scope.exeIndex),
            loading: true,
            success: function (data) {
                console.log();
                $scope.t_sel_exeList = data.result;
                $scope.exeIndex = {};
                for (var i = 0; i < $scope.t_sel_exeList.length; i++) {
                    $scope.selectedCallList[$scope.t_sel_exeList[i].id] = false;
                }
            }
        });
    };
    $scope.ReturnExerciseList = function () {
        UtilsService.href('/class/exercise/' + $routeParams.chapterID);
    }
    // 是否选择全部外呼
    $scope.callAll = false;
    $scope.$watch('callAll', function () {
        if ($scope.callAll) {
            for (var jid in $scope.selectedCallList) {
                $scope.selectedCallList[jid] = true;
            }
        } else {
            for (var jid in $scope.selectedCallList) {
                $scope.selectedCallList[jid] = false;
            }
        }
    });

    // 如果全部选择了，就把callAll置为true，如果全部取消了，就置为false
    $scope.changeCallAll = function () {
        var selectedCallList = $scope.selectedCallList;
        var first = selectedCallList[Object.keys(selectedCallList)[0]];
        for (var j in selectedCallList) {
            if (selectedCallList[j] != first) {
                return;
            }
        }
        $scope.callAll = first;
    };

    /**
     * 批量添加习题
     */
    $scope.addExe = function (call) {
        var data = '';
        for (var jid in $scope.selectedCallList) {
            if ($scope.selectedCallList[jid]) {
                data += '@@' + jid;
            }
        }
        data = data.slice(2);
        RequestService.request({
            token: 't_addExe',
            method: 'POST',
            data: UtilsService.serialize({questionIds: data, chapterId: $routeParams.chapterID}),
            success: function (data) {
                alert("添加习题成功");
                UtilsService.href('/class/exercise/' + $routeParams.chapterID);
                location.reload();
            }
        })
    };

    $scope.tonesMap = {
        1: '1',
        2: '2',
        3: '3',
        4: '4'
    };

    $scope.qingshengMap = {
        0: '无',
        1: '必读',
        2: '可读'
    };

    $scope.qinsghengList = [
        {'key':'0','value':'无'},
        {'key':'1','value':'必读'},
        {'key':'2','value':'可读'}
    ]

    $scope.erhuaMap = {
        0: '无',
        1: '有'
    };

    $scope.speakerMap = {
        1: '普通话水平测试（男）',
        2: '普通话水平测试(女)'
    };
    $scope.hskLevelMap = {
        1: 'HSK-1',
        2: 'HSK-2',
        3: 'HSK-3',
        4: 'HSK-4',
        5: 'HSK-5',
        6: 'HSK-6',
        7: '超纲'
    };
    //选中的习题
    $scope.arrayList = [];
    //RequestService.request({
    //    token:'t_exercise',
    //    method:'POST',
    //    loading:true,
    //    success:function(data){
    //        $scope.t_sel_exeList = data.exerciseList;
    //    }
    //})


    $scope.testAdd = function () {
        console.log($scope.arrayList);
    }
}]);

//添加习题
lbApp.controller('ExerciseAdd2Controller', ['$scope', 'UtilsService', 'RequestService', function ($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    // 绑定弹框事件
    UtilsService.initPop($scope);
    $scope.t_sel_exeList = [];
    //RequestService.request({
    //    token:'t_exercise',
    //    method:'POST',
    //    loading:true,
    //    success:function(data){
    //        $scope.t_sel_exeList = data.exerciseList;
    //    }
    //})

}]);