/**
 * 请求服务
 */
lbApp.factory('RequestService', ['$http', 'UtilsService', function($http, UtilsService) {
    "use strict";
    var baseUrl = 'api/';
    var tokenMap = {
        // 提交注册信息
        't_reg': 'teacher/register',
        //教师端班级列表
        't_classList':'classes/find',
        //班级设置
        't_settingClass':'classes/find',
        //保存班级设置
        't_classUpdate':'classes/update',
        //课程设置
        't_classCourse':'course/show',
        //章节信息
        //'t_exe_List':'exercise/list',
        //登录
        't_login':'teacher/login',
        //新增班级
        't_classAdd':'classes/add',
        //删除班级
        't_classDel':'classes/delete',
        //章节列表
        't_courseChapter':'chapter/list',
        //新建章节
        't_addChapter':'chapter/add',
        //章节信息
        't_chapterShow':'chapter/show',
        //习题列表
        't_exe_list':'QuestionPronunciation/findChapterQuestions',
        //保存章节设置
        't_chapterUpdate':'chapter/update',
        //删除章节
        't_chapterDel':'chapter/del/:chapterId',
        //学生管理
        't_student':'classes/findStudent',
        //学生个人信息
        't_studentInfo':'classes/showStudentInfo',
        //删除学生
        't_studentDel':'classes/delStudent',
        //学生端-我的课程列表
        's_course_list':'student/course/list',
        //学生端-注册
        's_reg':'student/register',
        //学生端-登录
        's_login':'student/login',
        //学生端-加入课程
        's_addCourse':'student/addCourse',
        //学生端-退出课程
        's_delCourse':'student/delCourse/{classesId}',
        //学生端-章节信息
        's_course':'/course/show',
        /*//学生端-章节列表
        's_delCourse':'POST /course/show',*/
        //检索习题
        't_exeIndex':'QuestionPronunciation/find',
        //添加习题
        't_addExe':'chapter/addChapterQuestion',
        //删除习题
        't_exe_del':'chapter/delQuestion/:id',
        //初始化试卷
        't_exercise_list':'exercise/:chapterId/list',
        //提取习题
        's_chapterExercise':'exercise/:chapterExerciseId',
        //提交习题答案
        's_exe_sub':'exercise/submit',
        //交卷
        's_exe_submit':'exercise/submit/Chapter/:chapterExerciseId',

    };
    return {
        tokenMap: tokenMap,
        request: function(reqConfig) {
            var url = tokenMap[reqConfig.token];
            if (!url) {
                console.log('请求token错误');
                return;
            }
            // 替换url中的占位符参数
            if (reqConfig.params) {
                for(var key in reqConfig.params) {
                    url = url.replace(':' + key, reqConfig.params[key]);
                }
            }

            // strParams为url上的参数
            if (reqConfig.strParams) {
                url += '?' + reqConfig.strParams;
            }
            // 判断是否加载loading动画, 在url上加上loading参数用于拦截器进行判断，当发出请求时使用loading动画，当返回响应时去掉loading动画
            if (reqConfig.loading) {
                url += url.indexOf('?') > -1 ? '&' : '?' + 'loading=1';
            }
            // 请求的对象
            var reqObj = {
                url: baseUrl+url,
                method: reqConfig.method || 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            //课程设置
            var reqObj4 = {
                url: "../../data/teacher-settingCourse.json",
            }
            // body中的数据C
            if(reqConfig.data) {
                reqObj.data = reqConfig.data;
            }
            // 发送请求
            $http(reqObj)
                .success(function(data, status, headers, config) {
                    console.log(data);
                    switch (data.code) {
                        case "0":
                            reqConfig.success(data.result);
                            break;
                        case 10010:
                            UtilsService.href('/login');
                            break;
                        case 10073:
                            alert('请您先到注册邮箱中点击链接进行验证');
                            UtilsService.href('/login');
                            break;
                        case 10074:
                            alert('请到个人中心提交营业执照进行审核');
                            UtilsService.href('/profile');
                            break;
                        default:
                            reqConfig.error && reqConfig.error(data);
                            alert(data.msg);
                    }
                })
                .error(function(data, status, headers, config) {
                    reqConfig.error && reqConfig.error(data);
                })
        }
    };
}]);