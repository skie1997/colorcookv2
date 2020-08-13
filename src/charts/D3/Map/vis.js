import * as d3 from 'd3';
import chinaData from './geo/chinaGeo';
import worldData from './geo/worldGeo';
import usStateData from './geo/usStateGeo';
import { getData, getMapType } from './helper';
import _ ,{ mean }from 'lodash';

const mapParams = {
    "ChinaMap": {
        geoData: chinaData,
    },
    "WorldMap": {
        geoData: worldData,
    },
    "USMap": {
        geoData: usStateData,
    },

}
//legend宽高位置 
const rectWidth = 340; //矩形的宽度
const rectHight = 20;//矩形的高度
const rectMarginBottom = 90;//距离底部90





const draw = (props) => {
    let a = document.createElement("div");
    if (!props.onCanvas) {
        d3.select('.'+props.chartId+' > *').remove();
        a = '.'+props.chartId;
    }

    //默认卡片背景
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


    // Get Encoding
    const encoding = props.spec.encoding;
    console.log('encoding',encoding);
    // Process Data
    let parseData = props.data;

    //  获取地图类型
    let chartType = getMapType(parseData, encoding);
    let mapdata = {};
    let projection = d3.geoMercator();    // 默认地图投影
    if (!chartType) { //默认中国 
        mapdata = mapParams.ChinaMap
    } else {
        if (chartType === 'ChinaMap') {
            mapdata = mapParams.ChinaMap
        } else if (chartType === 'WorldMap') {
            mapdata = mapParams.WorldMap
        } else if (chartType === 'USMap') {
            mapdata = mapParams.USMap
            projection = d3.geoAlbersUsa(); //美国地图投影
        } else { //默认中国地图
            mapdata = mapParams.ChinaMap
        }
    }

    const width = props.size.w * 800/6;
    const height = props.size.h * 400/3;
    projection.fitSize([width-40, height-60], mapdata.geoData) //地图根据屏幕自适配 

    let svg = d3.select(a)
        .append("svg")
        .attr("width", width-20)
        .attr("height", height)
        .append("g")
    
        // svg.append("rect")
        //     .attr("height", props.width - 20)
        //     .attr("width", props.height - 20)
        //     .attr("stroke-width","0px")
        //     .attr("fill",cardcolor)
            // .attr("transform", "translate(-" + margin.left + ",-" + margin.top + ")");

    if (_.isEmpty(encoding) || !('area' in encoding) || _.isEmpty(encoding.area)) {
        svg.append("g");
        return svg;
    }

    let encodingData = getData(parseData, encoding);
    //中英文地区值判断
    let isEnLanguage = encodingData.isEN;
    //将读取到的数据存到数组values，令其索引号为各省的名称
    let values = encodingData.values;
    let encodingValue = Object.values(values);

    console.log('encodingvalue',encodingValue)

    //求最大值和最小值
    let maxValue = 0;
    let minValue = 0;
    if (!_.isEmpty(encoding.color)) {
        maxValue = d3.max(encodingValue);
        minValue = d3.min(encodingValue);
    }
    let midValue = (minValue + maxValue)/2

    

    //定义最小值和最大值对应的颜色
    // let blueColor = colorset[colorset.length - 3];
    let whiteColor = d3.rgb(241,241,241);
    // let redColor = colorset[colorset.length - 1];
    const fieldsList = props.cardFieldsList;
    const colorList = props.cardColorList;
    // const textcolor = props.textcolor;

  
  
    let minColor = colorList[0];
    let midColor = d3.rgb(241,241,241);
    let maxColor = colorList[1];



    let pathcolor;
   if(textcolor == 'rgb(64,64,64)'){
       console.log('textcolor=',textcolor)
        pathcolor = 'rgb(233,233,233)'
   }else{
       pathcolor = 'rgb(255,255,255)'
   }

    

    

    let scale;
    let isLogScale = false;
    let computeColor;
    if (minValue >= 0) { //如果都是大于0的数，就直接从白到红即可，不需要蓝色
        computeColor = d3.interpolate(minColor, maxColor);
        // let logScale = d3.scaleLog().domain([1, maxValue]); //默认值域range是[0, 1]
        // scale = logScale;
        scale = d3.scaleLinear().domain([minValue, maxValue]);
        // isLogScale = true;
    } else if (minValue < 0 && maxValue >= 0) { //如果数据中有负数，有正数，取绝对值最大的值最大值，取相反数为最小值；负数为蓝，正数为红, 零为白色
        maxValue = Math.abs(minValue) >= maxValue ? Math.abs(minValue) : maxValue
        minValue = -maxValue;   
        computeColor = d3.scaleLinear()
            .domain([minValue, maxValue])
            .range([minColor, midColor,maxColor])

    } else {
        computeColor = d3.interpolate(minColor, maxColor);
        // let logScale = d3.scaleLog().domain([1, maxValue]); //默认值域range是[0, 1]
        // scale = logScale;
        scale = d3.scaleLinear().domain([minValue, maxValue]);
    }

    // 定义地理路径生成器
    const path = d3.geoPath()
        .projection(projection);

    //路径的分组元素
    svg.selectAll('path')
        .data(mapdata.geoData.features)
        .enter()
        .append('path')
        .attr('stroke', cardcolor)
        .attr('stroke-width', 1)
        .attr('fill', function (d, i) {
            let value;
            if (chartType === 'USMap') {
                value = values[d.properties.name]
            } else {
                value = isEnLanguage ? values[d.properties.enName] : values[d.properties.name]; //中国与世界地图做中英文适配
            }
            if (!value) return 'rgb(227, 228, 229)'//'rgb(227, 228, 229)' //不存在数据的国家，显示灰色
            //设定各省份的填充色
            let color = computeColor(scale(value));
            if(color == undefined){
                return ''
            }
            //console.log("logScale", d.properties.name,value,scale(value),color)
            return color.toString()
        })
        .attr('d', path)


    if (!_.isEmpty(encoding.color)) {
        //定义一个线性渐变
        var defs = svg.append("defs");

        var linearGradient = defs.append("linearGradient")
            .attr("id", "linearColor")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%");

        if (minValue >= 0){
            linearGradient.append("stop")
            .attr("offset", "0%")
            .style("stop-color", minColor);
            linearGradient.append("stop")
            .attr("offset", "100%")
            .style("stop-color", maxColor);

        }else if (minValue < 0 && maxValue >= 0){
            linearGradient.append("stop")
                .attr("offset", "0%")
                .style("stop-color", minColor);
            linearGradient.append("stop")
                .attr("offset", "50%")
                .style("stop-color", midColor);
            linearGradient.append("stop")
                .attr("offset", "100%")
                .style("stop-color", maxColor);
        }else{
            linearGradient.append("stop")
            .attr("offset", "0%")
            .style("stop-color", minColor);
            linearGradient.append("stop")
            .attr("offset", "100%")
            .style("stop-color", maxColor);
        }
        

        //添加一个矩形，并应用线性渐变
        svg.append("rect")
            .attr("x", 20)
            .attr("y", height-60)
            .attr("width", width-60)
            .attr("height", rectHight)
            .style("fill", "url(#" + linearGradient.attr("id") + ")")
            // .attr("transform", "translate(" + 0 + "," + height - 60 + ")");;

        //添加文字
        svg.append("text")
            .attr("class", "valueText")
            .attr("x", (props.width - rectWidth) / 2 - 10) //字离左侧矩形往左偏移10
            .attr("y", props.width - rectMarginBottom + 50) //字离下侧矩形偏移50
            .attr("dy", "-0.3em")
            .attr("stroke",textcolor)
            .text(function () {
                return minValue;
            });

        if (isLogScale) {
            //中间是1,10,100...
            let middleCount = 0;
            let firstText = 1;
            let countMin = minValue;
            while (countMin >= 1) { //找第一个点
                firstText *= 10;
                countMin /= 10;
            }
            if (firstText > 1 && minValue !== 1) {
                middleCount++;
            }

            let afterFirstText = firstText;
            while (afterFirstText < maxValue) {
                afterFirstText *= 10;
                middleCount++;
            }

            //绘制中间的数值
            let totalCount = middleCount + 1;//将矩形的宽度totalCount等分
            let currentCount = 1;
            let textValue = firstText;
            while (middleCount--) {
                let posX = (props.width - rectWidth) / 2 + (currentCount / totalCount) * rectWidth - 10;//字离中间矩形往左偏移10
                let posY = props.width - rectMarginBottom + 50;//字离下侧矩形偏移50
                drawMiddleText(svg, posX, posY, textValue, textcolor);
                currentCount++;
                textValue *= 10
            }
        } else {
            //零的位置
            svg.append("text")
                .attr("class", "valueText")
                .attr("x", (props.width / 2) - 10) //字离中间矩形往左偏移10
                .attr("y", props.width - rectMarginBottom + 50) //字离下侧矩形偏移50
                .attr("dy", "-0.3em")
                .attr("stroke",textcolor)
                .text(function () {
                    return 0;
                });
        }
        svg.append("text")
            .attr("class", "valueText")
            .attr("x", ((props.width - rectWidth) / 2 + rectWidth) - 10) //字离右侧矩形往左偏移10
            .attr("y", props.width - rectMarginBottom + 50) //字离下侧矩形偏移50
            .attr("dy", "-0.3em")
            .attr("stroke",textcolor)
            .text(function () {
                return maxValue;
            });
    }
    return svg;
}
function drawMiddleText(svg, posX, posY, text, textcolor) {
    svg.append("text").attr("class", "valueText")
        .attr("x", posX)
        .attr("y", posY)
        .attr("dy", "-0.3em")
        .attr("stroke",textcolor)
        .text(function () {
            return text;
        });
}

export default draw;