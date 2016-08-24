// 首页
lbApp.controller('ClassListController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    // 设置边栏
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };

    //班级状态
    $scope.statusMap = {
        '0':'准备中',
        '1':'开课中',
        '2':'已结课'
    };

    //班级列表
    $scope.t_classListArr = [];

    // 获取班级列表项
    RequestService.request({
        token: 't_classList',
        method: 'POST',
        success: function(data) {
            $scope.t_classListArr = data.result;
            console.log($scope.t_classListArr);
        }
    });

    //查询条件
    $scope.conditions = {
        name:'',
        startYear:''
    }

    $scope.select = function(){
        RequestService.request({
            token: 't_classList',
            method: 'POST',
            data:UtilsService.serialize($scope.conditions),
            success: function(data) {
                console.log(data);
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
    //班级
    $scope.classes = {
        id:$routeParams.classID,
        name:'',
        courseName:'',
        startTime:''
        //status:'1'
    };

    RequestService.request({
        token:'t_settingClass',
        method:'post',
        data:UtilsService.serialize({id:$routeParams.classID}),
        success: function(data){
            $scope.classes.name = data.result[0].name;
            $scope.classes.courseName = data.result[0].courseName;
            $scope.classes.startTime = data.result[0].startTime;
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
            disableFn: function(date) {
                return date.getTime() < Date.now() - 86400000;
            },
            callback: function(dateString) {
                $scope.$apply(function() {
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
    $scope.updateClass = function(){
        RequestService.request({
            token:'t_classUpdate',
            method:'POST',
            data:UtilsService.serialize($scope.classes),
            success: function(){
                UtilsService.href('/classList');
            }
        })
    }
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

        $scope.showDateError = false;
        return true;
    }

}]);

//课程管理
lbApp.controller('CourseController', ['$scope','$routeParams', 'UtilsService', 'RequestService', function($scope,$routeParams, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    //班级课程
    $scope.classCourse={};
    //课程详情
    RequestService.request({
        token:'t_classCourse',
        method:'POST',
        data:UtilsService.serialize({courseId:$routeParams.courseID}),
        loading:true,
        success:function(data){
            console.log(data);
            $scope.classCourse = data;
            console.log($scope.classCourse.id);
            chapterList($scope.classCourse.id);
        }
    })
    //章节列表
    $scope.classCourseChapter = [];
    function chapterList(param){
        RequestService.request({
            token:'t_courseChapter',
            method:'GET',
            data:UtilsService.serialize({id:param}),
            loading:true,
            success:function(data){
                console.log(data);
                $scope.classCourseChapter = data.result;
            }
        })
    }

    $scope.chapterDel = function(ID){
        RequestService.request({
            token:'t_chapterDel',
            method:'POST',
            params: {chapterId: ID},
            loading:true,
            success:function(data){
                alert(2);
                //UtilsService.href("/class/courseSetting");
            }
        });
    }

}]);

//章节设置
lbApp.controller('ChapterController', ['$scope','$routeParams', 'UtilsService', 'RequestService', function($scope, $routeParams,UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    //章节信息
    $scope.t_chapter = {};

    RequestService.request({
        token:'t_chapterShow',
        method:'POST',
        data:UtilsService.serialize({id:$routeParams.chapterID}),
        success:function(data){
            $scope.t_chapter = data.result[0];
        }
    });



    $scope.chapterUpdate = function(){
        RequestService.request({
            token:'t_chapterUpdate',
            method:'POST',
            data:UtilsService.serialize($scope.t_chapter),
            success:function(data){
                UtilsService.href("/class/courseSetting");
            }
        });
    }



}]);

//新建章节
lbApp.controller('CreateChapterController', ['$scope','$routeParams', 'UtilsService', 'RequestService', function($scope,$routeParams, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    //章节
    $scope.t_chapter = {
        courseId:$routeParams.courseID,
        name:'',
        descriptionContent:'',
        status:'',
        orderNo:'',
        pattern:''
    };


    $scope.addChapter = function(){
        RequestService.request({
            token:'t_addChapter',
            method:'POST',
            data:UtilsService.serialize($scope.t_chapter),
            loading:'true',
            success:function(data){
                UtilsService.href('/class/courseSetting/'+$scope.t_chapter.courseId);
            }
        })
    }

}]);
//习题管理
lbApp.controller('ExerciseController', ['$scope','$routeParams', 'UtilsService', 'RequestService', function($scope,$routeParams, UtilsService, RequestService) {
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
        token:'t_chapterShow',
        method:'POST',
        data:UtilsService.serialize({id:$routeParams.chapterID}),
        loading:true,
        success:function(data){
            $scope.t_chapterInfo = data;
        }
    });
    //RequestService.request({
    //    token:'t_exe_List',
    //    method:'POST',
    //    data:UtilsService.serialize({id:$routeParams.chapterID}),
    //    loading:true,
    //    success:function(data){
    //        alert("123");
    //        //$scope.t_exerciseList = data.exerciseList;
    //    }
    //});

    alert($routeParams.chapterID);
}]);
//添加习题
lbApp.controller('ExerciseAddController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
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

//添加习题
lbApp.controller('ExerciseAdd2Controller', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
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
//学生管理
lbApp.controller('StudentController', ['$scope','$routeParams', 'UtilsService', 'RequestService', function($scope, $routeParams,UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    // 绑定弹框事件
    UtilsService.initPop($scope);
    //班级学生
    $scope.class_student = [];
    $scope.classesID = $routeParams.classID;
    RequestService.request({
        token:'t_student',
        method:'POST',
        data:UtilsService.serialize({classesId:$routeParams.classID}),
        success:function(data){
            $scope.class_student = data.result;
        }
    });

    $scope.studentDel = function(classesID,studentID){
        RequestService.request({
            token:'t_studentDel',
            method:'POST',
            data:UtilsService.serialize({classesId:classesID,studentId:studentID}),
            success:function(){
                alert("删除成功");
            }
        })

    }
}]);
//学生详情
lbApp.controller('StudentDetailController', ['$scope','$routeParams', 'UtilsService', 'RequestService', function($scope,$routeParams, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    //学生个人信息
    $scope.studentInfo = {};
    RequestService.request({
        token:'t_studentInfo',
        method:'POST',
        data:UtilsService.serialize({studentId:$routeParams.studentId}),
        success:function(data){
            alert("获取学生个人信息成功");
            $scope.studentInfo = data.result[0];
        }
    })
}]);

//我的课程
lbApp.controller('StudentCourseController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    // 绑定弹框事件
    UtilsService.initPop($scope);

    RequestService.request({
        token:'s_course_list',
        method:'GET',
        success:function(data){
            alert("返回我的课程成功");
            console.log(data);
        }
    })
}]);
//我的课程详情
lbApp.controller('StudentCourseDetailController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
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

//音量校准
lbApp.controller('StudyVolumeController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
}]);

//键盘校准
lbApp.controller('StudyKeyController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
}]);

//请准备
lbApp.controller('StudyPrepareController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
}]);

//播放提示音
lbApp.controller('StudyPromptController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
}]);

//按键选答案
lbApp.controller('StudyKeyingController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
}]);

//错误提示
lbApp.controller('StudyErrorController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
}]);