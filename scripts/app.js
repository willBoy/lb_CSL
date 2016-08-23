var lbApp = angular.module('lbApp', ['ngRoute']);
// 配置运行时
lbApp.run(['$rootScope', 'UtilsService', 'RequestService', function($rootScope, UtilsService, RequestService) {
    // 是否显示loading页面
    $rootScope.loading = false;
    // 是否显示头部
    $rootScope.showHeader = false;
    $rootScope.showHeaderStudent = false;

    $rootScope.utils = UtilsService;

    $rootScope.logout = function() {
        RequestService.request({
            token: 'tk_logout',
            method: 'POST',
            success: function(data) {
                UtilsService.href('/login');
            }
        });
    };

    $rootScope.$on('$routeChangeStart', function(e, next, current) {
        if (next.$$route.showHeader === false) {
            $rootScope.showHeader = false;
        } else {
            $rootScope.showHeader = true;
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
        // 章节列表
        .when('/', {
            templateUrl: 'views/index/welcome.html',
            controller: 'WelcomeController',
            showHeader: false
        })
        //登录
        .when('/login', {
            templateUrl: 'views/user/login.html',
            controller: 'LoginController',
            showHeader: false
        })
        //注册
        .when('/register',{
            templateUrl:'views/user/teacher_reg.html',
            controller:'RegController',
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
        .when('/classDetail/:classID',{
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
        .when('/class/courseSetting',{
            templateUrl:'views/class/course.html',
            controller:'CourseController',
            showHeader:true
        })

        //章节设置
        .when('/class/session',{
            templateUrl:'views/class/session.html',
            controller:'SessionController',
            showHeader:true
        })
        //新建章节
        .when('/class/create_session',{
            templateUrl:'views/class/create_session.html',
            controller:'CreateSessionController',
            showHeader:true
        })
        //习题管理
        .when('/class/exercise',{
            templateUrl:'views/class/exercise.html',
            controller:'SxerciseController',
            showHeader:true
        })
        //添加习题
        .when('/class/exercise_add',{
            templateUrl:'views/class/exercise_add.html',
            controller:'SxerciseAddController',
            showHeader:true
        })
        //添加习题随机
        .when('/class/exercise_add2',{
            templateUrl:'views/class/exercise_add2.html',
            controller:'SxerciseAdd2Controller',
            showHeader:true
        })

        //学生管理
        .when('/class/student',{
            templateUrl:'views/class/student.html',
            controller:'StudentController',
            showHeader:true
        })
        //学生详情
        .when('/class/studentDetail',{
            templateUrl:'views/class/student_detail.html',
            controller:'StudentDetailController',
            showHeader:true
        })
        //学生系统

        //我的课程
        .when('/student/class',{
            templateUrl:'views/student/class.html',
            controller:'StudentClassController',
            showHeaderStudent:true
        })
        //课程详情
        .when('/student/class_detail',{
            templateUrl:'views/student/class_detail.html',
            controller:'StudentClassDetailController',
            showHeaderStudent:true
        })

        //开始学习
        .when('/student/study',{
            templateUrl:'views/student/study.html',
            controller:'StudyController',
            showHeader:false
        })

        //开始学习下一步
        .when('/student/study1',{
            templateUrl:'views/student/study1.html',
            controller:'Study1Controller',
            showHeader:false
        })

        //音量校准
        .when('/student/study_volume',{
            templateUrl:'views/student/study_volume.html',
            controller:'StudyVolumeController',
            showHeader:false
        })
        //键盘校准
        .when('/student/study_key',{
            templateUrl:'views/student/study_key.html',
            controller:'StudyKeyController',
            showHeader:false
        })
        //请准备
        .when('/student/study_prepare',{
            templateUrl:'views/student/study_prepare.html',
            controller:'StudyPrepareController',
            showHeader:false
        })
        //播放提示音
        .when('/student/study_prompt',{
            templateUrl:'views/student/study_prompt.html',
            controller:'StudyPromptController',
            showHeader:false
        })

        //按键选答案
        .when('/student/study_keying',{
            templateUrl:'views/student/study_keying.html',
            controller:'StudyKeyingController',
            showHeader:false
        })

        //错误提示
        .when('/student/study_error',{
            templateUrl:'views/student/study_error.html',
            controller:'StudyErrorController',
            showHeader:false
        })
        //完成
        .when('/student/study_finish',{
            templateUrl:'views/student/study_finish.html',
            controller:'StudyFinishController',
            showHeader:false
        })
        //未完成
        .when('/student/study_unfinished',{
            templateUrl:'views/student/study_unfinished.html',
            controller:'StudyUnfinishedController',
            showHeader:false
        })
        //是否继续
        .when('/student/study_continue',{
            templateUrl:'views/student/study_continue.html',
            controller:'StudyContinueController',
            showHeader:false
        })

        .otherwise({
            redirectTo: '/'
        });
    $httpProvider.interceptors.push('InterceptorService');
}]);
