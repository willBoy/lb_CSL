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
        courseName:'',
        startTime:'',
        status:''
    };

    RequestService.request({
        token:'t_settingClass',
        method:'post',
        data:UtilsService.serialize({id:$routeParams.classID}),
        success: function(data){
            $scope.classes.name = data.result[0].name;
            $scope.classes.courseName = data.result[0].courseName;
            $scope.classes.startTime = data.result[0].startTime;
            $scope.classes.status = data.result[0].status + "";
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
        '1':'以开放'
    };
    $scope.patternMap ={
        '0':'错题重做一次',
        '1':'错题重做到正确'
    }
    function chapterList(param){
        RequestService.request({
            token:'t_courseChapter',
            method:'GET',
            data:UtilsService.serialize({courseId:param}),
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

    RequestService.request({
        token:'t_addChapter',
        method:'POST',
        strParams:'courseId='+$routeParams.courseID,
        success:function(data){
            $scope.classCourse = data;
            console.log(data);
            console.log($routeParams.courseID);
            chapterList($routeParams.courseID);
        }
    })

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

//我的课程
lbApp.controller('StudentCourseController', ['$scope','$routeParams', 'UtilsService', 'RequestService', function($scope, $routeParams, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };

    //课程状态
    $scope.classesStatusMap = {
        '0':'未开课',
        '1':'开课中',
        '2':'已完结'
    }


    // 绑定弹框事件
    UtilsService.initPop($scope);
    $scope.s_myCourse = [];
    RequestService.request({
        token:'s_course_list',
        method:'GET',
        success:function(data){
            $scope.s_myCourse = data.result;
            console.log($scope.s_myCourse)
        }
    });


    //加入课程
    $scope.addCourse = function(sequenceNo){
        RequestService.request({
            token:'s_addCourse',
            method:'POST',
            data:UtilsService.serialize({sequenceNo:sequenceNo}),
            success:function(){
                alert("加入课程成功");
                $scope.closePop('pop-class');
                location.reload();
                //UtilsService.href('/student/course');
                //$scope.s_courseList();
            }
        })
    }


    //退出课程

    $scope.delCourse = function(classesId){
        RequestService.request({
            token:'s_delCourse',
            method:'POST',
            params: {classesId: classesId},
            data:UtilsService.serialize({classesId:classesId}),
            success:function(data){
                alert("退出成功");
                location.reload();
                //UtilsService.href("/class/courseSetting/"+classID);
                $scope.s_courseList();
            }
        });
    }


}]);



//我的课程详情
lbApp.controller('StudentCourseDetailController', ['$scope','$routeParams', 'UtilsService', 'RequestService', function($scope, $routeParams, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    $scope.course = {
        //课程名
        name:'',
        //课程简介
        description:''
    }
    //课程信息
    console.log($routeParams.classID);
    RequestService.request({
        token:'s_course',
        method:'post',
        data:UtilsService.serialize({courseId:$routeParams.courseID}),
        success: function(data){
            console.log(data);
            $scope.course = data;
            s_chapterList($scope.course.id);
        }
    });


    $scope.courseChapter = []/*{
        //章节号
        chapter_no:'',
        //章节名
        name:'',
        //章节内容介绍
        description:''
    }*/

    // 请求章节列表数据
    function s_chapterList(courseID){
        RequestService.request({
            token: 't_courseChapter',
            method: 'GET',
            data:UtilsService.serialize({courseId:courseID}),
            loading: true,
            success: function(data) {
                console.log(data);
                $scope.courseChapter = data.result;
            }
        });
    }
}]);

//开始学习
lbApp.controller('StudyController', ['$scope','$routeParams', 'UtilsService', 'RequestService', function($scope, $routeParams,UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    //页面切换
    $scope.p_status = '1';
    //页面切换的状态码
    $scope.pageStatus = {
        '1':'1',
        '2':'2',
        '3':'3',
        '4':'4'
    }
    $scope.pageS = function(NO){
        //切换
        $scope.p_status=$scope.pageStatus[NO];
        //音量校准
        if(NO==2){
            var musicAudio = document.getElementById("musicAudio");
                musicAudio.play();
        }
        if(NO == 3){
            var musicAudio = document.getElementById("musicAudio");
            musicAudio.pause();
            //键盘校准 1 ， 2 ， 3 ， 4 ， 回车
            document.onkeydown=function(event){
                var e = event || window.event;
                if(e && e.keyCode==49){ // 按 1
                    $("#keyCode").find(".numberkey").eq(0).addClass("bgcolor-blue");
                }
                if(e && e.keyCode==50){ // 按 2
                    $("#keyCode").find(".numberkey").eq(1).addClass("bgcolor-blue");
                }
                if(e && e.keyCode==51){ // 按 3
                    $("#keyCode").find(".numberkey").eq(2).addClass("bgcolor-blue");
                }
                if(e && e.keyCode==52){ // 按 4
                    $("#keyCode").find(".numberkey").eq(3).addClass("bgcolor-blue");
                }
                if(e && e.keyCode==13){ // 按 4
                    $("#keyCode").find(".numberkey").eq(4).addClass("bgcolor-blue");
                }
            };
        }
        if(NO == 4){
            document.onkeydown=function(event){
                if(event && event.keyCode==13){ // 按 4
                    UtilsService.href('/student/study_keying/'+$routeParams.chapterID);
                }
            };

        }

    }

    RequestService.request({
        token:'t_chapterShow',
        method:'POST',
        data:UtilsService.serialize({id:$routeParams.chapterID}),
        success:function(data){
            $scope.chapterInfo = data;
            shengcheng();
        }
    });

    function shengcheng(){
        RequestService.request({
            token:'t_exercise_list',
            method:'GET',
            params:{chapterId:$routeParams.chapterID},
            success:function(data){
                $scope.execiseID = data;
            }
        })
    }
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
lbApp.controller('StudyKeyingController', ['$scope', '$routeParams','UtilsService', 'RequestService', function($scope, $routeParams,UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    //练习
    $scope.exerciseInfo = {};
    //答题
    $scope.execiseAnswer = {
        chapterExerciseId:'',
        exerciseId:'',
        answer:'',
        answerBody:''
    };

    setTimeout(function(){
       $("#dududu").hide();
       $("#exerciseQ").show();
    },500);


    RequestService.request({
        token:'s_chapterExercise',
        method:'GET',
        params:{chapterExerciseId:$routeParams.exerciseID},
        success:function(data){
            console.log(data);
            chapterExercise(data);
        }
    });
        function chapterExercise(data){
            $("#dududu").show();
            $("#exerciseQ").hide();


            $scope.exerciseInfo = data;
            $scope.execiseAnswer.chapterExerciseId = data.chapterExerciseId;
            $scope.execiseAnswer.exerciseId = data.id;
            var filePath = $scope.exerciseInfo.questionsPronunciation.filePath.substr(12);
            //$scope.musicSrc = '';
            $scope.musicSrc = '../../vendor/mp3/'+$scope.exerciseInfo.questionsPronunciation.filePath.substr(12);
            console.log($scope.musicSrc);

            var dududu_Audio = document.getElementById('dududu_Audio');
            dududu_Audio.play();
            var musicAudio = document.getElementById('musicAuto');
            dududu_Audio.addEventListener('ended',function(){
                setTimeout(function(){
                    $("#dududu").hide();
                    $("#exerciseQ").show();
                    musicAudio.play();
                },500);
            },false);
            $("#answer").html("");
            if($scope.exerciseInfo.questionsPronunciation.tones.length ==1 ){
                var html = '<div class="answer_empty">'+'</div>';
            }else if($scope.exerciseInfo.questionsPronunciation.tones.length ==2){
                var html = '<div class="key">'+
                    '<div class="answer_empty">'+'</div>'+
                    '<div class="answer_empty">'+'</div>'
                    +'</div>';
            }else if($scope.exerciseInfo.questionsPronunciation.tones.length ==3){
                var html = '<div class="key">'+
                    '<div class="answer_empty">'+'</div>'+
                    '<div class="answer_empty">'+'</div>'+
                    '<div class="answer_empty">'+'</div>'
                    +'</div>'
            }else if($scope.exerciseInfo.questionsPronunciation.tones.length ==4){
                var html = '<div class="key">'+
                    '<div class="answer_empty">'+'</div>'+
                    '<div class="answer_empty">'+'</div>'+
                    '<div class="answer_empty">'+'</div>'+
                    '<div class="answer_empty">'+'</div>'
                    +'</div>'
            }
             $scope.lengthNum = $scope.exerciseInfo.questionsPronunciation.tones.length;
            $("#answer").html(html);
        }
        document.onkeydown=function(event){
            if(event && event.keyCode==49){ // 按 1
                if($("#exerciseQ").is(":visible")){
                    select(-1,1);
                }
            }
            if(event && event.keyCode==50){ // 按 2
                if($("#exerciseQ").is(":visible")){
                    select(-1,2);
                }
            }
            if(event && event.keyCode==51){ // 按 3
                if($("#exerciseQ").is(":visible")){
                    select(-1,3);
                }
            }
            if(event && event.keyCode==52){ // 按 4
                if($("#exerciseQ").is(":visible")){
                    select(-1,4);
                }
            }
        };
    function select(num,code){
        --$scope.lengthNum;
        var codeT='';
        codeT += code;
        var i = $scope.exerciseInfo.questionsPronunciation.tones.length - $scope.lengthNum-1;
        var selectHtml = '<span class="icon icons-'+code+'"></span>';
        $("#answer").find('.answer_empty').eq(i).html(selectHtml);
        $scope.execiseAnswer.answerBody = codeT;
        if(i=0){
            if($scope.exerciseInfo.questionsPronunciation.tones == code){
                $scope.execiseAnswer.answer = true;
            }else{
                $scope.execiseAnswer.answer = false;
            }
        }else{
            if($scope.exerciseInfo.questionsPronunciation.tones == codeT){
                $scope.execiseAnswer.answer = true;
            }else{
                $scope.execiseAnswer.answer = false;
            }
        }
        //判断是否为空
        function isEmptyObject(obj){
            for(var n in obj){return false}
            return true;
        }
        if($scope.lengthNum <= 0){
            console.log($scope.execiseAnswer);
            RequestService.request({
                token:'s_exe_sub',
                method:'POSt',
                data:UtilsService.serialize($scope.execiseAnswer),
                success:function(data){
                    console.log(data);
                    if(isEmptyObject(data)){
                        //$scope.exe_submit();
                        UtilsService.href('/student/study_finish/'+$routeParams.exerciseID);
                    }else{
                        chapterExercise(data);
                    }

                }
            })
        }
    }


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
//完成做题
lbApp.controller('StudyFinishController', ['$scope','$routeParams', 'UtilsService', 'RequestService', function($scope, $routeParams,UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    RequestService.request({
        token:'s_exe_submit',
        method:'POST',
        params:{chapterExerciseId:$routeParams.exerciseID},
        success:function(data){
            $scope.exerciseResult = data;
            var r_Code = data.rightCount/(data.rightCount+data.wrongCount);
            var b =  r_Code.toFixed(4);
            $scope.percentCode = b.slice(2,4)+"."+b.slice(4,6)+"%";
                var startTime = data.startTimeStr;
                var endTime = data.endTimeStr;
                var startT_date = new Date(startTime);
                var endT_date = new Date(endTime);
                var m=parseInt(Math.abs(endT_date-startT_date));
                console.log(m);
             $scope.ave_time = m/(data.rightCount+data.wrongCount);

        }
    })
}]);