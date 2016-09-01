// 任务中心
lbApp.controller('RobotController', ['$scope', '$timeout', 'RequestService', 'UtilsService', function($scope, $timeout, RequestService, UtilsService) {
    "use strict";
    // 设置边栏
    $scope.asideTab = {
        listName: 'task',
        tabName: 'robot'
    };

    // 机器人列表数据
    $scope.robotList = [];

    // 查询条件
    $scope.conditions = {
        common: {
            // 机器人类型
            modelId: '',
            // 声音类型
            sound: ''
        },
        order: {
            // 按创建时间排序
            createTime: 0,
            // 关联任务数的大小排序
            relatedTasks: 0
        },
        pageInfo: {
            page: 1,
            pageSize: '5',
            totalPage: 0
        }
    };
    // 下拉框列表
    $scope.options = {};
    // 获取机器人列表数据
    function getRobotList(page, callback) {
        $scope.conditions.pageInfo.page = page;
        RequestService.request({
            token: 'tk_robotList',
            method: 'GET',
            strParams: UtilsService.genConditions($scope.conditions),
            success: function(data) {
                $scope.robotList = data.paging.list;
                $scope.options = {
                    modelList: data.modelList,
                    soundList: data.soundList
                };
                $scope.conditions.pageInfo.totalPage = data.paging.pages;
                $scope.total = data.paging.total;
                callback && callback(data);
            }
        });
    }
    $scope.getRobotList = getRobotList;

    // 是否有机器人列表
    $scope.hasRobot = false;
    getRobotList(1, function(data) {
        $scope.hasRobot = data.paging.total > 0 ? true : false;
    });

    // 启用或停用机器人
    $scope.startOrStopRobot = function(robot, signal) {
        RequestService.request({
            token: 'tk_startOrStopRobot',
            method: 'POST',
            params: {robotId: robot.id, control: signal},
            success: function(data) {
                if (signal == 'valid') {
                    robot.status = 1;
                } else if (signal == 'invalid') {
                    robot.status = 0;
                }
            }
        });
    };
}]);

// 创建机器人
lbApp.controller('CreateRobotController', ['$scope', '$routeParams', 'RequestService', 'UtilsService', 'ConfigService', function($scope, $routeParams, RequestService, UtilsService, ConfigService) {
    // 设置边栏
    $scope.asideTab = {
        listName: 'task',
        tabName: 'robot'
    };

    // 从url参数传机器人类型
    $scope.robotModel = $routeParams['robotModel'] || ConfigService.robotModel.voice;

    // key
    $scope.key = '';
    // 机器人选项
    $scope.modelList = [];
    // 声音选项
    $scope.soundList = [];

    // 获取机器人可选的配置
    RequestService.request({
        token: 'tk_robotOptions',
        method: 'GET',
        success: function(data) {
            $scope.key = data.key;
            $scope.modelList = data.modelList;
            $scope.soundList = data.soundList;
            $scope.voiceRobot.template = data.template;
        }
    });

    // 语音验证机器人
    $scope.voiceRobot = {
        // 机器人名称
        name: '',
        // 声音类型
        sound: '',
        // 主体内容
        template: '',
        // 播报次数
        playTimes: '1'
    };

    // 试听
    $scope.testVoice = function() {
        RequestService.request({
            token: 'tk_testVoice',
            method: 'POST',
            data: 'modelId=' + $scope.robotModel + '&content=' + $scope.voiceRobot.template + '&sound=' + $scope.voiceRobot.sound + '&playCount=' + $scope.voiceRobot.playTimes,
            success: function(data) {
                alert('已向您的手机拨打电话，请注意接听');
            }
        });
    };

    // 创建语音机器人
    $scope.createVoiceRobot = function() {
        $scope.voiceRobot.modelId = $scope.robotModel;
        RequestService.request({
            token: 'tk_createRobot',
            method: 'POST',
            data: UtilsService.serialize($scope.voiceRobot),
            success: function(data) {
                UtilsService.href('/robot');
            }
        });
    };


    // 祝福机器人
    $scope.wishRobot = {
        modelId: '',
        // 机器人名称
        name: '',
        // 声音类型
        sound: '',
        // 介绍
        introMsg: '',
        // 推介词
        adMsg: ''
    };
    
    // 创建祝福机器人
     $scope.createWishRobot = function() {
         $scope.wishRobot.modelId = $scope.robotModel;
         RequestService.request({
             token: 'tk_createRobot',
             method: 'POST',
             data: UtilsService.serialize($scope.wishRobot),
             success: function(data) {
                 UtilsService.href('/robot');
             }
         });
     };
}]);

// 机器人详情
lbApp.controller('RobotDetailController', ['$scope', 'RequestService', '$routeParams', 'ConfigService', 'UtilsService', function($scope, RequestService, $routeParams, ConfigService, UtilsService) {
    // 设置边栏
    $scope.asideTab = {
        listName: 'task',
        tabName: 'robot'
    };

    // 获得机器人id
    $scope.robotId = $routeParams.robotId;
    // 是否是语音验证机器人
    $scope.isVoiceRobot = true;

    // 请求机器人使用详情
    RequestService.request({
        token: 'tk_robotDetail',
        method: 'GET',
        params: {robotId: $scope.robotId},
        success: function(data) {
            $scope.robotDetail = data.model;
            $scope.summary = data.summary;
            // 机器人类型
            $scope.robotType = data.model.modelId;
            $scope.isVoiceRobot = $scope.robotType == ConfigService.robotModel.voice ? true : false;
            // 如果是语音验证机器人，就请求使用情况
            if ($scope.robotType == ConfigService.robotModel.voice) {
                $scope.getUsageList(1);
            } else {
                $scope.$broadcast('getTaskList', {});
            }
        }
    });

    // 机器人使用详情列表
    $scope.usageList = [];
    // 按月/天查询
    $scope.isByDay = true;
    // 调用次数
    $scope.counts = {
        total: 0,
        success: 0,
        fail: 0
    };

    $scope.conditions1 = {
        common: {
            group: $scope.isByDay ? 'day' : 'month'
        },
        pageInfo: {
            page: 1,
            pageSize: 5,
            totalPage: 0
        }
    };

    // 获取机器人列表详情（语音验证机器人）
    $scope.getUsageList = function(page) {
        $scope.conditions1.common.group = $scope.isByDay ? 'day' : 'month';
        $scope.conditions1.pageInfo.page = page;
        RequestService.request({
            token:'tk_voiceRobotUsageList',
            method: 'GET',
            params: {robotId: $scope.robotId},
            strParams: UtilsService.genConditions($scope.conditions1),
            success: function(data) {
                $scope.usageList = data.paging.list;
                $scope.conditions1.pageInfo.totalPage = data.paging.total;
            }
        });
    };
}]);

// 定制机器人
lbApp.controller('CustomRobotController', ['$scope', 'RequestService', 'UtilsService', function($scope, RequestService, UtilsService) {
    "use strict";
    // 设置边栏
    $scope.asideTab = {
        listName: 'task',
        tabName: 'robot'
    };

    // 定制机器人需求表单
    $scope.custom = {
        // 联系人
        linkman: '',
        // 联系电话
        phone: '',
        // 需求描述
        description: '',
        // 附件
        fileList: []
    };

    // 获取当前用户信息
    RequestService.request({
        token: 'tk_currentUser',
        method: 'GET',
        success: function(data) {
            $scope.custom.linkman = data.currentUser.name;
            $scope.custom.phone = data.currentUser.phoneNumber;
        }
    });

    /**
     * 上传附件
     */
    $scope.uploadAttachment = function() {
        jupload('file', RequestService.tokenMap['tk_customRobotAttachment'], function(data) {
            if (data == 'need login') {
                UtilsService.href('/login');
            } else if (data !== ''){
                $scope.$apply(function() {
                    $scope.custom.fileList.push(data);
                });
            }
        }, ['wav', 'xls', 'xlsx']);
    };

    /**
     * 提交需求
     */
    $scope.submitRobotDemand = function() {
        RequestService.request({
            token: 'tk_customRobot',
            method: 'POST',
            loading: true,
            data: UtilsService.serialize($scope.custom),
            success: function(data) {
                UtilsService.href('/robot');
            }
        });
    };
}]);

// 创建或编辑任务
lbApp.controller('CreateOrEditTaskController', ['$scope', '$routeParams', '$filter', 'UtilsService', 'RequestService', 'CommonService', function($scope, $routeParams, $filter, UtilsService, RequestService, CommonService) {
    "use strict";
    // 设置边栏
    $scope.asideTab = {
        listName: 'task',
        tabName: 'createTask'
    };
    
    // 如果是编辑任务，url中会带有taskId
    $scope.taskId = $routeParams['taskId'];

    // 是否是新建任务
    $scope.isNew = $scope.taskId ? false : true;

    // 生成tab页
    UtilsService.genTabs($scope, 'taskTab');
    
    // 初始化弹框
    UtilsService.initPop($scope);
    
    // 下载电话号码模板
    $scope.phoneTplUrl = RequestService.tokenMap['tk_phoneTpl'];
    // 下载电话号码的url
    $scope.dlPhoneUrl = RequestService.tokenMap['tk_dlphone'];

    // 任务信息
    $scope.taskInfo = {
        // 任务名称
        taskName: '',
        // 任务描述
        description: '',
        // 开始时间
        startTime: '',
        // 结束时间
        endTime: '',
        // 主叫号码
        callingNo: '',
        // 机器人
        robotId: $routeParams['robotId'] || '',
        // 知识域
        KnowledgeDomain: '',
        // 外呼号码
        uploadFileInfos: [],
        // 调度设置
        dispatchType: '1',
        // 自定义调度
        dispatch: {}
    };
    
    // 默认调度
    $scope.defaultSchedule = {};
    // 自定义调度中的列表框
    $scope.scheduleOptions = {};
    // 获取主叫号码，机器人可选项
    $scope.options = {};
    // 如果是新建就取出下拉列表的选项和默认调度，否则就取出对应的任务
    if ($scope.isNew) {
        RequestService.request({
            token: 'tk_taskOptions',
            method: 'GET',
            loading: true,
            success: function(data) {
                // 调度列表中的下拉框选项
                $scope.options = data.selected;
                var scheduleInfo = data.dispatch;
                $scope.selectedSchedule = $scope.defaultSchedule = CommonService.initSchedule(scheduleInfo);
                $scope.taskInfo.dispatch = CommonService.initSchedule(scheduleInfo);

                $scope.$broadcast('scheduleLoaded', {schedule: $scope.taskInfo.dispatch});
                var now = new Date(),
                    nowArray = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
                initDatePicker(nowArray, nowArray);
            }
        });
    } else {
        RequestService.request({
            token: 'tk_taskDetail',
            method: 'GET',
            params: {taskId: $scope.taskId},
            loading: true,
            success: function(data) {
                $scope.options = data.selected;
                $scope.defaultSchedule = CommonService.initSchedule(data.defaultDispatch);
                $scope.selectedSchedule = CommonService.initSchedule(data.task.dispatch);
                var task = data.task;
                $scope.taskInfo = {
                    // 任务名称
                    taskName: task.taskName,
                    // 任务描述
                    description: task.description,
                    // 开始时间
                    startTime: $filter('lbUTCDate')(task.startTime, 'yyyy-MM-dd'),
                    // 结束时间
                    endTime: $filter('lbUTCDate')(task.endTime, 'yyyy-MM-dd'),
                    // 主叫号码
                    callingNo: '' + task.callingNo,
                    // 机器人
                    robotId: '' + task.robotId,
                    // 知识域
                    KnowledgeDomain: task.KnowledgeDomain,
                    // 外呼号码
                    uploadFileInfos: task.uploadFileInfos,
                    // 调度设置
                    dispatchType: '' + task.dispatchType,
                    // 自定义调度
                    dispatch: CommonService.initSchedule(task.dispatch)
                };
                $scope.$broadcast('scheduleLoaded', {schedule: $scope.taskInfo.dispatch});
                initDatePicker($scope.taskInfo.startTime.split('-'), $scope.taskInfo.endTime.split('-'));
            }
        });
    }
    
    // 删除电话号码文件
    $scope.delPhone = function(index) {
        var del = confirm('确定删除吗？');
        if (del) {
            $scope.taskInfo.uploadFileInfos.splice(index, 1);
        }
    };
    
    // 保存自定义调度时的回调函数
    $scope.saveMySchedule = function() {
        $scope.closePop('pop-schedule');
    };

    function initDatePicker(startTimeArray, endTimeArray) {
        // 选择开始日期
        $('#time-start').jdatepicker({
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
                    $scope.taskInfo.startTime = dateString;
                    checkTime();
                });
            }
        });
        // 选择结束日期
        var timeEndArray = $scope.taskInfo.endTime.split('-');
        $('#time-end').jdatepicker({
            selectedDate: {
                year: endTimeArray[0],
                month: endTimeArray[1],
                day: endTimeArray[2]
            },
            disableFn: function(date) {
                return date.getTime() < Date.now() - 86400000;
            },
            callback: function(dateString) {
                $scope.$apply(function() {
                    $scope.taskInfo.endTime = dateString;
                    checkTime();
                });
            }
        });
    }
    // 校验日期
    $scope.dateError = '';
    $scope.showDateError = false;

    function checkTime() {
        // 是否填写了开始时间
        if (!$scope.taskInfo.startTime) {
            $scope.dateError = '请选择开始日期';
            $scope.showDateError = true;
            return false;
        }
        // 是否填写了结束时间
        if (!$scope.taskInfo.endTime) {
            $scope.dateError = '请选择结束日期';
            $scope.showDateError = true;
            return false;
        }
        // 开始日期是否大于结束日期
        var startTimeStamp = (new Date($scope.taskInfo.startTime)).getTime();
        var endTimeStamp = (new Date($scope.taskInfo.endTime)).getTime();
        if (startTimeStamp > endTimeStamp) {
            $scope.dateError = '开始日期不能早于结束日期';
            $scope.showDateError = true;
            return false;
        }
        $scope.showDateError = false;
        return true;
    }
    
    // 是否已上传的文件
    $scope.showFileError = false;
    
    // 上传号码提示
    $scope.phoneCheckInfo = {};
    
    // 保存上传的文件元信息
    $scope.metaFile = {};

    /**
     * 上传外呼号码文件
     */
    $scope.uploadFile = function() {
        jupload('file', RequestService.tokenMap['tk_uploadPhone'], function(data) {
            // 如果用户长时间不操作导致session失效，服务器就返回none，前段跳转到登录页
            if(data == 'need login') {
                UtilsService.href('/login');
                return;
            }
            if (data) {
                data = JSON.parse(data);
                $scope.$apply(function() {
                    $scope.taskInfo.uploadFileInfos.push({id: data.id});
                    $scope.metaFile[data.id] = data;
                    $scope.phoneCheckInfo = data;
                    $scope.openPop('pop-upload');
                });
            }
        }, ['csv']);
    };

    /**
     * 保存草稿
     */
    $scope.save = function() {
        //
    };

    /**
     * 创建任务
     */
    $scope.createTask = function() {
        if (checkTime()) {
            RequestService.request({
                token: 'tk_createTask',
                method: 'POST',
                data: UtilsService.serialize($scope.taskInfo),
                loading: true,
                success: function(data) {
                    UtilsService.href('/taskList');
                }
            });
        }
    };

    /****************************************** 下面是草稿箱的代码 *********************************/

    // 草稿信息
    $scope.draft = {
        // 任务名称
        name: '',
        // 任务描述
        description: '',
        // 开始日期
        startDate: '',
        // 结束日期
        endDate: '',
        // 主叫号码
        tel: '',
        // 机器人
        robot: '',
        // 外呼号码
        call: '',
        // 调度设置
        schedule: '',
        // 创建人
        user: '',
        // 更新时间
        updateTime: ''
    };

    /**
     * 获取最后一个草稿
     */
    $scope.getLatestDraft = function() {};

    /**
     * 编辑草稿
     */
    $scope.edit = function() {};

    /**
     * 通过草稿创建任务
     */
    $scope.createTaskByDraft = function() {};

    /**
     * 删除草稿
     */
    $scope.deleteDraft = function() {};

    /**********************  编辑任务 *********************/
    /**
     * 更新任务信息
     */
    $scope.updateTask = function() {
        if (checkTime()) {
            RequestService.request({
                token: 'tk_updateTask',
                method: 'POST',
                params: {taskId: $scope.taskId},
                loading: true,
                data: UtilsService.serialize($scope.taskInfo),
                success: function(data) {
                    UtilsService.href('/taskList');
                }
            });
        }
    };
    /**
     * 删除任务
     */
    $scope.delTask = function() {
        var del = confirm('确定要删除该任务吗');
        if (del) {
            RequestService.request({
                token: 'tk_delTask',
                method: 'POST',
                params: {taskId: $scope.taskId},
                loading: true,
                success: function(data) {
                    UtilsService.href('/taskList');
                }
            });
        }
    };
}]);

// 任务列表
lbApp.controller('TaskListController', ['$scope', '$timeout', 'RequestService', 'UtilsService', function($scope, $timeout, RequestService, UtilsService) {
    // 设置边栏
    $scope.asideTab = {
        listName: 'task',
        tabName: 'taskList'
    };
    setTimeout(function() {
        $scope.$broadcast('getTaskList', {});
    }, 50);
}]);

// 任务详情
lbApp.controller('TaskDetailController', ['$scope', '$routeParams', '$timeout', 'RequestService', 'UtilsService', function($scope, $routeParams, $timeout, RequestService, UtilsService) {
    "use strict";
    // 设置边栏
    $scope.asideTab = {
        listName: 'task',
        tabName: 'taskList'
    };

    // 初始化弹框
    UtilsService.initPop($scope);

    // 任务id
    $scope.taskId = $routeParams['taskId'];
    // 任务
    $scope.task = {};
    // 调度
    $scope.schedule = {};

    // 下拉列表选项
    $scope.options = {};

    // 请求该任务的数据
    RequestService.request({
        token: 'tk_taskDetail',
        method: 'GET',
        params: {taskId: $scope.taskId},
        success: function(data) {
            $scope.options = data.selected;
            $scope.task = data.task;
            $scope.schedule = data.task.dispatch;
        }
    });

    // 呼叫列表
    $scope.callList = [];
    // 查询条件
    $scope.conditions = {
        common: {
            // 性别
            sex: '',
            // 外呼状态
            jobState: '',
            // 外呼结果
            outCallStatus: '',
            // 电话号码
            outCallNo: ''
        },
        pageInfo: {
            page: 1,
            pageSize: '5',
            totalPage: 0
        }
    };
    // 总条数
    $scope.total = 0;
    // 获取外呼列表
    $scope.getCallList = function(page) {
        $scope.conditions.pageInfo.page = page;
        RequestService.request({
            token: 'tk_callHistory',
            method: 'GET',
            strParams: 'taskId=' + $scope.taskId + '&' + UtilsService.genConditions($scope.conditions),
            success: function(data) {
                $scope.callList = data.paging.list;
                for (var i = 0; i < $scope.callList.length; i++) {
                    $scope.selectedCallList[$scope.callList[i].id] = false;
                }
                $scope.conditions.pageInfo.totalPage = data.paging.pages;
                $scope.callOptions = data.selected;
                $scope.total = data.paging.total;
            }
        });
    };
    $scope.getCallList(1);

    // 查询手机号
    var timeout;
    $scope.$watch('conditions.common.outCallNo', function(newValue, oldValue) {
        if (newValue == oldValue) {
            return;
        }
        $scope.conditions.common.outCallNo = $scope.conditions.common.outCallNo.trim();
        if (timeout) {
            $timeout.cancel(timeout);
        }
        timeout = $timeout(function() {
            $scope.getCallList(1);
        }, 350);
    });

    // 选择的外呼任务
    $scope.selectedCallList = {};
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
    //$scope.changeCallAll = function() {
    //    var selectedCallList = $scope.selectedCallList;
    //    var first = selectedCallList[Object.keys(selectedCallList)[0]];
    //    for (var j in selectedCallList) {
    //        if (selectedCallList[j] != first) {
    //            return;
    //        }
    //    }
    //    $scope.callAll = first;
    //};

    /**
     * 批量打电话
     */
    $scope.callMany = function(call) {
        var data = '';
        if (call) {
            data = call.id;
        } else {
            for (var jid in $scope.selectedCallList) {
                if ($scope.selectedCallList[jid]) {
                    data += ',' + jid;
                }
            }
            data = data.slice(1);
        }
        RequestService.request({
            token: 'tk_call',
            method: 'POST',
            data: UtilsService.serialize({'taskId': $scope.taskId, 'jobIds': data}),
            success: function(data) {
                for (var id in data.jobs) {
                    for (var i = 0; i < $scope.callList.length; i++) {
                        var c = $scope.callList[i];
                        if (id == c.id) {
                            c.jobState = data.jobs[id];
                        }
                    }
                }
            }
        });
    };

    // 通话详情
    $scope.callDetail = {};
    /**
     * 显示通话详情
     *
     * @param call
     */
    $scope.showCallDetail = function(call) {
        RequestService.request({
            token: 'tk_callDetail',
            method: 'GET',
            success: function(data) {
                $scope.callDetail = {
                    // 电话号码
                    phone: data.jobDetails.phone,
                    // 通话次数
                    callTimes: data.jobDetails.callList.length
                };
                // 通话详情列表
                $scope.callDetailList = data.jobDetails.callList
                $scope.openPop('pop-call-detail');
            }
        });
    };

    /**
     * 播放录音
     *
     * @param record
     */
    $scope.playRecord = function(record) {
        // $scope.callDetail.current = '';
        // $('.record-audio').pause();
        // $('#').play();
    };
}]);

// 调度设置
lbApp.controller('ScheduleController', ['$scope', 'RequestService', 'UtilsService', 'CommonService', function($scope, RequestService, UtilsService, CommonService) {
    // 设置边栏
    $scope.asideTab = {
        listName: 'task',
        tabName: 'schedule'
    };

    // 是否要更新默认调度
    $scope.isUpdate = false;

    // 更新默认调度
    $scope.updateSchedule = function(schedule) {
        RequestService.request({
            token: 'tk_defaultSchedule',
            method: 'POST',
            loading: true,
            data: UtilsService.serialize(schedule),
            success: function(data) {
                $scope.isUpdate = false;
                getDefaultSchedule();
            }
        })
    };

    // 更新的调度信息
    $scope.updateInfo = {};

    // 获取默认调度信息
    function getDefaultSchedule() {
        RequestService.request({
            token: 'tk_defaultSchedule',
            method: 'GET',
            loading: true,
            success: function(data) {
                // 调度信息
                $scope.scheduleInfo = data.dispatch;
                // 配置列表
                $scope.options = data.selected;
                // 更新调度表单
                $scope.updateInfo = CommonService.initSchedule(data.dispatch);
                $scope.$broadcast('scheduleLoaded', {schedule: $scope.updateInfo});
            }
        });
    }
    getDefaultSchedule();
}]);