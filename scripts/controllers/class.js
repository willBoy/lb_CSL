// 首页
lbApp.controller('ClassListController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    // 设置边栏
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };

    //班级列表数据
    $scope.t_classListArr = [];

    // 获取班级列表项
        RequestService.request({
            token: 't_classList',
            method: 'POST',
            success: function(data) {
                $scope.t_classListArr = data.result;
            }
        });

    //查询条件
    $scope.conditions = {
        name:'',
        startYear:''
    }

    $scope.select = function(){
        console.log($scope.conditions);
        RequestService.request({
            token: 't_classList',
            method: 'POST',
            data:UtilsService.serialize($scope.conditions),
            success: function(data) {
                $scope.t_classListArr = data.result;
            }
        });
    };
  }]);
//班级设置
lbApp.controller('ClassDetailController', ['$scope', '$routeParams', 'UtilsService', 'RequestService', function($scope,$routeParams, UtilsService, RequestService) {
    "use strict";
    // 设置边栏
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    //班级详细信息
    $scope.classDetail ={};
    $scope.classID = $routeParams.classID;
    RequestService.request({
        token:'t_settingClass',
        method:'post',
        data:UtilsService.serialize({id:$scope.classID}),
        success: function(data){
            //$scope.classDetail = data.class;
        }
    })
}]);
//删除班级
lbApp.controller('classDelController', ['$scope','$routeParams', 'UtilsService', 'RequestService', function($scope,$routeParams, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    //章节信息
        RequestService.request({
            token:'t_classDel',
            method:'POST',
            data:UtilsService.serialize({id:$routeParams.classID}),
            loading:true,
            success:function(data){
                $scope.t_classListArr = data.result;
                UtilsService.href('/classList');
            }
        });


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
    $scope.classes ={
        //班级名称
        name:'',
        //课程名称
        courseName:'',
        //开课时间
        startTime:''
        //班级状态
        //status:''
    };
    $scope.classAdd = function(){
            RequestService.request({
                token:'t_classAdd',
                method:'POST',
                loading:true,
                data: UtilsService.serialize($scope.classes),
                success: function (data) {
                    UtilsService.href('/classList');
                }
            })
    }

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
            callback: function(dateString) {
                $scope.$apply(function() {
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
        if (!$scope.taskInfo.startTime) {
            $scope.dateError = '请选择开始日期';
            $scope.showDateError = true;
            return false;
        }
        //// 是否填写了结束时间
        //if (!$scope.taskInfo.endTime) {
        //    $scope.dateError = '请选择结束日期';
        //    $scope.showDateError = true;
        //    return false;
        //}
        // 开始日期是否大于结束日期
        //var startTimeStamp = (new Date($scope.taskInfo.startTime)).getTime();
        //var endTimeStamp = (new Date($scope.taskInfo.endTime)).getTime();
        //if (startTimeStamp > endTimeStamp) {
        //    $scope.dateError = '开始日期不能早于结束日期';
        //    $scope.showDateError = true;
        //    return false;
        //}
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
    //班级课程
    $scope.classCourse={};
    //章节列表
    $scope.classCourseSession = [];
    RequestService.request({
        token:'t_classCourse',
        method:'POST',
        loading:true,
        success:function(data){
            $scope.classCourse = data.course;
            $scope.classCourseSession = data.chapterList;
        }
    })
}]);

//章节设置
lbApp.controller('SessionController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    //章节信息
    $scope.t_chapter = {};
    RequestService.request({
        token:'t_classCourse',
        method:'POST',
        loading:true,
        success:function(data){
            $scope.t_chapter = data.chapter;
        }
    })

}]);

//新建章节
lbApp.controller('CreateSessionController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
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
    // 绑定弹框事件
    UtilsService.initPop($scope);

    $scope.t_exerciseList = [];
    RequestService.request({
        token:'t_exercise',
        method:'POST',
        loading:true,
        success:function(data){
            $scope.t_exerciseList = data.exerciseList;
        }
    })
}]);
//添加习题
lbApp.controller('SxerciseAddController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    // 绑定弹框事件
    UtilsService.initPop($scope);
    $scope.t_sel_exeList = [];
    RequestService.request({
        token:'t_exercise',
        method:'POST',
        loading:true,
        success:function(data){
            $scope.t_sel_exeList = data.exerciseList;
        }
    })

}]);

//添加习题
lbApp.controller('SxerciseAdd2Controller', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    // 绑定弹框事件
    UtilsService.initPop($scope);
    $scope.t_sel_exeList = [];
    RequestService.request({
        token:'t_exercise',
        method:'POST',
        loading:true,
        success:function(data){
            $scope.t_sel_exeList = data.exerciseList;
        }
    })

}]);
//学生管理
lbApp.controller('StudentController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    // 绑定弹框事件
    UtilsService.initPop($scope);
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

//我的课程
lbApp.controller('StudentClassController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    // 绑定弹框事件
    UtilsService.initPop($scope);
}]);
//我的课程详情
lbApp.controller('StudentClassDetailController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
}]);

//开始学习
lbApp.controller('StudyController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
}]);

//开始学习下一步
lbApp.controller('Study1Controller', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
}]);