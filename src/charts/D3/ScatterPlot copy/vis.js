import * as d3 from 'd3';
import { getSeries, getWidth, getAverageRows } from './helper';
import _ ,{ mean }from 'lodash';

const offset = 20; 

const config = {
    "legend-text-color": "rgb(91, 93, 115)"
}

const draw = (props) => {
    let a = document.createElement("div");
    if (!props.onCanvas) {
        d3.select('.'+props.chartId+' > *').remove();
        a = '.'+props.chartId;
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


    const margin = { top: 10, right: 10, bottom: 40, left: 40 };
    const width = props.size.w * 800/6;
    const height = props.size.h * 400/3;

    const fieldsList = props.cardFieldsList;
    const colorList = props.cardColorList;
    const textcolor = props.textcolor;
    



    const globalColorscale = d3.scaleOrdinal()
        .domain(fieldsList)
        .range(colorList);


    let svg = d3.select(a)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                // .style('background-color',cardcolor)
                .append('g')
                .attr("transform", "translate(" + 30 + "," + 10 + ")");
        
                // svg.append("rect")
                // .attr("height", width + margin.left + margin.right)
                // .attr("width", height + margin.top + margin.bottom)
                // .attr("stroke-width","0px")
                // .attr("fill",cardcolor)
                // .attr("transform", "translate(-" + margin.left + ",-" + margin.top + ")");

    // Get Encoding
    const encoding = props.spec.encoding;
    console.log('scaterplotencoding',encoding)
    if (_.isEmpty(encoding) || !('x' in encoding) || !('y' in encoding) || _.isEmpty(encoding.x) || _.isEmpty(encoding.y) ) {
        svg.append("g");
        return svg;
    }

    // Process Data
    let data = props.data;
    data = getAverageRows(data, encoding);

    console.log('data-scatter',data)

    // Encoding
    const chartWidth = width,
        chartHeight = height - 60;//plus legend height

    // color scale
    var colorMaxNumberarr = new Array(100);
    for(var i=0;i<colorMaxNumberarr.length;i++){
        colorMaxNumberarr[i] = i;
    }
    // color = colorScale
    //     .domain(data.map(function(d) { return d[encoding.color.field];}))
    //     .range(colorMaxNumberarr);
    
    svg.append('defs')
        .append('clipPath')
        // .attr("id", 'clip-rect')
        .append('rect')
        .attr("width", width)
        .attr("height", height-60);

    let chart = svg.append("g"),
    // .attr("class", "chart"),
        axis = chart.append("g")
            // .attr("class", "axis")
            .attr("color",textcolor),
        content = chart.append("g")
            // .attr("class", "content")
            .attr("chartWidth", width)
            .attr("chartHeight", height-60)
            .attr("clip-path", "url(#clip-rect)"),
        legend = svg.append("g");

    // X channel
    // const xScale = d3.scaleLinear()
    //         .domain([0, d3.max(data.map(d => parseFloat(d[encoding.x.field])))])//d3.extent(data.map(d=>d[encoding.x.field]))
    //         .range([0, chartWidth])
    //         .nice();

      // Y channel
      const yScale = d3.scaleLinear()
    //   .domain([0, d3.max(data.map(d => parseFloat(d[encoding.y.field])))*1.1])//d3.extent(data.map(d=>d[encoding.y.field]))
      .range([height - 70, 0])
    //   .domain(data.map(function (d) { 
    //       console.log('encoding-y-scatter',d[encoding.y.field])
    //       return d[encoding.y.field]; 
    //     }))
    .domain([d3.min(data, function (d) { return d[encoding.y.field]; }),1.5*d3.max(data, function (d) { return d[encoding.y.field]; })]);
    //   .nice();

    let xScale;
    let axisX;
    let axisY;
    if(encoding.x.type === "quantitative"){
        xScale = d3.scaleLinear()
            // .domain([0, d3.max(data.map(d => parseFloat(d[encoding.x.field])))*1.1])//d3.extent(data.map(d=>d[encoding.x.field]))
            .range([0, width - 70])
            .domain(data.map(function (d) { return d[encoding.x.field]; }))
            .nice();
        axisX = d3.axisBottom(xScale)
                  .ticks(10)
                  .tickPadding(5);
        axisY = d3.axisLeft(yScale)
                  .ticks(10)
                  .tickPadding(5);
    }else{
        xScale=d3.scaleBand() 
                // .domain(data.map(d => d[encoding.x.field]))
                .range([0, width-70])
                .domain(data.map(function (d) { return d[encoding.x.field]; }))
                .padding(1)//气泡居中
        axisX = d3.axisBottom(xScale)
        axisY = d3.axisLeft(yScale);

    }
   
  

    // let axisX = d3.axisBottom(xScale)
    //     .ticks(10)
    //     .tickPadding(5);

    // let axisY = d3.axisLeft(yScale)
    //     .ticks(10)
    //     .tickPadding(5);

    let axis_x = axis.append("g")
        // .attr("class", "axis_x")
        .attr('transform', `translate(0, ${height - 70})`)
        .attr("color",textcolor)
        .call(axisX)
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
        // .attr('stroke',textcolor);


    let axis_y = axis.append("g")
        // .attr("class", "axis_y")
        .attr("color",textcolor)
        .call(axisY)
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

    let series = getSeries(data, encoding);
    
    let indexArray = [];
    for(let i = 0; i < series.length; i++){
        indexArray.push(i);
    }

    const seriesIndexScale = d3.scaleOrdinal()
    .domain(indexArray)
    .range(series);
    
    /* draw points */
    let points = content.append("g")
        .selectAll("circle")
        .data(data)
        .enter().append("circle")
        // .attr("class", "data-item")
        .attr("r", 5)//size
        //.attr("stroke", "#FFF")
        .attr("stroke-width", 1)
        .attr("fill-opacity", 0.4)
        .attr("cx", d => xScale(d[encoding.x.field]))
        .attr("cy", d => yScale(d[encoding.y.field]));
    
    //Color channel
    if(('color' in encoding) && !_.isEmpty(encoding.color)){
        if(encoding.color.type === "quantitative"){
            // const colorLinear = ["LightBlue", "Blue"];

            // let color = d3.interpolate(d3.rgb(colorLinear[0]), d3.rgb(colorLinear[1]));
            // let extent = d3.extent(data, d=>d[encoding.color.field]);
            // let linear = d3.scaleLinear()
            //     .domain(extent)
            //     .range([0, 1]);
            // points.attr("fill", d => color(linear(d[encoding.color.field])));

            // /** show legend **/
            // const gradientW = 100,
            //     gradientH = 10;

            // let linearLegend = legend.append("g")
            //     .attr('transform', `translate(${(chartWidth - gradientW) / 2}, 0)`);

            // let defs = linearLegend.append('defs');
            // let linearGradient = defs.append('linearGradient')
            //     .attr('id', 'linearColor')
            //     .attr('x1', '0%')
            //     .attr('y1', '0%')
            //     .attr('x2', '100%')
            //     .attr('y2', '0%');
            // linearGradient.append('stop')
            //     .attr('offset', '0%')
            //     .style('stop-color', colorLinear[0]);
            // linearGradient.append('stop')
            //     .attr('offset', '100%')
            //     .style('stop-color', colorLinear[1]);
            // linearLegend.append('rect')
            //     .attr('width', gradientW)
            //     .attr('height', gradientH)
            //     .attr("opacity", 0.8)
            //     .style('fill', 'url(#' + linearGradient.attr('id') + ')');
            // linearLegend.append('text')
            //     .attr('class', 'valueText')
            //     .attr('dy', '-0.4em')
            //     .style('fill', config["legend-text-color"])
            //     .style('text-anchor', "middle")
            //     .text(extent[0]);
            // linearLegend.append('text')
            //     .attr('class', 'valueText')
            //     .attr('x', gradientW)
            //     .attr('dy', '-0.4em')
            //     .style('fill', config["legend-text-color"])
            //     .style('text-anchor', "middle")
            //     .text(extent[1]);
        }else{
            points.attr("fill", (d,i) => globalColorscale(seriesIndexScale(i)))
                  .attr("stroke", (d,i) => globalColorscale(seriesIndexScale(i)));
            
            /** show legend **/
            var colorSet = getSeries(data, encoding);
           // console.log("colorSet...",colorSet)
            // var legends = legend.selectAll("legend_color")
            //     .data(colorSet)
            //     .enter().append("g")
            //     .attr("class", "legend_color")
            //     .attr('transform', (d, i) =>`translate(${10}, 0)`);//i * 80 + (chartWidth - 80 * colorSet.length)/2
            // legends.append("circle")
            //     .attr("fill", (d, i) => colorset[i])
            //     .attr("r", 6)
            //     .attr("cy", -5);
            // legends.append("text")
            //     .attr("fill", config["legend-text-color"])
            //     .attr("x", 10)
            //     .text(d => d)
            //     .style('font-family', 'Arial');
            // let legend_nodes=legends.nodes();
            // let before = legend_nodes[0];
            // let current;
            // let offset = 10;

            // for(let i = 1; i< legend_nodes.length; i++){
            //     current = legend_nodes[i];
            //     if(d3.select(before).select("text").node().getComputedTextLength()){
            //         offset += d3.select(before).select("text").node().getComputedTextLength();
            //     }else{
            //         offset += getWidth(colorSet[i-1])
            //     } 
            //     d3.select(current)
            //         .attr('transform', `translate(${i*30 + offset}, 0)`);
            //     before = current;
            // }
            // if(legend.node().getBBox().width){
            //     legend.attr("transform", `translate(${(chartWidth - legend.node().getBBox().width)/2}, ${chartHeight + 60})`);
            // }else{
            //     offset += getWidth(colorSet[colorSet.length-1]);
            //     legend.attr("transform", `translate(${(chartWidth - offset - 30 * colorSet.length + 20)/2}, ${chartHeight + 60})`);
            // }
        }
    }else{
        points.attr("fill", 'rgb(255,255,255)')//color
    }

    //Size channel
    if(('size' in encoding) && !_.isEmpty(encoding.size)){
        let size = d3.scaleLinear()
            .domain(d3.extent(data, d=>d[encoding.size.field]))
            .range([5, 20]);
        points.attr("r", d => size(d[encoding.size.field]));
    }

    // Style
    // const style = props.spec.style;
 // axis_x.selectAll('line')
    //     .attr("opacity", 0.4)
    //     .attr("y2", -chartHeight)
    //     .attr("stroke-dasharray","5,0");

    // axis_y.select('path')
    //     .attr("opacity", 0.4)
    //     .attr("stroke-dasharray","5,0");
    // axis_y.selectAll('line')
    //     .attr("opacity", 0.4)
    //     .attr("x2", chartWidth)
    //     .attr("stroke-dasharray","5,0");

    //     svg.selectAll(".domain")
    //     .attr("stroke",textcolor);
    //     svg.selectAll("line")
    //     .attr("stroke",textcolor)
    //     svg.selectAll("text")
    //     .attr("stroke",textcolor)   

    return svg;
}

export default draw;