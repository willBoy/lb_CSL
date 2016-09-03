/**
 * 保存项目配置信息
 */
lbApp.factory('ConfigService', function() {
    "use strict";
    return {
        // 企业认证状态
        companyVerifyStatus: {
            '0': '审核中',
            '1': '审核通过',
            '-1': '已拒绝'
        },
        // 机器人审核状态
        robotCheckStatus: {
            '0': 'checking',
            '-1': 'rejected',
            '1': 'passed'
        },
        // 性别
        sex: {
            '0': '女',
            '1': '男'
        },
        // 通话双方的身份
        identity: {
            '0': '坐席',
            '1': '客户'
        },
        // 角色
        role: {
            
        },
        // 任务状态
        taskStatus: {
            '1': 'notStart',// 未开始
            '2': 'running',// 正在执行
            '3': 'paused',// 暂停
            '4': 'end'// 已结束
        },
        // 外呼状态
        outCallStatus: {
            '0': 'notStart',// 未开始
            '1': 'running',// 正在进行
            '2': 'done'// 已完成
        },
        // 图片baseUrl
        imgBaseUrl: 'http://img.aiaas.ai',
        // 机器人类型
        robotModel: {
            voice: '1',
            birthday: '2'
        },
        // 声音类型
        soundType: {
            man: '1',
            women: '2',
            child: '3'
        }
    };
});