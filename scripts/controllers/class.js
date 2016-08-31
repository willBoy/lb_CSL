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
            $scope.total = data.total;
            console.log($scope.t_classListArr);
            console.log($scope.t_classListArr.courseId);
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
        startTime:'',
        status:'',
        course:{
            id:'',
            name:'',
            description:''
        }
    };

    RequestService.request({
        token:'t_settingClass',
        method:'post',
        data:UtilsService.serialize({id:$routeParams.classID}),
        success: function(data){
            console.log(data);
            $scope.classes.name = data.result[0].name;
            $scope.classes.startTime = data.result[0].startTime;
            $scope.classes.status = data.result[0].status + "";
            $scope.classes.course.id = data.result[0].courseId;
            $scope.classes.course.name = data.result[0].courseName;
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
    //班级信息
    $scope.classes ={
        //班级名称
        name:'',
        //课程名称
        courseName:'',
        // 课程简介
        description:'',
        //开课时间
        startTime:''
        //班级状态
        //status:''
    };

    $scope.classAdd = function(){
        RequestService.request({
            token:'t_classAdd',
            method:'POST',
            data: UtilsService.serialize($scope.classes),
            /*strParams:'name'+classes.name+'courseName=' + classes.courseName + '&startTime='+classes.startTime,*/
            success: function (data) {
                console.log(data);
                alert("创建班级成功");
                UtilsService.href('/classList');
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

//课程管理
lbApp.controller('CourseController', ['$scope','$routeParams', 'UtilsService', 'RequestService', function($scope,$routeParams, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    //班级课程
    $scope.classCourse={
        courseName:'',
        description:''
    };

    //课程详情
    RequestService.request({
        token:'t_classCourse',
        method:'POST',
        strParams:'courseId='+$routeParams.courseID,
        success:function(data){
            $scope.classCourse = data;
            console.log(data);
            console.log($routeParams.courseID);
            chapterList($routeParams.courseID);
        }
    })

    //章节列表
    $scope.classCourseChapter = [];
    $scope.orderNoMap ={
        '0':'顺序',
        '1':'随机'
    };
    $scope.statusMap ={
        '0':'准备中',
        '1':'已开放'
    };
    $scope.patternMap ={
        '0':'错题重做一次',
        '1':'错题重做到正确'
    }
    function chapterList(){
        RequestService.request({
            token:'t_courseChapter',
            method:'GET',
            strParams:'courseId='+$routeParams.courseID,
            loading:true,
            success:function(data){
                console.log(data);
                $scope.classCourseChapter = data.result;
            }
        })
    }

    $scope.chapterDel = function(ID,classID){
        RequestService.request({
            token:'t_chapterDel',
            method:'POST',
            params: {chapterId: ID},
            loading:true,
            success:function(data){
                location.reload();
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
            console.log(data);
            $scope.t_chapter = data;
            $scope.t_chapter.orderNo = data.orderNo + "";
            $scope.t_chapter.pattern = data.pattern + "";
            $scope.t_chapter.status = data.status + "";
            $scope.t_chapter.descriptionCn = data.descriptionCn;
            $scope.t_chapter.classesId = $routeParams.classID;
        }
    });



    $scope.chapterUpdate = function(){
        RequestService.request({
            token:'t_chapterUpdate',
            method:'POST',
            data:UtilsService.serialize($scope.t_chapter),
            success:function(data){
                console.log(data.courseId);
                UtilsService.href("/class/courseSetting/"+data.courseId);
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



    $scope.addChapter = function(t_chapter){
        console.log(t_chapter);
        RequestService.request({
            token:'t_addChapter',
            method:'POST',
            //strParams:'name=' + t_chapter.name + '&descriptionContent='+t_chapter.descriptionContent + '&courseId='+t_chapter.courseId,
            data:UtilsService.serialize($scope.t_chapter),
            loading:'true',
            success:function(data){
                console.log(data);
                alert("创建章节成功");
                //Utils.href('/class/courseSetting/');
                UtilsService.href('/class/courseSetting/'+data)
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
            t_exe_show();
        }
    });

    function t_exe_show() {
        RequestService.request({
            token:'t_exe_list',
            method:'POST',
            data:UtilsService.serialize({chapterId:$routeParams.chapterID}),
            loading:true,
            success:function(data){
                console.log(data.result);
                $scope.t_exerciseList = data.result;

            }
        });
    }

    $scope.exe_del = function(ID){
        RequestService.request({
            token:'t_exe_del',
            method:'POST',
            params:{id:ID},
            loading:true,
            success:function(data){
                console.log(data.result);
                location.reload();
                //$scope.t_exerciseList = data.result;
            }
        });
    }

}]);
//添加习题
lbApp.controller('ExerciseAddController', ['$scope','$routeParams', 'UtilsService', 'RequestService', function($scope,$routeParams, UtilsService, RequestService) {
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

    $scope.getExerciseList = function(){
            RequestService.request({
            token:'t_exeIndex',
            method:'POST',
            data:UtilsService.serialize($scope.exeIndex),
            loading:true,
            success:function(data){
                $scope.t_sel_exeList = data.result;
                $scope.exeIndex={};
                for (var i = 0; i < $scope.t_sel_exeList.length; i++) {
                    $scope.selectedCallList[$scope.t_sel_exeList[i].id] = false;
                }
            }
        });
    };

    // 是否选择全部外呼
    $scope.callAll = false;
    $scope.$watch('callAll', function() {
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
    $scope.changeCallAll = function() {
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
    $scope.addExe = function(call) {
        var data = '';
            for (var jid in $scope.selectedCallList) {
                if ($scope.selectedCallList[jid]) {
                    data += '@@' + jid;
                }
            }
            data = data.slice(2);
            RequestService.request({
                token:'t_addExe',
                method:'POST',
                data:UtilsService.serialize({questionIds:data,chapterId:$routeParams.chapterID}),
                success:function(data){
                    alert("添加习题成功");
                    location.reload();

                }
            })
        };

    $scope.tonesMap = {
        1:'1',
        2:'2',
        3:'3',
        4:'4'
    };

    $scope.qingshengMap = {
        0:'无（非必读）',
        1:'必读',
        2:'可读'
    };

    $scope.erhuaMap = {
        0:'无',
        1:'有'
    };

    $scope.speakerMap = {
        1:'普通话水平测试（男）',
        2:'普通话水平测试(女)'
    };
    $scope.hskLevelMap = {
        1:'HSK-1',
        2:'HSK-2',
        3:'HSK-3',
        4:'HSK-4',
        5:'HSK-5',
        6:'HSK-6',
        7:'超纲'
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






    $scope.testAdd = function(){
        console.log($scope.arrayList);
    }
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

    //修改备注
    $scope.studentInfo_r = {
        remark:''
    };


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
    //学生备注
    $scope.submitRemark = function(classesID,studentID){
        RequestService.request({
            token:'t_studentRemark',
            method:'POST',
            data:UtilsService.serialize({classesId:classesID,studentId:studentID,remark:$scope.studentInfo_r.remark})
        })

        alert("提交成功");
        $scope.closePop('pop-Remarks');
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


