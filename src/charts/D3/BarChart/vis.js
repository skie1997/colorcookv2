import * as d3 from 'd3';
import { getStackedData, getSeries, getAggregatedRows, getWidth } from './helper';
import _ from 'lodash';

const config = {
    "legend-text-color": "#666"
}
//const offset = 20; // To show whole chart

const draw = (props) => {
    let a = document.createElement("div");
    if (!props.onCanvas) {
        d3.select('.'+props.chartId+' > *').remove();
        a = '.'+props.chartId;
        // d3.select('.'+props.chartId+' > *').remove();
        // a = '.'+props.chartId;
        console.log('chart-id',d3.select('.'+props.chartId+' > *'))
    }

    console.log('props-bar',props)

    const margin = { top: 10, right: 10, bottom: 40, left: 40 };
    const width = props.size.w * 800/6;
    const height = props.size.h * 400/3;

    const fieldsList = props.cardFieldsList;
    const colorList = props.cardColorList;
    const textcolor = props.textcolor;
    



    const globalColorscale = d3.scaleOrdinal()
        .domain(fieldsList)
        .range(colorList);
    console.log('fieldsList',fieldsList)
    console.log('colorList',colorList)

    let svg = d3.select(a)
        .append("svg")
        .attr("width", width-20)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + 30 + "," + 10 + ")");

    // svg.append("rect")
    //     .attr("height", props.width-20)
    //     .attr("width", props.height-20)
    //     .attr("x", 10)
    //     .attr("y", 10)
    //     .attr("cx", 50)
    //     .attr("cy", 50)
    //     .attr("stroke","#eee")
    //     .attr("stroke-width",5)
    //     // .style("border","2px solid #4674b2")
    //     // .style('border-radius','4px')
    //     .attr("fill","white")
    //     .attr("transform", "translate(-" + margin.left + ",-" + margin.top + ")");

    // Get Encoding
    const encoding = props.spec.encoding;
    if (_.isEmpty(encoding) || !('x' in encoding) || !('y' in encoding) || _.isEmpty(encoding.x) || _.isEmpty(encoding.y)) {
        svg.append("g");
        return svg;
    }
    let hasSeries = ('color' in encoding) && ('field' in encoding.color);;

    // Process Data
    let data = props.data;
    let stackedData = [];
    let dataSeries = [];
    let series = [];
    if (hasSeries) {
        dataSeries = getSeries(data, encoding);
        stackedData = getStackedData(data, encoding);
        series = Object.keys(dataSeries);
    } else {
        data = getAggregatedRows(data, encoding);
    }

    console.log('stackedData',stackedData)
    for(let i = 0; i<stackedData[0].length; i++){
        for(let j = 0; j< stackedData.length; j++){
            if((stackedData[j][i][1]- stackedData[j][i][0])>0){
                let flagBottom = true;
                let flagTop = true;
                for(let k = 0; k < j; k++){
                    if((stackedData[k][i][1]- stackedData[k][i][0])>0){
                        flagBottom = false;
                        break;
                    }
                }
                for(let k = j+1; k < stackedData.length; k++){
                    if((stackedData[k][i][1]- stackedData[k][i][0])>0){
                        flagTop = false;
                        break;
                    }
                }
                if(flagBottom && flagTop){
                    stackedData[j][i].type = 'single'
                }else if(flagBottom){
                    stackedData[j][i].type = 'bottom'
                }else if(flagTop){
                    stackedData[j][i].type = 'top'
                }else{
                    stackedData[j][i].type = 'center'
                }
            }
        }
    }

    // const dataProcessed = []
    // for(let i=0; i<stackedData.length; i++){
    //     let temp1 = [];
    //     let temp1Data = stackedData[i]
    //     for(let j=0; j<temp1Data.length; j++){
    //         let temp2 = {};
    //         let temp2Data = temp1Data[j]
         
    //         temp2.axis = temp2Data.data.x;
    //         temp2.value = temp2Data[1] - temp2Data[0];
    //         temp1.push(temp2);
    //     }
    //     dataProcessed.push(temp1);  
    // }


    

    // X channel
    let x = d3.scaleBand()
        .range([0, width-70])
        .domain(data.map(function (d) { return d[encoding.x.field]; }))
        .padding(0.5);

    // Y channel
    let y = d3.scaleLinear()
    if (hasSeries) {
        y.domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])]).nice().range([height-70, 0]);
    } else {
        y.domain([0, d3.max(data, function (d) { return d[encoding.y.field]; })]).range([height-70, 0]);
    }

    // Color channel
    console.log('bar-style',props.spec.style);
    const style = props.spec.style;
    const colorset = style['colorset'];
    
    // let color = d3.scaleOrdinal(d3.schemeCategory10);

    // Bars
    if (hasSeries) {
        let n = series.length;
        let layer = svg.selectAll('layer')
            .data(stackedData)
            .enter()
            .append('g')
            .attr('class', 'layer')
            .style('fill', (d, i) => {
                return globalColorscale(d.key)
            })

        function RoundedRectBottom(x, y, width, height, radius) {
            
            return "M" + x + "," + y
                    //绘制水平线
                    + "h" + (width )
                    + "v" + (height -  radius)
                    + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
                    + "h" + (2*radius - width)
                    + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + -radius
                    + "z";
            }
            function RoundedRectTop(x, y, width, height, radius) {
            
                return "M" + x + "," + `${y+2*radius}`
                        + "a" + -radius + "," + radius + " 0 0 1 " + radius + "," + -radius
                        //绘制水平线
                        + "h" + (width - 2*radius)
                        + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
                        + "v" + (height - 2 * radius)
                        
                        + "h" + (-width)
                        + "z";
                }
                function RoundedRectCenter(x, y, width, height, radius) {
            
                    return "M" + x + "," + y
                           
                            //绘制水平线
                            + "h" + (width)
                            // + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
                            + "v" + (height )
                            // + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
                            + "h" + ( - width)
                            + "z";
                }
                function RoundedRectSingle(x, y, width, height, radius) {
            
                    return "M" + x + "," + (y+radius)
                            + "a" + -radius + "," + radius + " 0 0 1 " + radius + "," + -radius
                            //绘制水平线
                            + "h" + (width - 2*radius)
                            + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
                            + "v" + (height - 2*radius)
                            + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
                            + "h" + ( 2*radius- width)
                            + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + -radius
                            + "z";
                }
        let rect = layer.selectAll('path')
            .data(d => {
                return d.map(x => {
                    x.series = d.key.toString();
                    return x;
                });
            })
            .enter()
            .append('path');

        // let style = props.spec.style;
        //如果没有指定style, 置为默认(报错在重新mapping时)
        // if(style.layout == 'undefined'){
            style.layout = "stacked"
        // }
       
        console.log('barstyle',style)
        if (style.layout === "stacked") {
            y.domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])]).nice();
            
            rect.attr("d", function(d) {
                // console.log('rect-path',rightRoundedRect(x(d.data.x), y(d[1]), x.bandwidth() - 1 - x(0),y(d[0]) - y(d[1]), 10))
                let seriesIndex = series.indexOf(d.series);
                console.log('d-bar',d)
                console.log(seriesIndex)
                if(d.type){
                    if(d.type == 'bottom'){
                        return RoundedRectBottom(x(d.data.x), y(d[1]), x.bandwidth() - 1,y(d[0]) - y(d[1]), 5);
                    }else if(d.type == 'top'){
                        return RoundedRectTop(x(d.data.x), y(d[1]), x.bandwidth() - 1,y(d[0]) - y(d[1]), 5);
                    }else if(d.type == 'center'){
                        return RoundedRectCenter(x(d.data.x), y(d[1]), x.bandwidth() - 1,y(d[0]) - y(d[1]), 5);
                    }else if(d.type == 'single'){
                        return RoundedRectSingle(x(d.data.x), y(d[1]), x.bandwidth() - 1,y(d[0]) - y(d[1]), 5);
                    }        
                }
                
              })
            // .style('stroke-width', '0')
            //     .attr('x', d =>x(d.data.x))
            //     .attr('width', x.bandwidth() - 1)
            //     .attr('y', d => y(d[1]))
            //     .attr('height', d => y(d[0]) - y(d[1]))
            //     ;
        } else if (style.layout === "percent") {
            let totalDict = {};
            stackedData[stackedData.length - 1].forEach(d => {
                totalDict[d.data.x] = d[1];
            });
            y.domain([0, 1]);
            rect.style('stroke-width', '0')
                .attr('x', d => x(d.data.x))
                .attr('width', x.bandwidth() - 1)
                .attr('y', d => {
                    let total = totalDict[d.data.x];
                    return y(d[1] / total);
                })
                .attr('height', d => {
                    let total = totalDict[d.data.x];
                    return y(d[0] / total) - y(d[1] / total);
                });
        } else {
            // grouped
            let max = 0;
            stackedData.forEach(ds => {
                ds.forEach(d => {
                    if ((d[1] - d[0]) > max) {
                        max = d[1] - d[0];
                    }
                });
            });
            y.domain([0, max]).nice();
            rect.style('stroke-width', '0')
                .attr('x', d => {
                    return x(d.data.x) + (x.bandwidth() - 1) / n * series.indexOf(d.series);
                })
                .attr('width', (x.bandwidth() - 1) / n)
                .attr('y', d => {
                    return y(0) - (y(d[0]) - y(d[1]))
                })
                .attr('height', d => y(d[0]) - y(d[1]))
        }
    } else {
        svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .style('stroke-width', '0')
            .attr("x", function (d) { return x(d[encoding.x.field]); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(d[encoding.y.field]); })
            .attr("y", function (d) { return y(d[encoding.y.field]); })
            .style('fill', colorset[0]);
    }

    
    let tooltip = d3.select('body')
                .append('div')
                .style('background-color','#fff')
                .style('border','1px solid #000')
                .style('position', 'absolute')
                .style('z-index', '10')
                .style('color', '#000')
                .style('visibility', 'hidden')   // 是否可见（一开始设置为隐藏）
                .style('font-size', '12px')


    // Axis
    svg.append("g")
        .attr("transform", "translate(0," + `${height-70}` + ")")
        .style("color",textcolor)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .text(function(d,i){
            return d.toString().length > 1? d.toString().slice(0,2)+'..':d
        })
        .style('width','10px')
        .on('mouseover', function (d, i) {
          
            return tooltip.style('visibility', 'visible').text(d)
          })
          .on('mousemove', function (d, i) {
            return tooltip.style('top', (d3.event.pageY-10)+'px').style('left',(d3.event.pageX+10)+'px')
          })
          .on('mouseout', function (d, i) {
            return tooltip.style('visibility', 'hidden')
          })
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
    svg.append("g").call(d3.axisLeft(y))
    // .ticks(5)
    .style("color",textcolor)
        .selectAll("text")
        .text(function(d,i){
            console.log('d.texty',d)
            return d.toString().length > 1? d.toString().slice(0,2)+'..':d
        })
        .style('width','10px')
        .on('mouseover', function (d, i) {
            console.log('d.text',this.width)
            return tooltip.style('visibility', 'visible').text(d)
          })
          .on('mousemove', function (d, i) {
            return tooltip.style('top', (d3.event.pageY-10)+'px').style('left',(d3.event.pageX+10)+'px')
          })
          .on('mouseout', function (d, i) {
            return tooltip.style('visibility', 'hidden')
          });

    // legend
    // let colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    // legend
    // const legend = svg.append("g")
    //.attr("transform", `translate(0, ${height + 60})`);

   
    // var legends = legend.selectAll("legend_color")
    //     .data(series)
    //     .enter()
    //     .append("g")
    //     .attr("class", "legend_color")
    //     .attr('transform', (d, i) => `translate(${-15}, 0)`);//i * (80 + 10) + (width - (categories.length * 80 + (categories.length - 1) * 10)) / 2

    // legends.append("rect")
    //     .attr("fill", (d, i) => colorset[i])
    //     .attr('x', 15)
    //     .attr('y', -10)
    //     .attr("width", '10px')
    //     .attr('height', '10px')
    //     .attr("rx", 1.5)
    //     .attr("ry", 1.5)
    // // .attr("cy", -5);
    // legends.append("text")
    //     .attr("fill", config["legend-text-color"])
    //     .attr("x", 35)
    //     .text(d => d);

    // let legend_nodes = legends.nodes();
    // let before = legend_nodes[0];
    // let current;
    // let offset = -15;

    // for (let i = 1; i < legend_nodes.length; i++) {
    //     current = legend_nodes[i];
    //     if (d3.select(before).select("text").node().getComputedTextLength()) {
    //         offset += d3.select(before).select("text").node().getComputedTextLength();
    //     } else {
    //         offset += getWidth(series[i - 1])
    //     }
    //     //console.log("offset1", offset)
    //     d3.select(current)
    //         .attr('transform', `translate(${i * 30 + offset}, 0)`);
    //     before = current;
    // }
    // if (legend.node().getBBox().width) {
    //     legend.attr("transform", `translate(${(width - legend.node().getBBox().width) / 2}, ${height + 60})`);
    // } else {
    //     offset += getWidth(series[series.length - 1]);
    //    // console.log("offset2", offset)
    //     legend.attr("transform", `translate(${(width - offset - 30 * series.length + 20) / 2}, ${height + 60})`);
    // }
    return svg;
}

export default draw;