// 任务列表
lbApp.directive('lbTaskListDirective', ['RequestService', 'UtilsService', '$timeout', function(RequestService, UtilsService, $timeout) {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            robotId: '=',
        },
        templateUrl: 'views/directives/lb_task_list_directive.html',
        controller: function($scope, $element, $attrs, $transclude) {
            $scope.utils = UtilsService;
            // 任务总数
            $scope.total = 0;
            // 查询条件
            $scope.conditions = {
                common: {
                    robotId: $scope.robotId || '',
                    status: '',
                    taskName: ''
                },
                order: {
                    // 任务名称
                    taskName: 0,
                    // 创建时间
                    createTime: 0,
                    // 开始时间
                    startTime: 0
                },
                pageInfo: {
                    page: 1,
                    pageSize: '5',
                    totalPage: 0
                }
            };
            /**
             * 对任务的操作
             * 
             * @param task
             */
            $scope.operateTask = function(task, opId) {
                RequestService.request({
                    token: 'tk_taskOp',
                    method: 'POST',
                    params: {taskId: task.id, operation: opId},
                    success: function(data) {
                        task.status = opId
                    }
                });
            };
            $scope.getTaskList = function(page) {
                $scope.conditions.pageInfo.page = page;
                RequestService.request({
                    token: 'tk_taskList',
                    method: 'GET',
                    strParams: UtilsService.genConditions($scope.conditions),
                    success: function(data) {
                        $scope.taskStatusList = data.selected.taskType;
                        $scope.taskList = data.paging.list;
                        $scope.conditions.pageInfo.totalPage = data.paging.pages;
                        // 总数
                        $scope.total = data.paging.total;
                    }
                });
            };
            $scope.$on('getTaskList', function(e, args) {
                $scope.getTaskList(1);
            });
            // 导出任务列表的url
            $scope.exportUrl = RequestService.tokenMap['tk_exportTask'];

            // 任务名称搜索
            var timeout;
            $scope.$watch('conditions.common.taskName', function(oldValue, newValue) {
                if (oldValue == newValue) {
                    return;
                }
                if (timeout) {
                    $timeout.cancel(timeout);
                }
                timeout = $timeout(function() {
                    $scope.getTaskList(1);
                }, 350);
            });
        }
    };
}]);