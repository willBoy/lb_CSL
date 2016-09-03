// 实时监控
lbApp.controller('MonitoringController', ['$scope', 'RequestService', 'UtilsService', function($scope, RequestService, UtilsService) {
    /**
     * 绘制通话情况
     *
     * @param selector
     * @param data
     * @param tip0
     * @param tip1
     */
    function drawChat(selector, data, tip0, tip1) {
        var svgWidth = 30;
        var pieData = d3.pie()(data);
        // 内外半径
        var outerRadius = svgWidth/2,
            innerRadius = outerRadius - 6;
        // 弧形生成器
        var arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
        var chatSvg = d3.select(selector).attr('width', svgWidth).attr('height', svgWidth);
        // 为每段路径添加分组元素
        var arcs = chatSvg.selectAll('g')
            .data(pieData)
            .enter()
            .append('g')
            .attr('transform', 'translate(' + svgWidth/2 + ',' + svgWidth/2 + ')');
        // 添加路径
        arcs.append('path')
            .attr('fill', function(d, i) {
                return d3.schemeCategory10[i];
            })
            .attr('d', function(d) {
                return arc(d);
            })
            .on('mouseover', function(d, i) {
                tips.style('left', d3.event.pageX + 10 + 'px')
                    .style('top', d3.event.pageY + 'px')
                    .style('display', 'block');
                if (i == 0) {
                    tips.html(tip0 + d.data + '%');
                } else {
                    tips.html(tip1 + d.data + '%');
                }
            })
            .on('mouseleave', function(d) {
                tips.style('display', 'none');
            });
        // 增加提示
        var tips = d3.select('.d3-tips');
    }
    // 绘制正常挂断率
    drawChat('#normal-chat', [30, 70], '正常挂断率为', '异常挂断率为');
    // 绘制异常挂断率
    drawChat('#error-chat', [70, 30], '异常挂断率为', '正常挂断率为');

    /**
     * 画当日通话量
     *
     * @param dataArray
     */
    function drawChatCount(dataArray) {
        var binWidth = 10;
        var chatCountSvg= d3.select('#chat-count').attr('width', 30).attr('height', 30);
        // 比例尺
        var linear = d3.scaleLinear()
            .domain([0, d3.max(dataArray)])
            .range([0, 20]);
        // 绘制
        chatCountSvg.selectAll('rect')
            .data(dataArray)
            .enter()
            .append('rect')
            .attr('fill', function(d, i) {
                return d3.schemeCategory10[i];
            })
            .attr('x', function(d, i) {
                return i * (binWidth + 2);
            })
            .attr('y', 4)
            .attr('width', binWidth)
            .attr('height', function(d, i) {
                return linear(d);
            })
            .on('mouseover', function(d, i) {
                tips.style('left', d3.event.pageX + 10 + 'px')
                    .style('top', d3.event.pageY + 'px')
                    .style('display', 'block');
                if (i == 0) {
                    tips.html('当日通话量为' + d);
                } else {
                    tips.html('昨日通话量为' + d);
                }
            })
            .on('mouseleave', function(d, i) {
                tips.style('display', 'none');
            });
        // 增加提示
        var tips = d3.select('.d3-tips');
    }
    drawChatCount([10, 40]);

    UtilsService.initPop($scope);
}]);