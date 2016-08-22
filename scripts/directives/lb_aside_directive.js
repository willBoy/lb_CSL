// 侧边栏
lbApp.directive('lbAsideDirective',function() {
    "use strict";
    return {
        restrict: 'A',
        replace: true,
        scope: true,
        templateUrl: 'views/directives/lb_aside_directive.html',
        controller: function($scope, $element, $attrs) {
            $scope.asideList = {
                navigation:[
                    {
                        name:'classManage',
                        value:'班级管理',
                        url:'/class_list',
                        icon:''
                    },
                    {
                        name:'courseManage',
                        value:'模板管理',
                        url:'/course_manage',
                        icon:''
                    },
                    /*{
                        name:'course',
                        value:'课程管理',
                        url:'/course',
                        icon:''
                    },*/
                    {
                        name:'realTimeTool',
                        value:'实用工具',
                        /*temp:'实用工具',*/
                        url:'',
                        icon:''
                    },
                    {
                        name: 'register',
                        value: '注册',
                        url: '/register',
                        icon: 'icons-user'
                    },
                    {
                        name: 'login',
                        value: '登录',
                        url: '/login',
                        icon: 'icons-user'
                    }
                ],
                account: [
                    {
                        name: 'profile',
                        value: '个人中心',
                        url: '/profile',
                        icon: 'icons-user'
                    },
                    {
                        name: 'roleManage',
                        value: '角色管理',
                        temp: '角色管理',
                        url: '',
                        icon: 'icons-emoji'
                    },
                    {
                        name: 'account',
                        value: '账号管理',
                        temp: '账号管理',
                        url: '',
                        icon: 'icons-list'
                    },
                    {
                        name: 'message',
                        value: '消息中心',
                        temp: '消息中心',
                        url: '',
                        icon: 'icons-message'
                    }
                ],
                task: [
                    {
                        name: 'robot',
                        value: '机器人工厂',
                        url: '/robot',
                        icon: 'icons-robot'
                    },
                    {
                        name: 'createTask',
                        value: '任务创建',
                        url: '/createTask',
                        icon: 'icons-task'
                    },
                    {
                        name: 'taskList',
                        value: '任务列表',
                        url: '/taskList',
                        icon: 'icons-list'
                    },
                    {
                        name: 'schedule',
                        value: '调度设置',
                        url: '/schedule',
                        icon: 'icons-schedule'
                    }
                ],
                monitoring:[
                    {
                        name:'monitor',
                        value:'机器人坐席',
                        url:'/monitor',
                        icon:'icons-schedule',
                    },
                    {
                        name:'seat',
                        value:'告警坐席',
                        temp:'告警坐席',
                        url:'',
                        icon:'icons-list'
                    }
                ]
            };
            $scope.enter = function(tab) {
                if (tab.temp) {
                    tab.value = '正在建设中';
                }
            };
            $scope.leave = function(tab) {
                if (tab.temp) {
                    tab.value = tab.temp;
                }
            };
        }
    };
});