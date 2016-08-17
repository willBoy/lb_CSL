(function(global, $) {
    /**
     * 上传文件的功能函数
     *
     * @param fileName 后端处理表单时的name
     * @param actionUrl 上传的地址
     * @param callback 上传后端的回调方法
     */
    global.jupload = function(fileName, actionUrl, callback, extNameArray) {
        // 校验参数
        fileName += '';
        actionUrl += '';
        if (Object.prototype.toString.call(callback) !== '[object Function]') {
            throw new Error('回调函数类型错误');
        }
        // 对于每次上传生成一个随机标志
        var targetId = 'jupload' + (new Date()).getTime();
        var formId = targetId;
        var callbackId = targetId;
        // 拼凑form表单的html文本
        var formDocument = "<form id='" + formId + "' action='" + actionUrl + (actionUrl.indexOf('?') > -1 ? '&' : '?') + 'callback=' + callbackId + "' method='post' target='" + targetId + "' enctype='multipart/form-data' style='display: none;'>" +
            "<input type='file' name='" + fileName + "' value=''>" +
            "<input type='submit'>" +
            "<iframe id='" + targetId + "' name='" + targetId + "'></iframe>" +
            "</form>";
        $(formDocument).appendTo('body');
        // 开始上传文件
        $('#' + formId).find("input[type='file']")
            .on('change', function() {
                if (extNameArray) {
                    var fileExt = $(this).val();
                    if (extNameArray.indexOf(fileExt.split('.').pop().toLowerCase()) < 0) {
                        alert('上传文件格式为：' + extNameArray.join('、'));
                        return;
                    }
                }
                $('#' + formId).submit();
            })
            .click();
        // 绑定回调函数
        window[callbackId] = callback;
    }
})(window, jQuery);