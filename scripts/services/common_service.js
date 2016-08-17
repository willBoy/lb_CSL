lbApp.factory('CommonService', function() {
    return {
        /**
         * 从schedule实体中返回需要的字段，用于表单
         * 
         * @param scheduleInfo
         * @returns {{firstOutCallTime: *, lastOutCallTime: *, restStartTime: *, restEndTime: *, outcallCeiling: string, reject: string, noAnswer: string, unableAnswer: string, shutDown: string, outsidePhone: string}}
         */
        initSchedule: function(scheduleInfo) {
            return {
                firstOutCallTime: scheduleInfo.firstOutCallTime,
                lastOutCallTime: scheduleInfo.lastOutCallTime,
                restStartTime: scheduleInfo.restStartTime,
                restEndTime: scheduleInfo.restEndTime,
                outcallCeiling: '' + scheduleInfo.outcallCeiling,
                reject: '' + scheduleInfo.reject,
                noAnswer: '' + scheduleInfo.noAnswer,
                unableAnswer: '' + scheduleInfo.unableAnswer,
                shutDown: '' + scheduleInfo.shutDown,
                outsidePhone: '' + scheduleInfo.outsidePhone
            };
        }
    };
});