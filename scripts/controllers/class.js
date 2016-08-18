// ��ҳ
lbApp.controller('ClassListController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    // ���ñ���
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };

    //�༶�б�����
    $scope.t_classList = [];

    // ��ȡ�༶�б���
        RequestService.request({
            token: 't_classList',
            method: 'POST',
            success: function(data) {
                $scope.t_classList = data.list;
            }
        });
  }]);
//�༶����
lbApp.controller('ClassDetailController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    "use strict";
    // ���ñ���
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    //�༶��ϸ��Ϣ
    $scope.classDetail ={};
    RequestService.request({
        token:'t_settingClass',
        method:'post',
        success: function(data){
            $scope.classDetail = data.class;
        }
    })

}]);

//�½��༶
lbApp.controller('CreateClassController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    // ���ñ���
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };

    // ������Ϣ
    $scope.taskInfo = {
        // ��ʼʱ��
        startTime: '',
        // ����ʱ��
        endTime: '',
    };
    $scope.class ={
        //�༶����
        className:'123',
        //�γ�����
        courseName:'123',
        //����ʱ��
        classStartTime:'1990-02-03',
        //�༶״̬
        classStatus:''
    }
    $scope.classAdd = function(){
            RequestService.request({
                token:'classAdd',
                method:'POST',
                loading:true,
                data: UtilsService.serialize($scope.class),
                success: function (data) {
                    UtilsService.href('/classList');
                }
            })
    }

    function initDatePicker(startTimeArray, endTimeArray) {
        // ѡ��ʼ����
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
    }
    var now = new Date(),
        nowArray = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
    initDatePicker(nowArray, nowArray);

    function checkTime() {
        // �Ƿ���д�˿�ʼʱ��
        if (!$scope.taskInfo.startTime) {
            $scope.dateError = '��ѡ��ʼ����';
            $scope.showDateError = true;
            return false;
        }
        // �Ƿ���д�˽���ʱ��
        if (!$scope.taskInfo.endTime) {
            $scope.dateError = '��ѡ���������';
            $scope.showDateError = true;
            return false;
        }
        // ��ʼ�����Ƿ���ڽ�������
        var startTimeStamp = (new Date($scope.taskInfo.startTime)).getTime();
        var endTimeStamp = (new Date($scope.taskInfo.endTime)).getTime();
        if (startTimeStamp > endTimeStamp) {
            $scope.dateError = '��ʼ���ڲ������ڽ�������';
            $scope.showDateError = true;
            return false;
        }
        $scope.showDateError = false;
        return true;
    }

}]);

//�γ̹���
lbApp.controller('CourseController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
    //�༶�γ�
    $scope.classCourse={};
    //�½��б�
    $scope.classCourseSession = [];
    RequestService.request({
        token:'t_classCourse',
        method:'POST',
        loading:true,
        success:function(data){
            $scope.classCourse = data.course;
            $scope.classCourseSession = data.list2;
        }
    })
}]);

//�½�����
lbApp.controller('SessionController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
}]);
//ϰ�����
lbApp.controller('SxerciseController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    //
    "use strict";
    $scope.asideTab = {
        listName: 'navigation',
        tabName: 'tabName'
    };
}]);