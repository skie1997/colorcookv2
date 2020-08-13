import * as d3 from 'd3';
import { getCategories, getAggregatedRows, getWidth } from './helper';
import _ ,{ mean }from 'lodash';
import Color from '@/constants/Color';
import { cardColor } from '../../../selectors/canvas';

// const config = {
//     "legend-text-color": "#666"
// }

const draw = (props) => {
    let a = document.createElement("div");
    d3.select(a)
    .attr("width",props.size.w * 800/6-10)
    .attr("height",props.size.h * 400/3);
    if (!props.onCanvas) {
        d3.select('.'+props.chartId+' > *').remove();
        a = '.'+props.chartId;
    }
    console.log('piechart-props',props)
    //默认卡片背景
    // let cardcolor;
    // let cardcolor;
    // let textcolor="rgb(0, 0, 0)";
    const  textcolor = props.textcolor;
    const  cardcolor = props.cardcolor;
    console.log('textcolor',textcolor)
    const style = props.spec.style;

    //  //hex -> rgb
    //  function hexToRgb(hex) {
    //     return 'rgb(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5))
    //             + ',' + parseInt('0x' + hex.slice(5, 7)) + ')';
    // }
    // if(props.backgroundcolor){
    //     let bg = props.backgroundcolor;
    //     let flag = 0;
    //     console.log('bg',bg)
    //     //计算cardcolor
    //     switch(bg){
    //         case '#090B20':
    //             cardcolor = 'rgba(16,22,56,0.8)'
    //             textcolor = 'rgb(68,255,212)'
    //             flag = 2
    //             break;
    //         case '#423457':
    //             cardcolor = 'rgba(20,11,30,0.8)'
    //             textcolor = 'rgb(255,255,255)'
    //             flag = 2
    //             break;
    //         case '#0e022a':
    //             cardcolor = 'rgba(14,2,42,0.8)'
    //             textcolor = 'rgb(255,255,255)'
    //             flag = 2
    //             break;
    //         case '#20787c':
    //             cardcolor = 'rgba(13,51,70,0.8)'
    //             flag = 2
    //             break;
    //         case '#0b0f28':
    //             cardcolor = 'rgba(16,22,56,0.8)'
    //             textcolor = 'rgb(27,117,194)'
    //             flag = 2
    //             break;
    //         case '#4d305e':
    //             cardcolor = 'rgba(53,27,66,0.8)'
    //             textcolor = 'rgb(255,255,255)'
    //             flag = 2
    //             break;
    //         case '#524741':
    //             cardcolor = 'rgba(59,49,47,0.8)'
    //             textcolor = 'rgb(255,255,255)'
    //             break;
    //         case '#476E2D':
    //             cardcolor = 'rgba(28,60,22,0.8)'
    //             textcolor = 'rgb(255,255,255)'
    //             flag = 2
    //             break;
    //         case '#2B363A':
    //             cardcolor = 'rgba(33,42,49,0.8)'
    //             textcolor = 'rgb(255,255,255)'
    //             flag = 2
    //             break;
    //         case '#3f728f':
    //             cardcolor = 'rgba(43,78,98,0.8)'
    //             textcolor = 'rgb(255,255,255)'
    //             flag = 2
    //             break;
    //     }

    //     //未匹配的时 背景与颜色映射
    //     if(flag == 0){
    //         if(bg[0] == '#'){
    //             bg = hexToRgb(bg)
    //         }
            
    //         let temp = bg.split(',')
    //         let r = parseInt(temp[0].split('(')[1]);
    //         let g = parseInt(temp[1]);
    //         let b = parseInt(temp[2].split('(')[0]);

    //         textcolor= 'rgb('+ `${255-r}` + ',' + `${255-g}` +','+ `${255-b}` +')';
    //         if(mean([r,g,b]) >=150){
    //           cardcolor = 'rgba('+ `${r+10 > 255 ? 255: r+10}` + ',' + `${g+10 > 255 ? 255: g+10}` +','+ `${b+10 > 255 ? 255: b+10}` +',0.8)';
    //         }else{
    //           cardcolor = 'rgba('+ `${r-15 < 0 ? 0 : r-15}` + ',' + `${g-15 < 0 ? 0: g-15}` +','+ `${b-15 < 0 ? 0: b-15}` +',0.8)';
    //         }
            
    //     }
    // }

    // d3.select('.vis-piechart').style('background-color',backcolor);


    const margin = { top: 100, right: 100, bottom: 100, left: 100 };
    console.log('props.w',props.size.h * 400/3)
    const width = props.size.w * 800/6 ;
    const height = props.size.h * 400/3 ;

    const fieldsList = []
    const colorList = []
    

    props.globalColorpair.forEach((item, index) =>{
        fieldsList.push(Object.keys(item)[0])
        colorList.push(Object.values(item)[0])
    })

    const globalColorscale = d3.scaleOrdinal()
        .domain(fieldsList)
        .range(colorList);


    let svg = d3.select(a)
        //在svg之前添加center元素以保证svg居中显示
        .append("center")
        .append("svg")
        .attr("width", width-20)
        .attr("height", height ) 
        // .style("backgroundColor","black")   
        .append("g")
        .attr("transform", "translate(" + -20 + "," + -20 + ")");

        // svg.append("rect")
        //     .attr("height", '100%' )
        //     .attr("width", '100%' )
        //     .attr("stroke-width","0px")
        //     .attr("fill",cardcolor)
        //     .attr("transform", "translate(" + -10 + "," + -10 + ")");
    

    //Get Encoding
    const encoding = props.spec.encoding;
    if (_.isEmpty(encoding) || !('size' in encoding) || _.isEmpty(encoding.size)|| !('color' in encoding) || _.isEmpty(encoding.color)) {
        svg.append("g");
        return svg;
    }

    console.log('encoding-pie',encoding)

    // Process Data
    let data = props.data;
    data = getAggregatedRows(data, encoding);

    //Get categories
    let dataCategories = getCategories(data, encoding);
    let categories = Object.keys(dataCategories);

    //Color channel
    // let color;
    // if ('color' in encoding) {
    //     // let colorScale = Color.CHANNEL_COLOR;
    //     let colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    //     console.log(colorScale);

    //     color = colorScale.domain(data.map(function (d) { return d[encoding.color.field]; }));
    // }
    // let color = d3.scaleOrdinal()
    // .range(Color.CHANNEL_COLOR);

    // const style = props.spec.style;
    const colorset = style.colorset;

    let typepie='piechart';//piechart,donutchart

    //Compute the position of each group on the pie
    let pie = d3.pie()
        .value(function (d) { return d[encoding.size.field]; });
    let pieData = pie(data);



    //Build the pie chart


    let arc = d3.arc() //弧生成器
        .innerRadius(function(){
            if (typepie=='piechart')  return 0;
            else return 80;
        }) //设置内半径
        .outerRadius(width > height? height/2-30:width/2-30); //设置外半径
        // .cornerRadius(5);
    let arc2 = d3.arc() //弧生成器
        .innerRadius(function(){
            if (typepie=='piechart')  return 0;
            else return 80;
        }) //设置内半径
        .outerRadius(width > height? height/2-20:width/2-20);

    let arcs = svg.selectAll("g")
        .data(pieData)
        .enter()
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    arcs.append("path")
        .attr("fill", function (d, i) { 
            // console.log('d-pie',d.data[])
            // return colorset[i]; 
            return globalColorscale(d.data[encoding.color.field])
        })
        .attr("class",function (d, i) { 
            console.log('d', d.data[encoding.color.field])
            return d.data[encoding.color.field]; })
        .style("stroke",cardcolor)
        .style("stroke-width", "5px")
        .attr("d", function (d, i) {
            return arc(d);
        });

    //draw text-label
    arcs.append("text")
        .attr('transform', function (d, i) {
            var x = arc.centroid(d)[0] * 1.8;
            var y = arc.centroid(d)[1] * 1.8;
            return 'translate(' + x + ', ' + y + ')';
        })
        .attr('text-anchor', 'middle')
        .attr("opacity", "0")
        .text(function (d) {
            var percent = Number(d.value) / d3.sum(pieData, function (d) {
                return d.value;
            }) * 100;
            return percent.toFixed(1) + '%';
        });

    //draw text-line
    arcs.append('line')
        //.attr('stroke', '#5B5D73')
        .attr('stroke', textcolor)
        .attr('x1', function (d) { return arc.centroid(d)[0] * 1.4; })
        .attr('y1', function (d) { return arc.centroid(d)[1] * 1.4; })
        .attr('x2', function (d, i) {
            return arc.centroid(d)[0] * 1.7;
        })
        .attr('y2', function (d, i) {
            return arc.centroid(d)[1] * 1.7;
        })
        .attr("opacity", "0");

    // Style
    // const style = props.spec.style;

    // // legend
    // const legend = svg.append("g");
    //     // .attr("transform", "translate(-40, 0)");
    // var legends = legend.selectAll("legend_color")
    //     .data(categories)
    //     .enter()
    //     .append("g")
    //     .attr("class", "legend_color")
    //     .attr('transform', (d, i) => `translate(${-15}, 0)`);//i * (80 + 10) + (width - (categories.length * 80 + (categories.length - 1) * 10)) / 2

    // legends.append("rect")
    //     .attr("fill", (d,i) => colorset[i])
    //     .attr('x', 15)
    //     .attr('y', -10)
    //     .attr("width", '10px')
    //     .attr('height', '10px')
    //     .attr("rx", 1.5)
    //     .attr("ry", 1.5)
    // // .attr("cy", -5);
    // legends.append("text")
    //     .attr("fill", textcolor)
    //     .attr("x", 35)
    //     .text(d => d);

    //     let legend_nodes=legends.nodes();
    //     let before = legend_nodes[0];
    //     let current;
    //     let offset = -15;

    // for(let i = 1; i< legend_nodes.length; i++){
    //     current = legend_nodes[i];
    //     if(d3.select(before).select("text").node().getComputedTextLength()){
    //         offset += d3.select(before).select("text").node().getComputedTextLength();
    //     }else{
    //         offset += getWidth(categories[i-1])
    //     } 
    //     d3.select(current)
    //         .attr('transform', `translate(${i*30 + offset}, 0)`);
    //     before = current;
    // }
    // if(legend.node().getBBox().width){
    //     legend.attr("transform", `translate(${(width - legend.node().getBBox().width)/2}, ${height-10})`);
    // }else{
    //     offset += getWidth(categories[categories.length-1]);
    //     legend.attr("transform", `translate(${(width - offset - 30 * categories.length + 20)/2}, ${height-10})`);
    // }
    svg.selectAll("text")
    .attr("fill",textcolor)

    // svg.selectAll('path')
    // .on("mouseover", function(d, i) {
    //     let selectedclass=d3.select(this).attr('class');
    //        let indexnum=selectedclass.replace(/[^0-9]/ig,"");
                    
    //     //    d3.selectAll("path")
    //     //    .transition()
    //     //    .attr('opacity',"0.3");
    //        d3.selectAll("."+selectedclass)
    //        .transition()
    //        .attr("d", function (d, i) {
    //         return arc2(d);
    //     });

    //     //   return tooltip.style('visibility', 'visible').text(colortype[indexnum]+" : "+pictorialdata[indexnum].toFixed(2));

    // })
    // .on("mouseout", function(d) {
    //     let selectedclass=d3.select(this).attr('class');
         
    //     d3.selectAll("."+selectedclass)
    //     .transition()
    //     .attr("d", function (d, i) {
    //      return arc(d);
    //  });
    //     // return tooltip.style('visibility', 'hidden')
     
    // });
    // .attr("")
    return svg;
}

export default draw;