var lbApp = angular.module('lbApp', ['ngRoute']);
// 配置运行时
lbApp.run(['$rootScope', 'UtilsService', 'RequestService', function($rootScope, UtilsService, RequestService) {
    // 是否显示loading页面
    $rootScope.loading = false;
    // 是否显示头部
    $rootScope.showHeader = true;

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
        //// welcome
        //.when('/welcome', {
        //    templateUrl: 'views/index/welcome.html',
        //    controller: 'WelcomeController',
        //    showHeader: false
        //})
        //// 学生端登录
        //.when('/student/login', {
        //    templateUrl: 'views/student/login.html',
        //    controller: 'StudentLoginController',
        //    /*showHeader: false*/
        //})
        // 章节列表
        .when('/', {
            templateUrl: 'views/class/class_list.html',
            controller: 'ClassListController',
            showHeader: true
        })
        //班级管理
        .when('/classList',{
            templateUrl:'views/class/class_list.html',
            controller:'ClassListController',
            showHeader:true
        })
        //班级设置
        .when('/classDetail',{
            templateUrl:'views/class/class_detail.html',
            controller:'ClassDetailController',
            showHeader:true
        })
        //新建班级
        .when('/createClass',{
            templateUrl:'views/class/create_class.html',
            controller:'CreateClassController',
            showHeader:true
        })
        //课程设置
        .when('/class/course',{
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
        //习题管理
        .when('/class/exercise',{
            templateUrl:'views/class/exercise.html',
            controller:'SxerciseController',
            showHeader:true
        })
        //// 班级管理
        //.when('/class_list', {
        //    templateUrl: 'views/class/class_list.html',
        //    controller: 'ClassController',
        //    showHeader: true
        //})
        // 班级管理
        //.when('/class_detail', {
        //    templateUrl: 'views/class/class_list.html',
        //    controller: 'ClassController',
        //    showHeader: true
        //})
        // 首页
        //.when('/', {
        //    templateUrl: 'views/index/index.html',
        //    controller: 'IndexController',
        //    showHeader: false
        //})
        // 登录
        //.when('/login', {
        //    templateUrl: 'views/user/login.html',
        //    controller: 'LoginController',
        //    showHeader: false
        //})
        //// 注册
        //.when('/reg', {
        //    templateUrl: 'views/user/reg.html',
        //    controller: 'RegController',
        //    showHeader: false
        //})
        //// 验证邮箱
        //.when('/verifyEmail', {
        //    templateUrl: 'views/user/verify_email.html',
        //    controller: 'VerifyEmailController',
        //    showHeader: false
        //})
        //// 个人中心
        //.when('/profile', {
        //    templateUrl: 'views/user/profile.html',
        //    controller: 'ProfileController'
        //})
        //// 角色管理
        //.when('/roleManage', {
        //    templateUrl: 'views/manage/role_manage.html',
        //    controller: 'RoleMangeController'
        //})
        //// 机器人工厂
        //.when('/robot', {
        //    templateUrl: 'views/task/robot.html',
        //    controller: 'RobotController'
        //})
        //// 创建机器人
        //.when('/createRobot', {
        //    templateUrl: 'views/task/create_robot.html',
        //    controller: 'CreateRobotController'
        //})
        //// 创建特定类型的机器人
        //.when('/createRobot/:robotModel', {
        //    templateUrl: 'views/task/create_robot.html',
        //    controller: 'CreateRobotController'
        //})
        //// 定制机器人
        //.when('/customRobot', {
        //    templateUrl: 'views/task/custom_robot.html',
        //    controller: 'CustomRobotController'
        //})
        //// 机器人详情
        //.when('/robot/:robotId', {
        //    templateUrl: 'views/task/robot_detail.html',
        //    controller: 'RobotDetailController'
        //})
        //// 创建任务
        //.when('/createTask', {
        //    templateUrl: 'views/task/create_or_edit_task.html',
        //    controller: 'CreateOrEditTaskController'
        //})
        //// 根据机器人id来创建任务
        //.when('/createTask/:robotId', {
        //    templateUrl: 'views/task/create_or_edit_task.html',
        //    controller: 'CreateOrEditTaskController'
        //})
        //// 编辑任务
        //.when('/editTask/:taskId', {
        //    templateUrl: 'views/task/create_or_edit_task.html',
        //    controller: 'CreateOrEditTaskController'
        //})
        //// 任务列表
        //.when('/taskList', {
        //    templateUrl: 'views/task/task_list.html',
        //    controller: 'TaskListController'
        //})
        //// 任务详情
        //.when('/task/:taskId', {
        //    templateUrl: 'views/task/task_detail.html',
        //    controller: 'TaskDetailController'
        //})
        //// 调度设置
        //.when('/schedule', {
        //    templateUrl: 'views/task/schedule.html',
        //    controller: 'ScheduleController'
        //})
        //// 实时监控
        //.when('/monitoring', {
        //    templateUrl: 'views/monitoring/index.html',
        //    controller: 'MonitoringController'
        //})
        //// 数据分析
        //.when('/statistics', {
        //    templateUrl: 'views/statistics/index.html',
        //    controller: 'StatisticsController'
        //})
        //// 仪表盘
        //.when('/dashboard', {
        //    templateUrl: 'views/index/dashboard.html',
        //    controller: 'DashboardController'
        //})
        //// 监控平台
        //.when('/monitoring', {
        //    templateUrl: 'views/monitoring/monitor.html',
        //    controller: 'MonitoringController'
        //})
        .otherwise({
            redirectTo: '/'
        });
    $httpProvider.interceptors.push('InterceptorService');
}]);
