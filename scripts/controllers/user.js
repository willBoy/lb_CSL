// 登录
lbApp.controller('LoginController', ['$scope', 'UtilsService', 'RequestService', function($scope, UtilsService, RequestService) {
    "use strict";
    // 密码登录信息
    $scope.pwdLoginInfo = {
        userName: '',
        password: ''
    };
    // 动态密码登录
    $scope.verifyCodeInfo = {
        phone: '',
        code: ''
    };

    UtilsService.genTabs($scope, 'tabLogin');
    
    $scope.getCodeText = '获取语音验证码';
    $scope.isCalling = false;

    /**
     * 获取动态验证码
     */
    $scope.getCode = function() {
        if ($scope.isCalling) {
            return;
        }
        $scope.isCalling = true;
        RequestService.request({
            token: 'tk_getCodeByLogin',
            method: 'GET',
            strParams: 'phone=' + $scope.verifyCodeInfo.phone,
            success: function(data) {
                UtilsService.delayTimer(60, function(sec) {
                    $scope.$apply(function() {
                        if (sec == 0) {
                            $scope.getCodeText = '获取语音验证码';
                            $scope.isCalling = false;
                        } else {
                            $scope.getCodeText = sec + 's';
                        }
                    });
                });
                alert('正在给您拨打电话，请注意接听');
            },
            error: function() {
                $scope.isCalling = false;
            }
        });
    };
    /**
     * 密码登录
     */
    $scope.loginByPwd = function() {
        RequestService.request({
            token: 'tk_login',
            method: 'POST',
            data: UtilsService.serialize($scope.pwdLoginInfo),
            success: function(data) {
                UtilsService.href('/profile');
            }
        });
    };

    /**
     * 动态密码登录
     */
    $scope.loginByCode = function() {
        RequestService.request({
            token: 'tk_loginByVV',
            method: 'POST',
            data: UtilsService.serialize($scope.verifyCodeInfo),
            success: function(data) {
                UtilsService.href('/profile');
            }
        })
    };
}]);

// 注册
lbApp.controller('RegController', ['$scope', '$rootScope', 'RequestService', 'UtilsService', function($scope, $rootScope, RequestService, UtilsService) {
    "use strict";
    //
    $scope.telInfo = {
        inviCode: '',
        tel: '',
        code: ''
    };
    // 注册信息
    $scope.regInfo = {
        companyName: '', // 企业名称
        userName: '', // 姓名
        registEmail: '', // 邮箱
        password: '' // 密码
    };
    
    // 密码是否显示为明文
    $scope.pwdIsText = false;
    
    // 当前步骤，步骤1为验证手机号，第二步填写注册信息
    $scope.step = 1;

    $scope.getCodeText = '获取语音验证码';
    $scope.isCalling = false;
    
    /**
     * 获取手机验证码
     */
    $scope.getCode = function() {
        if ($scope.isCalling) {
            return
        }
        $scope.isCalling = true;
        RequestService.request({
            token: 'tk_getCode',
            method: 'GET',
            strParams: 'phone=' + $scope.telInfo.tel + '&inviCode=' + $scope.telInfo.inviCode,
            success: function(data) {
                UtilsService.delayTimer(60, function(sec) {
                    $scope.$apply(function() {
                        if (sec == 0) {
                            $scope.getCodeText = '获取语音验证码';
                            $scope.isCalling = false;
                        } else {
                            $scope.getCodeText = sec + 's';
                        }
                    });
                });
                alert('正在给您拨打电话，请注意接听');
            },
            error: function() {
                $scope.isCalling = false;
            }
        });
    };

    /**
     * 验证语音验证码
     */
    $scope.next = function() {
        RequestService.request({
            token: 'tk_verifyVoiceCode',
            method: 'POST',
            strParams: 'phone=' + $scope.telInfo.tel + '&code=' + $scope.telInfo.code,
            success: function(data) {
                $scope.step = 2;
            }
        });
    };
    /**
     * 注册
     */
    $scope.reg = function() {
        RequestService.request({
            token: 'tk_reg',
            method: 'POST',
            data: UtilsService.serialize($scope.regInfo),
            success: function(data) {
                $scope.step = 3;
            }
        });
    };
}]);

// 验证邮箱
lbApp.controller('VerifyEmailController', ['$scope', 'RequestService', 'UtilsService', function($scope, RequestService, UtilsService) {
    // 提示信息
    $scope.tips = '';
    $scope.needSendAgain = false;
    var verifyCode = UtilsService.getUrlParam('confirmation_token');
    
    // 请求验证
    RequestService.request({
        token: 'tk_verifyEmail',
        method: 'GET',
        strParams: 'confirmation_token=' + verifyCode,
        success: function(data) {
            UtilsService.href('/login');
        },
        error: function(data) {
            $scope.tips = data.msg;
        }
    });
}]);

// 个人中心
lbApp.controller('ProfileController', ['$scope', 'RequestService', 'UtilsService', function($scope, RequestService, UtilsService) {
    "use strict";
    // 个人中心标签
    $scope.asideTab = {
        listName: 'account',
        tabName: 'profile'
    };
    
    // 绑定弹框事件
    UtilsService.initPop($scope);

    // 请求数据
    RequestService.request({
        token: 'tk_profile',
        method: 'GET',
        loading: true,
        success: function(data) {
            $scope.company = data.company;
            $scope.user = data.user;
        }
    });

    /**
     * 验证邮箱
     */
    // TODO
    $scope.verifyEmail = function() {
        //
    };
    
    // 密码是否显示文本
    $scope.pwdIsText = {
        password: false,
        newPassword: false,
        confirmPassword: false
    }

    // 重设密码信息
    $scope.resetPwdInfo = {
        // 旧密码
        password: '',
        // 新密码
        newPassword: ''
    };
    // 确认新密码
    $scope.confirmPassword = '';

    $scope.resetPasswordForm = function() {
        // 重设密码信息
        $scope.resetPwdInfo = {
            // 旧密码
            password: '',
            // 新密码
            newPassword: ''
        };
        // 确认新密码
        $scope.confirmPassword = '';
        $scope.resetpwd_form.password.$dirty = false;
        $scope.resetpwd_form.new_password.$dirty = false;
        $scope.resetpwd_form.confirm_password.$dirty = false;
    };
    /**
     * 修改密码
     */
    $scope.modifyPwd = function() {
        if ($scope.resetPwdInfo.newPassword !== $scope.confirmPassword) {
            alert('两次输入的密码不一致');
            return;
        }
        RequestService.request({
            token: 'tk_resetPwd',
            method: 'POST',
            data: UtilsService.serialize($scope.resetPwdInfo),
            success: function(data) {
                alert('修改密码成功');
                $scope.closePop('pop-resetpwd');
                $scope.resetPasswordForm();
            }
        });
    };
    // 密码是否是明文
    $scope.pwdIsText = false;
    // 重设手机号码
    $scope.resetPhoneInfo = {
        // 密码
        password: '',
        // 电话号码
        phone: '',
        // 验证码
        code: ''
    };
    $scope.getCodeText = '获取语音验证码';
    $scope.isCalling = false;

    /**
     * 获取动态验证码
     */
    $scope.getCode = function() {
        if ($scope.isCalling) {
            return;
        }
        $scope.isCalling = true;
        RequestService.request({
            token: 'tk_getResetVoiceCode',
            method: 'POST',
            data: UtilsService.serialize($scope.resetPhoneInfo),
            success: function(data) {
                UtilsService.delayTimer(60, function(sec) {
                    $scope.$apply(function() {
                        if (sec == 0) {
                            $scope.getCodeText = '获取语音验证码';
                            $scope.isCalling = false;
                        } else {
                            $scope.getCodeText = sec + 's';
                        }
                    });
                });
                alert('正在给您拨打电话，请注意接听');
            },
            error: function() {
                $scope.isCalling = false;
            }
        });
    };
    $scope.resetPhoneForm = function() {
        $scope.resetPhoneInfo = {
            // 密码
            password: '',
            // 电话号码
            phone: '',
            // 验证码
            code: ''
        };
        $scope.resetphone_form.password.$dirty = false;
        $scope.resetphone_form.phone.$dirty = false;
        $scope.resetphone_form.code.$dirty = false;
    };
    /**
     * 修改手机号
     */
    $scope.modifyPhone = function() {
        RequestService.request({
            token: 'tk_resetPhone',
            method: 'POST',
            data: UtilsService.serialize($scope.resetPhoneInfo),
            success: function(data) {
                $scope.user = data.currentUser;
                alert('手机号修改成功');
                $scope.closePop('pop-resetphone');
                $scope.resetPhoneForm();
            }
        });
    };
    
    // 是否正在体验
    $scope.testIsSend = false;

    /**
     * 体验
     */
    $scope.doTest = function() {
        if ($scope.testIsSend) {
            return;
        }
        $scope.testIsSend = true;
        RequestService.request({
            token: 'tk_test',
            method: 'GET',
            success: function(data) {
                $scope.testIsSend = false;
                alert('正在给您拨打电话，请注意接听');
            },
            error: function() {
                $scope.testIsSend = false;
            }
        })
    };

    // 资质审核的表单数据
    $scope.authInfo = {
        qualificationName: '',
        fileUrl: ''
    };
    /**
     * 上传营业证书
     */
    $scope.uploadFile = function() {
        jupload('file', RequestService.tokenMap['tk_uploadAuth'], function(data) {
            // 如果用户长时间不操作导致session失效，服务器就返回none，前段跳转到登录页
            if(data == 'need login') {
                UtilsService.href('/login');
                return;
            }
            if (data) {
                $scope.$apply(function() {
                    $scope.authInfo.fileUrl = data;
                    $scope.licensesError = false;
                });
            }
        }, ['jpg', 'jpeg', 'png', 'gif']);
    };
    /**
     * 提交审核
     */
    $scope.submitAudit = function() {
        if ($scope.authInfo.fileUrl == '') {
            $scope.licensesError = true;
            return;
        }
        RequestService.request({
            token: 'tk_auth',
            method: 'POST',
            data: UtilsService.serialize($scope.authInfo),
            success: function(data) {
                $scope.closePop('pop-audit');
                $scope.authInfo = {
                    qualificationName: '',
                    fileUrl: ''
                };
                $scope.company.checkStatus = data.company.checkStatus;
            }
        });
    };
    
}]);