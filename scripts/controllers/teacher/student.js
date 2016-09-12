/**
 * Created by Lingban on 2016/9/9.
 */
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