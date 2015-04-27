 var idx = window.location.href.lastIndexOf('/');
 var baseUrl = window.location.href.slice(0,idx+1);
 require.config({
        baseUrl:baseUrl,
        paths: {
            echarts: baseUrl+'libraries/echarts/build/dist',
            app: baseUrl+'scripts',
        }
    });
    
    // Step:4 require echarts and use it in the callback.
    // Step:4 动态加载echarts然后在回调函数中开始使用，注意保持按需加载结构定义图表路径
    require(
        [
            'echarts',
            'echarts/chart/scatter',
            'app/SearchBox'
        ],
        function (ec,es,sb) {
            //--- 折柱 ---
            var ecConfig = require('echarts/config');
            var myChart = ec.init(document.getElementById('main'));
            option = {
                title : {
                    text: 'LINCS Milestones Overview',
                    subtext: 'An interactive plot',
                    padding: 0
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
                        mark : {
                            show: true,
                            title:{
                                mark: 'enable/disablemarkline',
                                markUndo: 'undo mark line',
                                markClear: 'clear mark line'
                            }},
                        dataZoom : {
                            show: true,
                            title:{
                                dataZoom: 'zoom in selected region',
                                dataZoomReset: 'zoom out'
                            }},
                        restore : {
                            show: true,
                            title:"restore"},
                        saveAsImage : {
                            show: true,
                            title:"save as image"}
                    }
                },
                xAxis : [
                    {
                        type : 'value',
                        scale:true,
                        name:'perturbagen'
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
                        return input.perts[params.value[0]-1].pert + ', '
                        + input.cells[params.value[1]-1].cell
                        + ' <br/>'
                        + input.tooltip[params.value[0]][params.value[1]].centerAssays;
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
                var centerColorMap = {
                    // 'LINCS Transcriptomics':'#e377c2',
                    // 'LINCS PCCSE':'#bcbd22',
                    // 'HMS LINCS':'#17becf',
                    // 'DTOXS':'#e7969c',
                    // 'MEP LINCS':'#ff7f0e',
                    // 'NeuroLINCS':'#2ca02c'
                     'LINCS Transcriptomics':'#0B609A',
                    'LINCS PCCSE':'#0B609A',
                    'HMS LINCS':'#C90016',
                    'DTOXS':'#17becf',
                    'MEP LINCS':'#2ca02c',
                    'NeuroLINCS':'#bcbd22'
                }
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
                // set information box intereactions
                    // define template
                var pertCell = _.template("<div class='pert-cell'><%= pert %>, <%= cell %></div>");
                var assayInfo = _.template(
                    "<div class='milestone'>"+
                    "<div class='center'><%= center %></div>"+
                    "<div class='assay'><%= assay %></div>"+
                    "<div class='assay-info'><%= assayInfo %></div>"+
                    "</div>");
                var bidx = window.location.href.lastIndexOf('/');
                var baseUrl = window.location.href.slice(0,bidx+1); 
                myChart.on(ecConfig.EVENT.CLICK,function(d,e){
                    var pert = input.perts[d.data[0]-1].pert;
                    var cell = input.cells[d.data[1]-1].cell;
                    var ids = input.tooltip[d.data[0]][d.data[1]].ids;
                    $('#dynamic').children().remove();
                    $('#dynamic').append(pertCell({pert:pert,cell:cell}))
                    $.get(baseUrl+'meta?ids='+JSON.stringify(ids),function(data){
                        data.forEach(function(obj){
                            var detail = {};
                            if(obj.assay.length>obj['assay-info'].length
                                && obj.center != 'ISMMS-Iyengar'){
                                detail.assay = obj['assay-info'];
                                detail.assayInfo = obj['assay'];
                            }else{
                                detail.assay = obj['assay'];
                                detail.assayInfo = obj['assay-info'];
                            }
                            detail.center = obj['center']
                            $('#dynamic').append(assayInfo(detail));
                        });
                    });
                     $('#dView').css('display','block')
                    // console.log(d,e);
                });
                $('#dView').draggable();
                $('#close').click(function(){
                    $('#dView').css('display','none');
                    $('#dynamic').children().remove();
                });
                // initialize searchbox
                sb(input,option,myChart);
            })// chartInput callback
        } // main function
    );// require