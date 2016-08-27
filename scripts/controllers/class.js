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
        data:UtilsService.serialize({id:$routeParams.classID}),
        loading:true,
        success:function(data){
            $scope.classCourse = data.course;
            $scope.classCourse.classId = $routeParams.classID;
            console.log($scope.classCourse);
            chapterList($scope.classCourse.id);
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
            data:UtilsService.serialize({id:param}),
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
            //params: {chapterId: ID},
            data:UtilsService.serialize({chapterId:ID}),
            loading:true,
            success:function(data){
                location.reload()
                //UtilsService.href("/class/courseSetting/"+classID);
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
            console.log($routeParams);
            $scope.t_chapter = data;
            $scope.t_chapter.questionCount = '';
            $scope.t_chapter.classesId = $routeParams.classID;
        }
    });



    $scope.chapterUpdate = function(){
        RequestService.request({
            token:'t_chapterUpdate',
            method:'POST',
            data:UtilsService.serialize($scope.t_chapter),
            success:function(data){
                console.log(data);
                UtilsService.href("/class/courseSetting/"+data);
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
        classesId:$routeParams.classID,
        name:'',
        descriptionContent:'',
        status:'',
        orderNo:'',
        pattern:''
    };


    $scope.addChapter = function(){
        console.log($scope.t_chapter);
        RequestService.request({
            token:'t_addChapter',
            method:'POST',
            data:UtilsService.serialize($scope.t_chapter),
            loading:'true',
            success:function(data){
                console.log(data);
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
            console.log(data);
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
                console.log(data);
                $scope.t_exerciseList = data.result;
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
        //if (call) {
        //    data = call.id;
        //} else {
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

    $scope.submit11 = function(){
        RequestService.request({
            token:'',
            method:'POST',
            data:UtilsService.serialize({remark:$scope.studentInfo_r.remark})
        })

        alert("提交成功");
        $scope.closePop('pop-Remarks');
    }
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
lbApp.controller('StudentCourseController', ['$scope','$routeParams', 'UtilsService', 'RequestService', function($scope, $routeParams, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
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
    })
    //加入课程
    $scope.addCourse = function(classesId){
        RequestService.request({
            token:'s_addCourse',
            method:'POST',
            data:UtilsService.serialize({sequenceNo:$scope.s_myCourse.sequenceNo}),
            success:function(){
                alert("加入课程成功");
                $scope.closePop('pop-class');
                UtilsService.href('/student/course');
            }
        })
    }


    //退出课程
    $scope.delCourse = function(classesId){
        RequestService.request({
            token:'s_delCourse',
            method:'POST',
            data:UtilsService.serialize({classesId:$scope.s_myCourse.classesId}),
            success:function(){
                alert("退出成功");
            }
        })
    }

}]);

/*//退出课程
lbApp.controller('delCourseController', ['$scope','$routeParams', 'UtilsService', 'RequestService', function($scope, $routeParams, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    //退出课程
    RequestService.request({
        token:'s_delCourse',
        method:'POST',
        data:UtilsService.serialize({id:$routeParams.classesId}),
        loading:true,
        success:function(data){
            $scope.s_myCourse = data.result;
            alert("退出成功");
            UtilsService.href('/student/course');
        }
    });

}]);*/


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
    RequestService.request({
        token:'s_course',
        method:'post',
        data:UtilsService.serialize({courseId:$routeParams.classID}),
        success: function(data){
            console.log(data);
            $scope.course = data;
            //$scope.course.description = data.description;

            chapterList($scope.course.id);

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
    function chapterList(param){
        RequestService.request({
            token: 't_courseChapter',
            method: 'GET',
            data:UtilsService.serialize({courseId:param}),
            loading: true,
            success: function(data) {
                /*console.log(data);*/
                $scope.courseChapter = data.result;
                /*console.log($scope.courseChapter)*/
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
            window.setTimeout(function () {
                musicAudio.play();
            }, 1000);
        }
        if(NO == 3){
            //键盘校准 1 ， 2 ， 3 ， 4 ， 回车
            document.onkeydown=function(event){
                var e = event || window.event;
                if(e && e.keyCode==49){ // 按 1
                    $("#keyCode").find(".numberkey").removeClass("bgcolor-blue").eq(0).addClass("bgcolor-blue");
                }
                if(e && e.keyCode==50){ // 按 2
                    $("#keyCode").find(".numberkey").removeClass("bgcolor-blue").eq(1).addClass("bgcolor-blue");
                }
                if(e && e.keyCode==51){ // 按 3
                    $("#keyCode").find(".numberkey").removeClass("bgcolor-blue").eq(2).addClass("bgcolor-blue");
                }
                if(e && e.keyCode==52){ // 按 4
                    $("#keyCode").find(".numberkey").removeClass("bgcolor-blue").eq(3).addClass("bgcolor-blue");
                }
                if(e && e.keyCode==13){ // 按 4
                    $("#keyCode").find(".numberkey").removeClass("bgcolor-blue").eq(4).addClass("bgcolor-blue");
                }
            };
        }
        if(NO == 4){
            document.onkeydown=function(event){
                if(event && event.keyCode==13){ // 按 4
                    alert(1);
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
    },2000);


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
            $scope.exerciseInfo = data;
            $scope.execiseAnswer.chapterExerciseId = data.chapterExerciseId;
            $scope.execiseAnswer.exerciseId = data.id;
            $("#answer").html("");
            if($scope.exerciseInfo.questionsPronunciation.tones.length ==1 ){
                var html = '<div class="answer_empty">'+'</div>';
            }else if($scope.exerciseInfo.questionsPronunciation.tones.length ==2){
                var html = '<div class="key">'+
                    '<div class="answer_empty">'+'</div>'
                    +'</div>'
                    +'<div class="key">'+
                    '<div class="answer_empty">'+'</div>'
                    +'</div>';
            }else if($scope.exerciseInfo.questionsPronunciation.tones.length ==3){
                var html = '<div class="key">'+
                    '<div class="answer_empty">'+'</div>'
                    +'</div>'
                    +'<div class="key">'+
                    '<div class="answer_empty">'+'</div>'
                    +'</div>'
                    +'<div class="key">'+
                    '<div class="answer_empty">'+'</div>'
                    +'</div>'
            }else if($scope.exerciseInfo.questionsPronunciation.tones.length ==4){
                var html = '<div class="key">'+
                    '<div class="answer_empty">'+'</div>'
                    +'</div>'
                    +'<div class="key">'+
                    '<div class="answer_empty">'+'</div>'
                    +'</div>'
                    +'<div class="key">'+
                    '<div class="answer_empty">'+'</div>'
                    +'</div>'
                    +'<div class="key">'+
                    '<div class="answer_empty">'+'</div>'
                    +'</div>'
            }

            var a = $scope.exerciseInfo.questionsPronunciation.tones.length;
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
        var lengthNum = $scope.exerciseInfo.questionsPronunciation.tones.length;
        lengthNum += num;
        var codeT='';
        codeT += code;
        var i = $scope.exerciseInfo.questionsPronunciation.tones.length - lengthNum-1;
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
        if(lengthNum <= 0){
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
        }
    })
}]);