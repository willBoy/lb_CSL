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
        .when('/', {
            templateUrl: 'views/index/welcome.html',
            controller: 'WelcomeController',
            showHeader: false
        })
        //教师注册
        .when('/teacher/register',{
            templateUrl:'views/teacher/register.html',
            controller:'TeacherRegController',
            showHeader:false
        })
        //教师登录
        .when('/teacher/login', {
            templateUrl: 'views/teacher/login.html',
            controller: 'TeacherLoginController',
            showHeader: false
        })
        //教师修改密码
        .when('/teacher/edit_password', {
            templateUrl: 'views/teacher/edit_password.html',
            controller: 'TeacherEditPwdController',
            showHeader: true
        })
        //新建班级
        .when('/teacher/createClass',{
            templateUrl:'views/teacher/create_class.html',
            controller:'CreateClassController',
            showHeader:true
        })
        //班级管理
        .when('/teacher/classList/:classID',{
            templateUrl:'views/teacher/class_list.html',
            controller:'ClassListController',
            showHeader:true
        })
        //班级管理
        .when('/teacher/classList',{
            templateUrl:'views/teacher/class_list.html',
            controller:'ClassListController',
            showHeader:true
        })
        //班级设置
        .when('/teacher/classSetting/:classID/:courseID',{
            templateUrl:'views/teacher/class_setting.html',
            controller:'ClassSettingsController',
            showHeader:true
        })
        //删除
        .when('/teacher/delClass/:classID',{
            templateUrl:'views/class/class_del.html',
            controller:'classDelController',
            showHeader:true
        })
        //课程设置
        .when('/teacher/course/:courseID',{
            templateUrl:'views/teacher/course.html',
            controller:'CourseController',
            showHeader:true
        })
        //章节设置
        .when('/teacher/chapter/:chapterID/:classID',{
            templateUrl:'views/teacher/chapter.html',
            controller:'ChapterController',
            showHeader:true
        })
        //新建章节
        .when('/teacher/create_chapter/:courseID',{
            templateUrl:'views/teacher/create_chapter.html',
            controller:'CreateChapterController',
            showHeader:true
        })
        //习题管理
        .when('/teacher/exercise/:chapterID',{
            templateUrl:'views/teacher/exercise.html',
            controller:'ExerciseController',
            showHeader:true
        })
        //添加习题
        .when('/teacher/add_exercise/:chapterID',{
            templateUrl:'views/teacher/add_exercise.html',
            controller:'AddExerciseController',
            showHeader:true
        })
        //学生管理
        .when('/teacher/student/:classesID',{
            templateUrl:'views/teacher/student.html',
            controller:'StudentController',
            showHeader:true
        })
        //学生系统

        //学生登录
        .when('/student/login', {
            templateUrl: 'views/student/login.html',
            controller: 'StudentLoginController',
            showHeader: false
        })
        //学生注册
        .when('/student/register',{
            templateUrl:'views/student/register.html',
            controller:'StudentRegController',
            showHeader:false
        })
        //学生个人中心
        .when('/student/profile',{
            templateUrl:'views/student/profile.html',
            controller:'StudentProfileController',
            showHeader:true
        })
        //修改密码
        .when('/student/edit_password',{
            templateUrl:'views/student/edit_password.html',
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
            templateUrl:'views/student/study_prepare.html',
            controller:'StudyPrepareController',
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
