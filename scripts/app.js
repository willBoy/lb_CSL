var lbApp = angular.module('lbApp', ['ngRoute']);
// 配置运行时
lbApp.run(['$rootScope', 'UtilsService', 'RequestService', function($rootScope, UtilsService, RequestService) {
    // 是否显示loading页面
    $rootScope.loading = false;
    // 是否显示头部
    $rootScope.showHeader = false;
    //$rootScope.showHeaderStudent = false;
    //$rootScope.showHeaderTeacher = false;
    $rootScope.utils = UtilsService;
    //$rootScope.currentUserData = {};
    $rootScope.t_logout = function() {
        RequestService.request({
            token: 't_logout',
            method: 'POST',
            success: function(data) {
                UtilsService.href('/');
            }
        });
    };
    $rootScope.$on('$routeChangeStart', function(e, next, current) {
        if (next.$$route.showHeader === false) {
            $rootScope.showHeader = false;
            //$rootScope.showHeaderStudent = false;
            $rootScope.showHeaderTeacher = false;
        } else {
            $rootScope.showHeader = true;
            //$rootScope.showHeaderStudent = true;
            $rootScope.showHeaderTeacher = true;
        }
    });
}]);

// 配置路由
lbApp.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        // welcome
        .when('/welcome', {
            templateUrl: 'views/index/welcome.html',
            controller: 'WelcomeController',
            showHeader: false
        })
        //
        .when('/', {
            templateUrl: 'views/index/welcome.html',
            controller: 'WelcomeController',
            showHeader: false
        })
        //教师登录
        .when('/t_login', {
            templateUrl: 'views/user/login.html',
            controller: 'LoginController',
            showHeader: false
        })
        //教师修改密码
        .when('/t_editPwd', {
            templateUrl: 'views/class/t_editPwd.html',
            controller: 'EditPwdController',
            showHeader: true
        })
        //学生登录
        .when('/s_login', {
            templateUrl: 'views/user/login_student.html',
            controller: 's_LoginController',
            showHeader: false
        })
        //教师修改密码
        .when('/s_login', {
            templateUrl: 'views/user/login_student.html',
            controller: 's_LoginController',
            showHeader: false
        })
        //老师注册
        .when('/t_register',{
            templateUrl:'views/user/teacherReg.html',
            controller:'t_RegController',
            showHeader:false
        })
        //学生注册
        .when('/s_register',{
            templateUrl:'views/user/register.html',
            controller:'S_RegController',
            showHeader:false
        })


        //班级管理
        .when('/classList/:classID',{
            templateUrl:'views/class/class_list.html',
            controller:'ClassListController',
            showHeader:true
        })
        //班级列表
        .when('/classList',{
            templateUrl:'views/class/class_list.html',
            controller:'ClassListController',
            showHeader:true
        })
        //班级设置
        .when('/classDetail/:classID/:courseID',{
            templateUrl:'views/class/class_detail.html',
            controller:'ClassDetailController',
            showHeader:true
        })
        //删除
        .when('/class/delClass/:classID',{
            templateUrl:'views/class/class_del.html',
            controller:'classDelController',
            showHeader:true
        })
        //新建班级
        .when('/createClass',{
            templateUrl:'views/class/create_class.html',
            controller:'CreateClassController',
            showHeader:true
        })
        //课程设置
        .when('/class/courseSetting/:courseID',{
            templateUrl:'views/class/course.html',
            controller:'CourseController',
            showHeader:true
        })
        .when('/class/courseSetting',{
            templateUrl:'views/class/course.html',
            controller:'CourseController',
            showHeader:true
        })
        //章节设置
        .when('/class/chapter/:chapterID/:classID',{
            templateUrl:'views/class/chapter.html',
            controller:'ChapterController',
            showHeader:true
        })
        //新建章节
        .when('/class/create_chapter/:courseID',{
            templateUrl:'views/class/create_chapter.html',
            controller:'CreateChapterController',
            showHeader:true
        })
        //习题管理
        .when('/class/exercise/:chapterID',{
            templateUrl:'views/class/exercise.html',
            controller:'ExerciseController',
            showHeader:true
        })
        //添加习题
        .when('/class/exercise_add/:chapterID',{
            templateUrl:'views/class/exercise_add.html',
            controller:'ExerciseAddController',
            showHeader:true
        })
        //添加习题随机
        .when('/class/exercise_add2',{
            templateUrl:'views/class/exercise_add2.html',
            controller:'ExerciseAdd2Controller',
            showHeader:true
        })

        //学生管理
        .when('/class/student/:classesID',{
            templateUrl:'views/class/student.html',
            controller:'StudentController',
            showHeader:true
        })
        //学生详情
        .when('/class/studentDetail/:studentID',{
            templateUrl:'views/class/student_detail.html',
            controller:'StudentDetailController',
            showHeader:true
        })
        //学生系统

        //学生个人中心
        .when('/s_profile',{
            templateUrl:'views/student/student_profile.html',
            controller:'StudentProfileController',
            showHeader:true
        })
        //修改密码
        .when('/s_changePwd',{
            templateUrl:'views/student/student_editPwd.html',
            controller:'StudentEditPwdController',
            showHeader:true
        })
        //我的课程
        .when('/student/course',{
            templateUrl:'views/student/course.html',
            controller:'StudentCourseController',
            showHeader:true
        })
        //课程详情
        .when('/student/course_detail/:courseID',{
            templateUrl:'views/student/course_detail.html',
            controller:'StudentCourseDetailController',
            showHeader:true
        })

        //开始学习
        .when('/student/study/:chapterID/:courseID',{
            templateUrl:'views/student/study.html',
            controller:'StudyController',
            showHeader:false
        })
        //按键选答案
        .when('/student/study_keying/:exerciseID/:courseID',{
            templateUrl:'views/student/study_keying.html',
            controller:'StudyKeyingController',
            showHeader:false
        })
        //完成
        .when('/student/study_finish/:exerciseID/:courseID',{
            templateUrl:'views/student/study_finish.html',
            controller:'StudyFinishController',
            showHeader:false
        })
        .otherwise({
            redirectTo: '/'
        });
    $httpProvider.interceptors.push('InterceptorService');
}]);
