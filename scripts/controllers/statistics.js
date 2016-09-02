// 数据分析
lbApp.controller('StatisticsController', ['$scope', 'RequestService', function($scope, RequestService) {
    /**
     * 绘制接通情况
     *
     * @param percent
     * @param selector
     */
    function drawConnect(percent, selector) {
        var svgWidth = 60;
        var pieData = d3.pie()([percent, 100 - percent]);
        // 内外半径
        var outerRadius = 30, innerRadius = 25;
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
                return ["#1f77b4", "#eeeeee"][i];
            })
            .attr('d', function(d) {
                return arc(d);
            });
        // 增加提示
        var tips = d3.select('.d3-tips');
    }
    // 通话成功率
    drawConnect(30, '#call-success');
    // 首呼接通率
    drawConnect(40, '#first-call-connected');
    // 外呼接通率
    drawConnect(50, '#out-call-success');
    // 机主接通率
    drawConnect(70, '#connect-success');

    function drawConnectByTime(data, selector) {
        // svg的宽高
        var svgWidth = 538,
            svgHeight = 200;
        var padding = {left: 30, right: 20, top: 20, bottom: 20};
        var svg = d3.select(selector)
            .datum(data[0])
            .attr('width', svgWidth)
            .attr('height', svgHeight);

        var xScale = d3.scaleLinear()
            .domain([d3.min(data[0], function(d) {return d[0]}), d3.max(data[0], function(d) {return d[0]})])
            .range([0, svgWidth - padding.left - padding.right]);
        var yScale = d3.scaleLinear()
            .domain([d3.min(data[0], function(d) {return d[1]}), d3.max(data[0], function(d) {return d[1]})])
            .range([svgHeight - padding.top - padding.bottom, 0]);
        // 创建直线生成器
        var line = d3.line()
            .defined(function(d) {return d;})
            .x(function(d) {
                return xScale(d[0]);
            })
            .y(function(d) {
                return yScale(d[1]);
            });
        // 添加折线
        svg.selectAll('path')
            .data(data)
            .enter()
            .append('path')
            .attr('d', function(d) {
                return line(d);
            })
            .attr('fill', 'none')
            .attr('stroke-width', 1)
            .attr('class', 'd3-line')
            .attr('transform', 'translate(' + padding.left + ', ' + padding.top + ')');
        // 添加区域
        var area = d3.area()
            .defined(line.defined())
            .x(line.x())
            .y1(line.y())
            .y0(yScale(d3.min(data[0], function(d) {return d[1]})));
        svg.append('path')
            .attr('class', 'd3-area')
            .attr('d', area)
            .attr('transform', 'translate(' + padding.left + ', ' + padding.top + ')');
        // 添加圆点
        svg.selectAll('.dot')
            .data(data[0].filter(function(d) {return d;}))
            .enter()
            .append('circle')
            .attr('class', 'd3-dot')
            .attr('cx', line.x())
            .attr('cy', line.y())
            .attr('r', 3.5)
            .attr('transform', 'translate(' + padding.left + ', ' + padding.top + ')');
        // x轴
        var xAxis = d3.axisBottom(xScale)
            .ticks(data[0].length)
            .tickFormat(d3.format('d'));
        svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + padding.left + ', ' + (svgHeight - padding.bottom) + ')')
            .call(xAxis);
        // y轴
        var yAxis = d3.axisLeft(yScale);
        svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + padding.left + ', ' + padding.top + ')')
            .call(yAxis);
        // 增加提示
        var tips = d3.select('.d3-tips');
    }
    drawConnectByTime([[[0, 5], [1, 20], [2, 23], [3, 12], [4, 34], [5, 21], [6, 89], [7, 9], [8, 28], [9, 10], [10, 10], [11, 32], [12, 42], [13, 2], [15, 45], [16, 12], [17, 34], [18, 21], [19, 16], [20, 7], [21, 43], [22, 56], [23, 5]]], '#connect-by-time');

    /**
     * 绘制分时通话成功的情况
     *
     * @param data
     * @param selector
     */
    function drawCallSuccessByTime(data, selector) {
        // svg的宽高
        var svgWidth = 538,
            svgHeight = 200;
        // svg的padding
        var padding = {left: 30, right: 40, top: 20, bottom: 20};

        var svg = d3.select(selector)
            .attr('width', svgWidth)
            .attr('height', svgHeight);
        // 柱形宽度（含空白）
        var rectWidthWithPadding = (svgWidth - padding.left - padding.right)/(data.length - 1);
        var radio = 0.8;
        // 柱形宽度（不含空白）
        var rectWidth = rectWidthWithPadding * radio;
        // 设置比例尺
        var x = d3.scaleLinear()
            .domain([0, 23])
            .range([0, svgWidth - padding.left - padding.right]);
        var y = d3.scaleLinear()
            .domain([0, d3.max(data)])
            .range([svgHeight - padding.top - padding.bottom, 0]);
        var rect = svg.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'd3-rect')
            .attr('x', function(d, i) {
                return padding.left + i * rectWidthWithPadding;
            })
            .attr('y', function(d, i) {
                return y(d) + padding.top;
            })
            .attr('width', function(d, i) {
                return rectWidth;
            })
            .attr('height', function(d) {
                return svgHeight - padding.top -padding.bottom - y(d);
            });
        // x轴
        var xAxis = d3.axisBottom(x)
            .ticks(data.length - 1);
        svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + (padding.left + rectWidth/2) + ', ' + (svgHeight - padding.bottom) + ')')
            .call(xAxis);
        // y轴
        var yAxis = d3.axisLeft(y);
        svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + padding.left + ', ' + padding.top + ')')
            .call(yAxis);

    }
    drawCallSuccessByTime([30, 29, 18, 27, 19, 09, 12, 5, 23, 10, 30, 29, 18, 27, 19, 09, 12, 5, 23, 10, 12, 45, 43, 12], '#call-success-by-time');

    function drawTotalConnect(data, selector) {
        // svg宽高
        var svgWidth = 240,
            svgHeight = 240;
        // svg padding
        var padding = 20;
        var svg = d3.select(selector)
            .attr('width', svgWidth)
            .attr('height', svgHeight);
        // 创建饼状图布局
        var pie = d3.pie()
            .value(function(d) {return d[1];});
        var pieData = pie(data);
        // 内外半径
        var outerRadius = (svgWidth - 2 * padding)/2,
            innerRadius = 0;
        var arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);
        var arcs = svg.selectAll('g')
            .data(pieData)
            .enter()
            .append('g')
            .attr('transform', 'translate(' + svgWidth/2 + ', ' + svgHeight/2 + ')');
        var colorList = [];
        // 添加路径
        arcs.append('path')
            .attr('fill', function(d, i) {
                colorList.push(d3.schemeCategory10[i]);
                return d3.schemeCategory10[i];
            })
            .attr('d', function(d) {
                return arc(d);
            });
        // 添加文字
        arcs.append('text')
            .attr('transform', function(d) {
                var x = arc.centroid(d)[0] * 1.4;
                var y = arc.centroid(d)[1] * 1.4;
                return 'translate(' + x + ', ' + (y + 10) + ')';
            })
            .attr('text-anchor', 'middle')
            .text(function(d) {
                var percent = Number(d.value)/d3.sum(data, function(d) {return d[1];}) * 100;
                return percent.toFixed(1) + '%';
            });
        // 添加图例
        var legend = svg.selectAll('.legend')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
                var legendX = i * 40 + 40,
                    legendY = svgHeight - padding + 8;
                return 'translate(' + legendX + ', ' + legendY + ')';
            });
        legend.append('rect')
            .attr('x', function(d, i) {
                return i * 60;
            })
            .attr('y', 0)
            .attr('width', 16)
            .attr('height', 8)
            .style('fill', function(d, i) {
                return colorList[i];
            });
        legend.append('text')
            .attr('x', function(d, i) {
                return i * 60 + 20;
            })
            .attr('y', 9)
            .attr('width', 16)
            .attr('height', 8)
            .text(function(d) {
                return d[0];
            });
    }
    drawTotalConnect([['未接通', 40], ['已接通', 60]], '#total-connect');
    
    function drawTotalDetail(data, selector) {
        // svg宽高
        var svgWidth = 700,
            svgHeight = 240;
        // svg padding
        var padding = 20;
        var svg = d3.select(selector)
            .attr('width', svgWidth)
            .attr('height', svgHeight);
        // 创建饼状图布局
        var pie = d3.pie()
            .value(function(d) {return d[1];});
        var pieData = pie(data);
        // 内外半径
        var outerRadius = (svgHeight - 2 * padding)/2,
            innerRadius = outerRadius - 50;
        var arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);
        var arcs = svg.selectAll('g')
            .data(pieData)
            .enter()
            .append('g')
            .attr('transform', 'translate(' + svgWidth/2 + ', ' + svgHeight/2 + ')');
        var colorList = [];
        // 添加路径
        arcs.append('path')
            .attr('fill', function(d, i) {
                colorList.push(d3.schemeCategory10[i]);
                return d3.schemeCategory10[i];
            })
            .attr('d', function(d) {
                return arc(d);
            });
        // 添加图例
        var legend = svg.selectAll('.legend')
            .data(data)
            .enter()
            .append('g')
            .attr('width', 100)
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
                var legendX = 500,
                    legendY = i * 30 + 40;
                return 'translate(' + legendX + ', ' + legendY + ')';
            });
        legend.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 16)
            .attr('height', 8)
            .style('fill', function(d, i) {
                return colorList[i];
            });
        legend.append('text')
            .attr('x', 30)
            .attr('y', 10)
            .attr('width', 16)
            .attr('height', 8)
            .text(function(d) {
                return d[0] + '  ' + d[1];
            });
    }
    drawTotalDetail([['用户拒接', 80], ['无人接听', 50], ['暂时无法接听', 80], ['空号', 76], ['已关机', 43]], '#total-detail');
}]);