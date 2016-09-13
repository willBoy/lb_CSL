// 教師端-班級管理
lbApp.controller('ClassListController', ['$scope', 'UtilsService', 'RequestService', function ($scope, UtilsService, RequestService) {
    //
    "use strict";
    // 设置边栏
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    // 绑定弹框事件
    UtilsService.initPop($scope);

    //班级状态
    $scope.statusMap = {
        '0': '准备中',
        '1': '开课中',
        '2': '已结课'
    };
    //班级总数
    $scope.total = 0;
    //查询条件
    $scope.conditions = {
        // 值查询
        common: {
            // 班级名字
            name: '',
            // 开课时间
            startYear: '2016'
        },
        // 排序条件
        order: {},
        // 分页信息
        pageInfo: {
            page: 1,
            pageSize: '10',
            totalPage: 0
        }
    };
    $(".hove").mouseover(function(){
        console.log(111);
        $(".hovemoue").show();
    });
    //班级列表
    $scope.t_classListArr = {};

    // 获取班级列表项
    $scope.getclasslist = function (page) {
        $scope.conditions.pageInfo.page = page || 1;
        RequestService.request({
            token: 't_classList',
            method: 'POST',
            strParams: UtilsService.genConditions($scope.conditions),
            success: function (data) {
                console.log(data);
                $scope.conditions.pageInfo.totalPage = data.pages;
                $scope.t_classListArr = data.result;
                $scope.total = data.total;

            }
        });
    }
    $scope.getclasslist(1);

    $scope.engineer = {
        name: "Dani",
        currentActivity: "2016"
    };

    $scope.activities =
        [
            "2016",
            "2017"
        ];
    $scope.delclass = function(id){
        if(confirm("确定要删除吗？"))
        {
            RequestService.request({
                token: 't_classDel',
                method: 'POST',
                data: UtilsService.serialize({id: id}),
                loading: true,
                success: function (data) {
                    UtilsService.href('/class/delClass/'+id);
                }
            });
        }
    };
    var timer;
    $scope.showUserOp = function() {
        clearTimeout(timer);
        $scope.userOpIsShow = true;
    };
    $scope.hideUserOp = function() {
        timer = setTimeout(function() {
            $scope.$apply(function() {
                $scope.userOpIsShow = false;
            });
        }, 300);
    };
    //删除班级
    /*$scope.delclass = function (id) {
     RequestService.request({
     token: 't_classDel',
     method: 'POST',
     strParams: 'id=' + id,
     success: function (data) {
     /!* $scope.t_classListArr = data.result;*!/
     console.log($scope.t_classListArr);
     UtilsService.href('/classList');
     $scope.closePop('pop-del')
     }
     });
     }*/

}]);
//班级设置
lbApp.controller('ClassDetailController', ['$scope', '$routeParams', 'UtilsService', 'RequestService', function ($scope, $routeParams, UtilsService, RequestService) {
    "use strict";
    // 设置边栏
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    //班级
    $scope.classes = {
        id:$routeParams.classID,
        course:{
            id:$routeParams.courseID,
            name:'',
            description:''
        },
        name:'',
        /*courseName:'',*/
        startTime:'',
        status:''
    };
    /*$scope.modify =false;*/
    $scope.modify = "";
    RequestService.request({
        token: 't_settingClass',
        method: 'post',
        strParams: 'id=' + $routeParams.classID,
        success: function (data) {
            console.log(data);
            $scope.classes.name= data.name;
            $scope.classes.course.name= data.courseName;
            $scope.classes.startTime= data.startTime;
            $scope.classes.course.description= data.course.description;
            $scope.classes.status = data.status + "";
            $scope.modify = data.status + "";
            /*if( data.status + "" == '0'){
                $scope.modify =true;
            }*/
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
            disableFn: function (date) {
                return date.getTime() < Date.now() - 86400000;
            },
            callback: function (dateString) {
                $scope.$apply(function () {
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
    $scope.updateClass = function () {
        RequestService.request({
            token: 't_classUpdate',
            method: 'POST',
            /*strParams: UtilsService.genConditions($scope.classes),*/
            data: UtilsService.serialize($scope.classes),
            success: function () {
                /*console.log(data);*/
                UtilsService.href('/classList');
            }
        })
    }
}]);
//删除班级
lbApp.controller('classDelController', ['$scope', '$routeParams', 'UtilsService', 'RequestService', function ($scope, $routeParams, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };

    //章节信息
    RequestService.request({
        token: 't_classDel',
        method: 'POST',
        data: UtilsService.serialize({id: $routeParams.classID}),
        loading: true,
        success: function (data) {
            $scope.t_classListArr = data.result;
            console.log($scope.t_classListArr);
            UtilsService.href('/classList');
        }
    });


}]);
//新建班级
lbApp.controller('CreateClassController', ['$scope', 'UtilsService', 'RequestService', function ($scope, UtilsService, RequestService) {
    //
    "use strict";
    // 设置边栏
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    //班级信息
    $scope.classes = {
        /*//班级名称
         name: '',
         //课程名称
         course.name: '',
         // 课程简介
         course.description: '',
         //开课时间
         startTime: ''
         //班级状态*/

    };

    $scope.classAdd = function () {
        RequestService.request({
            token: 't_classAdd',
            method: 'POST',
            data: $.param($scope.classes),
            /*strParams:'name'+name+'courseName=' + courseName + '&startTime='+ startTime,*/
            success: function (data) {
                console.log(data);
                /*alert("创建班级成功");*/
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
            callback: function (dateString) {
                $scope.$apply(function () {
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
lbApp.controller('CourseController', ['$scope', '$routeParams', 'UtilsService', 'RequestService', function ($scope, $routeParams, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    //班级课程
    $scope.classCourse = {
        courseName: '',
        description: ''
    };

    //课程详情
    RequestService.request({
        token: 't_classCourse',
        method: 'POST',
        strParams: 'courseId=' + $routeParams.courseID,
        success: function (data) {
            $scope.classCourse = data;
            /*console.log(data);*/
            /*console.log($routeParams.courseID);*/
            /*$scope.chapterList($routeParams.courseID);*/
            $scope.chapterList(1);
        }
    })

    //章节列表
    $scope.classCourseChapter = [];
    $scope.orderNoMap = {
        '0': '随机',
        '1': '顺序'
    };
    $scope.statusMap = {
        '0': '准备中',
        '1': '已开放'
    };
    $scope.statusList = [
        {key:'0',value:'准备中'},
        {key:'1',value:'以开放'}
    ]
    $scope.patternMap = {
        '0': '错题重做一次',
        '1': '错题重做到正确'
    };
    //查询条件
    $scope.conditions = {
        // 值查询
        /*courseId:$routeParams.courseID,*/
        common: {
            courseId:$routeParams.courseID
        },
        // 排序条件
        order: {},
        // 分页信息
        pageInfo: {
            page: 1,
            pageSize: '10',
            totalPage: 0
        }
    }

// 获取章节列表项
    $scope.chapterList = function (page) {
        $scope.conditions.pageInfo.page = page || 1;
        RequestService.request({
            token: 't_courseChapter',
            method: 'POST',
            /*strParams: UtilsService.genConditions($scope.conditions),*/
            strParams: UtilsService.genConditions($scope.conditions),
            success: function (data) {
                console.log(data);
                $scope.conditions.pageInfo.totalPage = data.pages;
                $scope.classCourseChapter = data.result;
                $scope.total = data.total;

            }
        });
    }
    //删除章节
    $scope.chapterDel = function (ID) {
        if(confirm("确定要删除吗？"))
        {
            RequestService.request({
                token: 't_chapterDel',
                method: 'POST',
                params: {chapterId: ID},
                loading: true,
                success: function (data) {
                    console.log(data)
                    location.reload();
                }
            });
        }

    }

}]);

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
        UtilsService.href("/class/courseSetting/" + $scope.t_chapter.courseId);
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
                UtilsService.href("/class/courseSetting/" + $scope.t_chapter.courseId);
            }
        });
    }

}]);

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
            /*loading:'true',*/
            success: function (data) {
                console.log(data);
                /*alert("创建章节成功");*/
                UtilsService.href('/class/courseSetting/' + courseId)
            }
        })
    }

    /*$scope.exe_del = function (ID) {
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
     }*/

}]);

//添加习题
/*lbApp.controller('ExerciseAddController', ['$scope', '$routeParams', 'UtilsService', 'RequestService', function ($scope, $routeParams, UtilsService, RequestService) {
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

 /!**
 * 批量添加习题
 *!/
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
 /!*alert("添加习题成功");*!/
 /!*UtilsService.href('/class/exercise/' + $routeParams.chapterID);*!/
 console.log(data);
 /!*alert('您成功添加了'+data.re'')*!/
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
 }]);*/



//学生管理
lbApp.controller('StudentController', ['$scope', '$routeParams', 'UtilsService', 'RequestService', function ($scope, $routeParams, UtilsService, RequestService) {
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
        remark: ''
    };
    $scope.gender = {
        0: '男',
        1: '女'
    };
    //查询条件
    $scope.conditions = {
        common: {
            /*// 名字
             chineseName: '',
             // 性别
             gender: 0,
             // 母语
             nationality: 0*/
            classesId: $routeParams.classesID,
        },
        // 分页信息
        pageInfo: {
            page: 1,
            pageSize: '10',
            totalPage: 0
        }

    }
    /*$scope.activities={
     0:'男',
     1:'女'
     }*/
    $scope.activities=[
        0,1
    ]
    $scope.nationality=[
        0,1
    ]
    //班级学生
    $scope.class_student = {
        //
        remark:'',
        id:''
    };
    $scope.classesID = $routeParams.classID;

    //学生总数
    $scope.total = 0;
    // 获取班级列表项
    $scope.studentList = function (page) {
        $scope.conditions.pageInfo.page = page || 1;
        RequestService.request({
            token: 't_student',
            method: 'POST',
            strParams: UtilsService.genConditions($scope.conditions),
            success: function (data) {
                console.log(data);
                /*console.log(data.remark);*/
                $scope.conditions.pageInfo.totalPage = data.pages;
                $scope.class_student = data.result;
                $scope.total = data.total;

            }
        });
    }
    $scope.studentList(1);
    /*$scope.studentList = function () {
     RequestService.request({
     token: 't_student',
     method: 'POST',
     data: UtilsService.serialize({classesId: $routeParams.classesID}),
     success: function (data) {
     $scope.class_student = data.result;
     console.log($scope.class_student[0].id)
     }
     });
     }*/
    /*$scope.studentList();*/
    $scope.studentInfo = {
        //英文名
        englishName: '',
        //中文名
        chineseName: '',
        //性别
        gender: '',
        //邮箱
        email: '',
        //年龄
        age: '',
        //手机号
        phoneNumber: '',
        //国籍
        nationality: '',
        //母语
        motherTongue: '',
        //外语
        foreignLanguage: ''
    };
    $scope.gender={
        0: '男',
        1: '女'

    },
    //学生详情
    $scope.studentDetail=function(id){
        $scope.openPop('pop-detail')
        //学生个人信息
        RequestService.request({
            token: 't_studentInfo',
            method: 'POST',
            strParams: "studentId=" + id,
            /*data:UtilsService.serialize({studentId:$routeParams.studentId}),*/
            success: function (data) {
                console.log(data)
                $scope.studentInfo = data;
                /*$scope.studentInfo.classId = data.id;*/
            }
        })
    }

    //删除学生
    $scope.studentDel = function (studentID) {
        if(confirm("确定要删除吗？"))
        {
            RequestService.request({
                token: 't_studentDel',
                method: 'POST',
                data: UtilsService.serialize({classesId: $routeParams.classesID, studentId: studentID}),
                success: function () {
                    /*alert("删除成功");*/
                    /*console.log(classesID);*/
                    location.reload();
                    /*$scope.studentList();*/
                }
            })
            location.reload();
        }

    }
    $scope.remark='';
    //学生备注
    $scope.remarks =function(studentId){
        $scope.openPop('pop-Remarks');
        $scope.submitRemark = function (remark) {
            console.log(studentId);
            RequestService.request({
                token: 't_studentRemark',
                method: 'POST',
                strParams: 'classesId=' + $routeParams.classesID + '&studentId=' + studentId + '&remark=' + remark,
                /*data:UtilsService.serialize({classID:$routeParams.classID,studentId:$routeParams.studentId,remark:$scope.studentInfo_r.remark}),*/
                success: function () {
                    $scope.studentList();
                }
            })
            $scope.remark='';
            /*alert("提交成功");*/
            $scope.closePop('pop-Remarks');
        }

    }
    /*$scope.clear = function(remark){
        remark=''

    }*/
    $scope.clearandclosePop = function(remark){
        $scope.remark='';
        $scope.closePop('pop-Remarks');
    }

    //重置密码
    $scope.resetpwd = function(studentId){

        var encode = new Base64();
        $scope.rePassword = encode.encode('123456');
            RequestService.request({
                token: 't_studentResetPassword',
                method: 'POST',
                strParams: 'id=' + studentId + '&password=' + $scope.rePassword,
                success: function (data) {
                    $scope.openPop('pop-resetpwd');
                    $scope.resetPassword = function () {
                        $scope.closePop('pop-resetpwd');
                    }

                }
            })
    }
    $scope.resetPassword = function (password) {
        RequestService.request({
            token: 't_studentResetPassword',
            method: 'POST',
            strParams: 'id=' + $scope.class_student.id + '&password=' + password,
            /*data:UtilsService.serialize({classID:$routeParams.classID,studentId:$routeParams.studentId,remark:$scope.studentInfo_r.remark}),*/
            success: function () {
                /*alert("修改成功");*/
                $scope.closePop('pop-resetpwd')
            }
        })
    }

}]);


//我的课程
lbApp.controller('StudentCourseController', ['$scope', '$routeParams', 'UtilsService', 'RequestService', function ($scope, $routeParams, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };

    //课程状态
    $scope.classesStatusMap = {
        '0': '未开课',
        '1': '开课中',
        '2': '已完结'
    }


    // 绑定弹框事件
    UtilsService.initPop($scope);
    $scope.s_myCourse = [];
    RequestService.request({
        token: 's_course_list',
        method: 'GET',
        success: function (data) {
            $scope.s_myCourse = data.result;
            console.log($scope.s_myCourse)
        }
    });


    //加入课程
    $scope.addCourse = function (sequenceNo) {
        RequestService.request({
            token: 's_addCourse',
            method: 'POST',
            data: UtilsService.serialize({sequenceNo: sequenceNo}),
            success: function () {
                /*alert("加入课程成功");*/
                $scope.closePop('pop-class');
                location.reload();
                //UtilsService.href('/student/course');
                //$scope.s_courseList();
            }
        })
    }


    //退出课程

    $scope.delCourse = function (classesId) {
        RequestService.request({
            token: 's_delCourse',
            method: 'POST',
            params: {classesId: classesId},
            data: UtilsService.serialize({classesId: classesId}),
            success: function (data) {
                /*alert("退出成功");*/
                //UtilsService.href("/class/courseSetting/"+classID);
                $scope.s_courseList();
            }
        });
    }


}]);


//我的课程详情
lbApp.controller('StudentCourseDetailController', ['$scope', '$routeParams', 'UtilsService', 'RequestService', function ($scope, $routeParams, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    $scope.course = {
        //课程名
        name: '',
        //课程简介
        description: ''
    }
    //课程信息
    console.log($routeParams.classID);
    RequestService.request({
        token: 's_course',
        method: 'post',
        data: UtilsService.serialize({courseId: $routeParams.courseID}),
        success: function (data) {
            console.log(data);
            $scope.course = data;
            s_chapterList($scope.course.id);
        }
    });


    $scope.courseChapter = []
    /*{
     //章节号
     chapter_no:'',
     //章节名
     name:'',
     //章节内容介绍
     description:''
     }*/

    // 请求章节列表数据
    function s_chapterList(courseID) {
        RequestService.request({
            token: 't_courseChapter',
            method: 'GET',
            data: UtilsService.serialize({courseId: courseID}),
            loading: true,
            success: function (data) {
                console.log(data);
                $scope.courseChapter = data.result;
            }
        });
    }
}]);

//开始学习
lbApp.controller('StudyController', ['$scope', '$routeParams', 'UtilsService', 'RequestService', function ($scope, $routeParams, UtilsService, RequestService) {
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
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4'
    }
    $scope.pageS = function (NO) {
        //切换
        $scope.p_status = $scope.pageStatus[NO];
        //音量校准
        if (NO == 2) {
            var musicAudio = document.getElementById("musicAudio");
            musicAudio.play();
        }
        if (NO == 3) {
            var musicAudio = document.getElementById("musicAudio");
            musicAudio.pause();
            //键盘校准 1 ， 2 ， 3 ， 4 ， 回车
            document.onkeydown = function (event) {
                var e = event || window.event;
                if (e && e.keyCode == 49) { // 按 1
                    $("#keyCode").find(".numberkey").eq(0).addClass("bgcolor-blue");
                }
                if (e && e.keyCode == 50) { // 按 2
                    $("#keyCode").find(".numberkey").eq(1).addClass("bgcolor-blue");
                }
                if (e && e.keyCode == 51) { // 按 3
                    $("#keyCode").find(".numberkey").eq(2).addClass("bgcolor-blue");
                }
                if (e && e.keyCode == 52) { // 按 4
                    $("#keyCode").find(".numberkey").eq(3).addClass("bgcolor-blue");
                }
                if (e && e.keyCode == 13) { // 按 4
                    $("#keyCode").find(".numberkey").eq(4).addClass("bgcolor-blue");
                }
            };
        }
        if (NO == 4) {
            document.onkeydown = function (event) {
                if (event && event.keyCode == 13) { // 按 4
                    UtilsService.href('/student/study_keying/' + $routeParams.chapterID);
                }
            };

        }

    }

    RequestService.request({
        token: 't_chapterShow',
        method: 'POST',
        data: UtilsService.serialize({id: $routeParams.chapterID}),
        success: function (data) {
            $scope.chapterInfo = data;
            shengcheng();
        }
    });

    function shengcheng() {
        RequestService.request({
            token: 't_exercise_list',
            method: 'GET',
            params: {chapterId: $routeParams.chapterID},
            success: function (data) {
                $scope.execiseID = data;
            }
        })
    }
}]);

//开始学习下一步
lbApp.controller('Study1Controller', ['$scope', 'UtilsService', 'RequestService', function ($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
}]);

//音量校准
lbApp.controller('StudyVolumeController', ['$scope', 'UtilsService', 'RequestService', function ($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
}]);

//键盘校准
lbApp.controller('StudyKeyController', ['$scope', 'UtilsService', 'RequestService', function ($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
}]);

//请准备
lbApp.controller('StudyPrepareController', ['$scope', 'UtilsService', 'RequestService', function ($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
}]);

//播放提示音
lbApp.controller('StudyPromptController', ['$scope', 'UtilsService', 'RequestService', function ($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
}]);

//按键选答案
lbApp.controller('StudyKeyingController', ['$scope', '$routeParams', 'UtilsService', 'RequestService', function ($scope, $routeParams, UtilsService, RequestService) {
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
        chapterExerciseId: '',
        exerciseId: '',
        answer: '',
        answerBody: ''
    };

    setTimeout(function () {
        $("#dududu").hide();
        $("#exerciseQ").show();
    }, 2000);


    RequestService.request({
        token: 's_chapterExercise',
        method: 'GET',
        params: {chapterExerciseId: $routeParams.exerciseID},
        success: function (data) {
            console.log(data);
            chapterExercise(data);
        }
    });
    function chapterExercise(data) {
        $("#dududu").show();
        $("#exerciseQ").hide();
        var dududu_Audio = document.getElementById('dududu_Audio');
        dududu_Audio.play();
        dududu_Audio.addEventListener('ended', function () {
            setTimeout(function () {
                $("#dududu").hide();
                $("#exerciseQ").show();
            }, 500);
        }, false);


        $scope.exerciseInfo = data;
        $scope.execiseAnswer.chapterExerciseId = data.chapterExerciseId;
        $scope.execiseAnswer.exerciseId = data.id;
        $("#answer").html("");
        if ($scope.exerciseInfo.questionsPronunciation.tones.length == 1) {
            var html = '<div class="answer_empty">' + '</div>';
        } else if ($scope.exerciseInfo.questionsPronunciation.tones.length == 2) {
            var html = '<div class="key">' +
                '<div class="answer_empty">' + '</div>' +
                '<div class="answer_empty">' + '</div>'
                + '</div>';
        } else if ($scope.exerciseInfo.questionsPronunciation.tones.length == 3) {
            var html = '<div class="key">' +
                '<div class="answer_empty">' + '</div>' +
                '<div class="answer_empty">' + '</div>' +
                '<div class="answer_empty">' + '</div>'
                + '</div>'
        } else if ($scope.exerciseInfo.questionsPronunciation.tones.length == 4) {
            var html = '<div class="key">' +
                '<div class="answer_empty">' + '</div>' +
                '<div class="answer_empty">' + '</div>' +
                '<div class="answer_empty">' + '</div>' +
                '<div class="answer_empty">' + '</div>'
                + '</div>'
        }
        $scope.lengthNum = $scope.exerciseInfo.questionsPronunciation.tones.length;
        $("#answer").html(html);
    }

    document.onkeydown = function (event) {
        if (event && event.keyCode == 49) { // 按 1
            if ($("#exerciseQ").is(":visible")) {
                select(-1, 1);
            }
        }
        if (event && event.keyCode == 50) { // 按 2
            if ($("#exerciseQ").is(":visible")) {
                select(-1, 2);
            }
        }
        if (event && event.keyCode == 51) { // 按 3
            if ($("#exerciseQ").is(":visible")) {
                select(-1, 3);
            }
        }
        if (event && event.keyCode == 52) { // 按 4
            if ($("#exerciseQ").is(":visible")) {
                select(-1, 4);
            }
        }
    };
    function select(num, code) {
        --$scope.lengthNum;
        var codeT = '';
        codeT += code;
        var i = $scope.exerciseInfo.questionsPronunciation.tones.length - $scope.lengthNum - 1;
        var selectHtml = '<span class="icon icons-' + code + '"></span>';
        $("#answer").find('.answer_empty').eq(i).html(selectHtml);
        $scope.execiseAnswer.answerBody = codeT;
        if (i = 0) {
            if ($scope.exerciseInfo.questionsPronunciation.tones == code) {
                $scope.execiseAnswer.answer = true;
            } else {
                $scope.execiseAnswer.answer = false;
            }
        } else {
            if ($scope.exerciseInfo.questionsPronunciation.tones == codeT) {
                $scope.execiseAnswer.answer = true;
            } else {
                $scope.execiseAnswer.answer = false;
            }
        }
        //判断是否为空
        function isEmptyObject(obj) {
            for (var n in obj) {
                return false
            }
            return true;
        }

        if ($scope.lengthNum <= 0) {
            console.log($scope.execiseAnswer);
            RequestService.request({
                token: 's_exe_sub',
                method: 'POSt',
                data: UtilsService.serialize($scope.execiseAnswer),
                success: function (data) {
                    console.log(data);
                    if (isEmptyObject(data)) {
                        //$scope.exe_submit();
                        UtilsService.href('/student/study_finish/' + $routeParams.exerciseID);
                    } else {
                        chapterExercise(data);
                    }

                }
            })
        }
    }


}]);

//错误提示
lbApp.controller('StudyErrorController', ['$scope', 'UtilsService', 'RequestService', function ($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
}]);
//完成做题
lbApp.controller('StudyFinishController', ['$scope', '$routeParams', 'UtilsService', 'RequestService', function ($scope, $routeParams, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    $scope.exe_out = function(){
        if(confirm("练习还未完成，确定退出吗？")){
            UtilsService.href('/student/course');
        }
    }
    RequestService.request({
        token: 's_exe_submit',
        method: 'POST',
        params: {chapterExerciseId: $routeParams.exerciseID},
        success: function (data) {
            $scope.exerciseResult = data;
            var r_Code = data.rightCount / (data.rightCount + data.wrongCount);
            var b = r_Code.toFixed(4);
            $scope.percentCode = b.slice(2, 4) + "." + b.slice(4, 6) + "%";
            $scope.ave_time = (data.endTime - data.startTime) / (data.rightCount + data.wrongCount);

        }
    })
}]);