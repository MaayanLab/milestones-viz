 require.config({
        paths: {
            echarts: '../libraries/echarts/build/dist'
        }
    });
    
    // Step:4 require echarts and use it in the callback.
    // Step:4 动态加载echarts然后在回调函数中开始使用，注意保持按需加载结构定义图表路径
    require(
        [
            'echarts',
            'echarts/chart/scatter'
        ],
        function (ec) {
            //--- 折柱 ---
            var myChart = ec.init(document.getElementById('main'));
            option = {
                title : {
                    text: 'LINCS Milestones Overview',
                    subtext: 'An interactive plot'
                },
                tooltip : {
                    trigger: 'axis',
                    showDelay : 0,
                    axisPointer:{
                        show: true,
                        type : 'cross',
                        lineStyle: {
                            type : 'dashed',
                            width : 1
                        }
                    }
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataZoom : {show: true},
                        dataView : {show: true, readOnly: false},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                xAxis : [
                    {
                        type : 'value',
                        scale:true,
                        name:'perturbation'
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        scale:true,
                        name:'cell'
                    }
                ]
            };
                    
            $.getJSON('data/chartInput',function(input){
                option.tooltip.formatter = function(params){
                        return params.seriesName + ' <br/>'
                        + input.perts[params.value[0]].pert + ', '
                        + input.cells[params.value[1]].cell
                };
                option.xAxis[0].axisLabel = {
                    formatter: function(v){
                        if(v>input.perts.length-1)
                            return ''
                        else
                            return input.perts[v].pert
                    }
                };
                option.yAxis[0].axisLabel = {
                    formatter: function(v){
                        if(v>input.cells.length-1)
                            return ''
                        else
                            return input.cells[v].cell
                    }
                };
                // set symbol and color
                // var colors =  d3.scale.category10().range();
                var colors = ["#ff7f0e","#17becf", "#2ca02c", 
                "#e7969c", "#bcbd22", "#e377c2"];
                var centers = _.uniq(_.map(input.centerAssays,function(centerAssay){
                    return centerAssay[0];
                }));
                var centerColorMap = {}
                centers.forEach(function(e,i){
                    centerColorMap[e] = colors[i];
                })
                var assaySymbolMap = {
                    'image':'emptyRectangle',
                    'transcriptomic':'emptyTriangle',
                    'proteomic':'emptyCircle',
                    'phenotypic':'emptyDiamond'
                }
                option.color = [];
                option.symbolList = [];
                input.centerAssays.forEach(function(e){
                    option.color.push(centerColorMap[e[0]]);
                    option.symbolList.push(assaySymbolMap[e[1]]);
                });
                // option.series = [
                //     {
                //         name:'test',
                //         type:'scatter',
                //         data:[[5,6],[7,8]]
                //     }
                // ]
                // set series
                option.series = [];
                input.centerAssays.forEach(function(e,i){
                    var series = {}
                    series.name = e[0]+' ,'+e[1];
                    series.type = 'scatter';
                    series.data = input.serieses[i];
                    if(e[1]=='proteomic')
                        series.symbolSize = 6
                    option.series.push(series);
                });
                // set Marklines
                option.series.push({
                        name:'external perturbations end here',
                        type:'scatter',
                        data:[[]],
                        markLine:{
                            data:[
                                [
                                    {name: '', value: 141, xAxis: 141.5, yAxis: -10}, 
                                    {name: '', xAxis: 141.5, yAxis: 58}
                                ]
                            ]
                        }
                });
                option.series.push({
                        name:'genetic perturbations end here',
                        type:'scatter',
                        data:[[]],
                        markLine:{
                            data:[
                                [
                                    {name: '', value: 17, xAxis: 158.5, yAxis: -10}, 
                                    {name: '', xAxis: 158.5, yAxis: 58}
                                ]
                            ]
                        }
                });
                option.series.push({
                        name:'microenvironment perturbations end here',
                        type:'scatter',
                        data:[[]],
                        markLine:{
                            data:[
                                [
                                    {name: '', value: 108, xAxis: 265.5, yAxis: -10}, 
                                    {name: '', xAxis: 265.5, yAxis: 58}
                                ]
                            ]
                        }
                });
                //set legend
                option.legend = {};
                option.legend.data = _.map(input.centerAssays,function(centerAssay){
                    return centerAssay[0]+','+centerAssay[1];
                })
                myChart.setOption(option);
            })// chartInput callback
        } // main function
    );// require