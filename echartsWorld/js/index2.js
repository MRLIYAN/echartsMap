$(function(){
    map();
})

function map(){
    var myChart = echarts.init(document.getElementById('main'))
    var GeoCoordMap = {
        '中国': [100.501765, 30.756331],
        '美国': [-83.357567, 35.951935],
        '巴西': [-56.903606, -5.480594],
        '澳大利亚': [135.209296, -20.86882]
    };
    var Datas = [
        [{
            name: '中国',
            value: "192.168.0.1",
            price: 100,
            num: 2
        }],
        [{
            name: '美国',
            value: "192.168.0.1",
            price: 100,
            num: 2
        }],
        [{
            name: '巴西',
            value: "192.168.0.1",
            price: 100,
            num: 2
        }],
        [{
            name: '澳大利亚',
            value: "192.168.0.1",
            price: 100,
            num: 2
        }],
    ];
    var convertData = function(data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];
            // 			console.log('dataItem',dataItem) //第二个数据
            var fromCoord = [100.501765, 30.756331];
            var toCoord = GeoCoordMap[dataItem[0].name];
            // 			console.log('toCoord',toCoord);//第一个地址
            if (fromCoord && toCoord) {
                res.push([{
                    coord: fromCoord,
                    value: dataItem[0].value,
                }, {
                    coord: toCoord,
                    dataItem: dataItem
                }]);
            }
        }
        return res;
    };
    
    var series = [];
    [
        ['中国', Datas]
    ].forEach(function(item, i) {
        series.push(
    
            {
                type: 'lines',
                zlevel: 0,
                effect: {
                    // 括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
                    show: true,
                    period: 4, //箭头指向速度，值越小速度越快
                    trailLength: 0.1, //特效尾迹长度[0,1]值越大，尾迹越长重
                    symbol: 'circle', //箭头图标
                    symbolSize: 3, //图标大小
                    color: "#fff"
                },
                lineStyle: {
                    normal: {
                        width: .7, //尾迹线条宽度
                        opacity: 1, //尾迹线条透明度
                        curveness: 0.2, //尾迹线条曲直度
                        color: function(params) { //圆环显示文字
                            return '	#359fd1'
                        },
                    },
                    color: 'red'
                },
                data: convertData(item[1])
            }, {
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                rippleEffect: { //涟漪特效
                    period: 4, //动画时间，值越小速度越快
                    brushType: 'fill', //波纹绘制方式 stroke, fill
                    scale: 4.2 //波纹圆环最大限制，值越大波纹越大
                },
                // 括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
                // symbol: 'none',
                symbol: 'circle',
                symbolSize: function(val) {
                    return 5; //圆环大小
                },
                itemStyle: {
                    normal: {
                        show: false,
                        // color: '#f00'
                        color: function(params) { //圆环显示文字
                            return '	#ffffff'
                        },
                        borderWidth: 0,
                        shadowColor: '#359fd1', //发光🉐效果
                        shadowBlur: 4
                    }
                },
                data: item[1].map(function(dataItem) {
                    // 	console.log('dataItem',dataItem[0]);
                    return {
                        dataItem: dataItem,
                        name: dataItem[0].name,
                        value: GeoCoordMap[dataItem[0].name].concat([dataItem[0].value])
                    };
                }),
            },
            //被攻击点
            {
                type: 'scatter',
                coordinateSystem: 'geo',
                zlevel: 1,
                rippleEffect: {
                    period: 4,
                    brushType: 'stroke',
                    scale: 4
                },
                symbol: 'circle',
                color: 'rgba(128, 220, 251, .6)',
                symbolSize: 20,
                data: [{
                    name: item[0],
                    value: GeoCoordMap[item[0]].concat(["192.168.0.1"]),
                }],
            }
        );
    });
    
    var option = {
        type: 'map',
        mapType: 'world',
        tooltip: {
            formatter: function(e) {
                if (typeof(e.value)[2] == "undefined" || e.name == "") {
                    return e.name;
                } else {
                    return 'IP<br>' + e.name + ':' + e.value[2];
                }
            }
        },
        geo: {
            map: 'world',
            zoom: 1.2,
            label: {
                emphasis: {
                    show: true,
                    color:'white'
                }
            },
            roam: true, //是否允许缩放
            itemStyle: {
                normal: {
                    color: "#68d9fb", //地图背景色
                    borderColor: '#68d9fb', //省市边界线00fcff 516a89
                    borderWidth: 1
                },
                emphasis: {
                    color: 'rgba(104, 217, 251, 127)' //悬浮背景
                }
            },
        },
        series: series
    
    };
    myChart.setOption(option)
}