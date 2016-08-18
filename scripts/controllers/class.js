// 首页
lbApp.controller('ClassListController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    // 设置边栏
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };

    // 获取班级列表项
    $scope.classList = function(){
        RequestService.request({
            token: 'lb_subjectTemplate',
            method: 'GET',
            success: function(data) {

            }
        });
    }
  }]);
//班级详情
// 首页
lbApp.controller('ClassDetailController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    // 设置边栏
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };

    // 获取班级列表项
    $scope.classList = function(){
        RequestService.request({
            token: 'lb_subjectTemplate',
            method: 'GET',
            success: function(data) {

            }
        });
    }

    $scope.class = {
        name:'1'
    }
}]);

//新建班级
lbApp.controller('CreateClassController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    // 设置边栏
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };

    // 任务信息
    $scope.taskInfo = {
        // 开始时间
        startTime: '',
        // 结束时间
        endTime: '',
    };


    function initDatePicker(startTimeArray, endTimeArray) {
        // 选择开始日期
        $('#time-start').jdatepicker({
            selectedDate: {
                year: startTimeArray[0],
                month: startTimeArray[1],
                day: startTimeArray[2]
            },
            disableFn: function(date) {
                return date.getTime() < Date.now() - 86400000;
            },
            callback: function(dateString) {
                $scope.$apply(function() {
                    $scope.taskInfo.startTime = dateString;
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
        if (!$scope.taskInfo.startTime) {
            $scope.dateError = '请选择开始日期';
            $scope.showDateError = true;
            return false;
        }
        // 是否填写了结束时间
        if (!$scope.taskInfo.endTime) {
            $scope.dateError = '请选择结束日期';
            $scope.showDateError = true;
            return false;
        }
        // 开始日期是否大于结束日期
        var startTimeStamp = (new Date($scope.taskInfo.startTime)).getTime();
        var endTimeStamp = (new Date($scope.taskInfo.endTime)).getTime();
        if (startTimeStamp > endTimeStamp) {
            $scope.dateError = '开始日期不能早于结束日期';
            $scope.showDateError = true;
            return false;
        }
        $scope.showDateError = false;
        return true;
    }

}]);

//课程管理
lbApp.controller('CourseController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
}]);

//章节设置
lbApp.controller('SessionController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
}]);
//习题管理
lbApp.controller('SxerciseController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
}]);
//添加习题
lbApp.controller('SxerciseAddController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
}]);
//学生管理
lbApp.controller('StudentController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
}]);
//学生详情
lbApp.controller('StudentDetailController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
}]);