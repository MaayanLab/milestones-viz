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
                        + input.perts[params.value[0]-1].pert + ', '
                        + input.cells[params.value[1]-1].cell
                };
                option.xAxis[0].axisLabel = {
                    formatter: function(v){
                        if(v>input.perts.length || v<=0)
                            return ''
                        else
                            return input.perts[v-1].pert
                    },
                    'interval':function(indx){return true}
                };
                option.yAxis[0].axisLabel = {
                    formatter: function(v){
                        if(v>input.cells.length || v<=0)
                            return ''
                        else
                            return input.cells[v-1].cell
                    },
                    'interval':0
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
                        series.symbolSize = 5.5
                    if(e[1]=='image')
                        series.symbolSize = 5.5
                    option.series.push(series);
                });
                // set Marklines
                pertClassCount = {}
                currentClass = input.perts[0].pertClass;
                count = 0
                input.perts.forEach(function(e,i){
                    if(e.pertClass==currentClass)
                        count = count+1
                    else{
                        pertClassCount[currentClass] = {};
                        pertClassCount[currentClass].count = count;
                        pertClassCount[currentClass].x = i
                        count = 1;
                        currentClass = e.pertClass;
                    }
                });
                option.series.push({
                        name:'external perturbations end here',
                        type:'scatter',
                        data:[[]],
                        markLine:{
                            data:[
                                [
                                    {name: '', value: pertClassCount['external'].count, 
                                    xAxis: pertClassCount['external'].x+0.5,
                                    yAxis: -10}, 
                                    {name: '', xAxis: pertClassCount['external'].x+0.5,
                                    yAxis: 58}
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
                                    {name: '', value: pertClassCount['genetic'].count,
                                    xAxis: pertClassCount['genetic'].x+0.5, 
                                    yAxis: -10}, 
                                    {name: '', xAxis: pertClassCount['genetic'].x+0.5, 
                                    yAxis: 58}
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
                                    {name: '', value: pertClassCount['microenvironment'].count, 
                                    xAxis: pertClassCount['microenvironment'].x+0.5, 
                                    yAxis: -10}, 
                                    {name: '', xAxis: pertClassCount['microenvironment'].x+0.5, 
                                    yAxis: 58}
                                ]
                            ]
                        }
                });
                // // set legend
                // option.legend = {};
                // option.legend.data = [{name:"Broad",textStyle:{},icon:"emptyTriangle"}]
                myChart.setOption(option);
            })// chartInput callback
        } // main function
    );// require