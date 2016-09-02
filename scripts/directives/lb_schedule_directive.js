// 调度设置
lbApp.directive('lbScheduleDirective', function() {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            callback: '=',
            schedule: '=',
            options: '='
        },
        templateUrl: 'views/directives/lb_schedule_directive.html',
        controller: function($scope, $element, $attrs) {
            $scope.$on('scheduleLoaded', function(e, schedule) {
                var schedule = schedule.schedule;
                // 绑定选择时间的事件
                $('#schedule-first-call').jtime({
                    time: {
                        hour: schedule.firstOutCallTime.slice(0, 2),
                        minute: schedule.firstOutCallTime.slice(3)
                    },
                    callback: function(strTime) {
                        $scope.$apply(function() {
                            $scope.schedule.firstOutCallTime = strTime;
                        });
                    }
                });
                $('#schedule-last-call').jtime({
                    time: {
                        hour: schedule.lastOutCallTime.slice(0, 2),
                        minute: schedule.lastOutCallTime.slice(3)
                    },
                    callback: function(strTime) {
                        $scope.$apply(function() {
                            $scope.schedule.lastOutCallTime = strTime;
                        });
                    }
                });
                $('#schedule-rest-start').jtime({
                    time: {
                        hour: schedule.restStartTime.slice(0, 2),
                        minute: schedule.restStartTime.slice(3)
                    },
                    callback: function(strTime) {
                        $scope.$apply(function() {
                            $scope.schedule.restStartTime = strTime;
                        });
                    }
                });
                $('#schedule-rest-end').jtime({
                    time: {
                        hour: schedule.restEndTime.slice(0, 2),
                        minute: schedule.restEndTime.slice(3)
                    },
                    callback: function(strTime) {
                        $scope.$apply(function() {
                            $scope.schedule.restEndTime = strTime;
                        });
                    }
                });
            });

            // 是否显示外呼时间错误
            $scope.showFirstCallError = false;
            $scope.showLastCallError = false;
            // 外呼时间错误信息
            $scope.firstCallError = '';
            $scope.lastCallError = '';
            // 是否显示午休时间的错误
            $scope.showRestStartTimeError = false;
            $scope.showRestEndTimeError = false;
            // 午休时间错误信息
            $scope.restStartTimeError = '';
            $scope.restEndTimeError = '';
            
            $scope.saveSchedule = function() {
                // 校验外呼时间
                var firstCallTimeArray = $scope.schedule.firstOutCallTime.split(':'),
                    lastCallTimeArray = $scope.schedule.lastOutCallTime.split(':');
                var firstCallTime = firstCallTimeArray[0] * 3600 + firstCallTimeArray[1] * 60,
                    lastCallTime = lastCallTimeArray[0] * 3600 + lastCallTimeArray[1] * 60;
                if (lastCallTime < firstCallTime) {
                    $scope.showFirstCallError = true;
                    $scope.firstCallError = '外呼开始时间不能在外呼结束时间之后';
                    return;
                }

                // 校验午休时间
                var restStartTimeArray = $scope.schedule.restStartTime.split(':'),
                    restEndTimeArray = $scope.schedule.restEndTime.split(':');
                var restStartTime = restStartTimeArray[0] * 3600 + restStartTimeArray[1] * 60,
                    restEndTime = restEndTimeArray[0] * 3600 + restEndTimeArray[1] * 60;
                if (restEndTime < restStartTime) {
                    $scope.restStartTimeError = '午休开始时间不能在午休结束时间之后';
                    $scope.showRestStartTimeError = true;
                    return;
                }
                // 校验外呼开始时间和午休时间的关系
                if (firstCallTime > restStartTime) {
                    $scope.showFirstCallError = true;
                    $scope.firstCallError = '外呼开始时间不能在午休开始时间之后';
                    return;
                }
                if (lastCallTime < restEndTime) {
                    $scope.showLastCallError = true;
                    $scope.lastCallError = '外呼结束时间不能再午休结束时间之前';
                    return;
                }
                $scope.showRestStartTimeError = false;
                $scope.showRestEndTimeError = false;
                $scope.showFirstCallError = false;
                $scope.showLastCallError = false;

                // 执行回调函数
                $scope.schedule.firstOutCallTime = $scope.schedule.firstOutCallTime;
                $scope.schedule.lastOutCallTime = $scope.schedule.lastOutCallTime;
                $scope.schedule.restStartTime = $scope.schedule.restStartTime;
                $scope.schedule.restEndTime = $scope.schedule.restEndTime;
                $scope.callback($scope.schedule);
            };
        }
    };
});