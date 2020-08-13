import * as d3 from 'd3';
import { getSeries, getWidth } from './helper';
import './style.css';

var d = [
    [
        {axis:"Email",value:0.59},
        {axis:"Networks",value:0.56},
        {axis:"Banking",value:0.42},
        {axis:"Sportsite",value:0.34},
        {axis:"Engine",value:0.48}
    ],[
        {axis:"Email",value:0.48},
        {axis:"Networks",value:0.41},
        {axis:"Banking",value:0.27},
        {axis:"Sportsite",value:0.58},
        {axis:"Engine",value:0.46}
    ],[
        {axis:"Email",value:0.3},
        {axis:"Networks",value:0.6},
        {axis:"Banking",value:0.5},
        {axis:"Sportsite",value:0.25},
        {axis:"Engine",value:0.6}
    ]
    ];

const draw = (props) => {
    console.log('draw',props)
    d3.select('.vis-radarchart > *').remove();
    // const colorset = props.colorset;
    const colorset = ['rgb(141,211,199)','rgb(255,255,179)','rgb(190,186,218)','rgb(251,128,114)','rgb(219,191,140)','rgb(130,212,230)','rgb(146,181,204)','rgb(242,177,173)'];
    // const data = props.data;
    let w,h;
    if(!props.size){
        w = 3;
        h =2;
    }else{
        w = props.size.w;
        h = props.size.h;
    }
 
    const margin = {top: 10, right: 40, bottom: 20, left: 50};
    const width = w/12*window.innerWidth - margin.left - margin.right;
    const height = h/12*window.innerHeight - margin.top - margin.bottom;

    const data = d;

    var LegendOptions = ['Smartphone','Tablet'];
    //TODO: draw the chart   
    var cfg = {
        radius: 5,
        w: height,
        h: height,
        factor: 1,
        factorLegend: .6,
        levels: 3,
        maxValue: 0,
        radians: 2 * Math.PI,
        opacityArea: 0, //0.5
        ToRight: 5,
        TranslateX: 80,
        TranslateY: 30,
        ExtraWidthX: 100,
        ExtraWidthY: 100,
        color: d3.scaleOrdinal(colorset)
    };
   

    cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function (i) {
        return d3.max(i.map(function (o) {
            return o.value;
        }))
    }));
    var allAxis = (d[0].map(function (i, j) {
        return i.axis
    }));
    var total = allAxis.length;
    var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);

    let svg = d3.select('.vis-radarchart').append('svg')
        .attr('width',width + margin.left + margin.right)
        .attr('height',height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let color = d3.scaleOrdinal(colorset);
    
    var tooltip;

    const encoding = props.encoding;
    const chartWidth = width,
        chartHeight = height - 40;//plus legend height

    let chart = svg.append("g").attr("class", "chart"),
    content = chart.append("g")
        .attr("class", "content")
        .attr("chartWidth", chartWidth)
        .attr("chartHeight", chartHeight)
        .attr("clip-path", "url(#clip-rect)"),
    legend = svg.append("g");

    //Circular segments
    for (var j = 0; j < cfg.levels - 1; j++) {
        var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
        content.selectAll(".levels")
            .data(allAxis)
            .enter()
            .append("svg:line")
            .attr("x1", function (d, i) {
                return levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total));
            })
            .attr("y1", function (d, i) {
                return levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total));
            })
            .attr("x2", function (d, i) {
                return levelFactor * (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total));
            })
            .attr("y2", function (d, i) {
                return levelFactor * (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total));
            })
            .attr("class", "line")
            .style("stroke", "grey")
            .style("stroke-opacity", "0.75")
            .style("stroke-width", "0.3px")
            .attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", " + (cfg.h / 2 - levelFactor) + ")");
    }

    var series = 0;

    var axis = content.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

    axis.append("line")
        .attr("x1", cfg.w / 2)
        .attr("y1", cfg.h / 2)
        .attr("x2", function (d, i) {
            return cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total));
        })
        .attr("y2", function (d, i) {
            return cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total));
        })
        .attr("class", "line")
        .style("stroke", "grey")
        .style("stroke-width", "1px");

    // axis.append("text")
    //     .attr("class", "legend")
    //     .text(function (d) {
    //         return d
    //     })
    //     .style("font-family", "sans-serif")
    //     .style("font-size", "11px")
    //     .attr("text-anchor", "middle")
    //     .attr("dy", "1.5em")
    //     .attr("transform", function (d, i) {
    //         return "translate(0, -10)"
    //     })
    //     .attr("x", function (d, i) {
    //         return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total);
    //     })
    //     .attr("y", function (d, i) {
    //         return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total);
    //     });

    // var long = [];
    // var shapes = [];
    data.forEach(function (y, x) {
        var dataValues = [];
        content.selectAll(".nodes")
            .data(y, function (j, i) {
                dataValues.push([
                    cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                    cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                ]);
            });
        dataValues.push(dataValues[0]);
        var polygon = content.selectAll(".area")
            .data([dataValues])
            .enter()
            .append("polygon")
            .attr("class", "radar-chart-serie" + series)
            .style("stroke-width", "2px")
            .style("stroke", cfg.color(series))
            .attr("points", function (d) {
                var str = "";
                for (var pti = 0; pti < d.length; pti++) {
                    str = str + d[pti][0] + "," + d[pti][1] + " ";
                }
                return str;
            })
            .style("fill", function (j, i) {
                return cfg.color(series)
            })
            .style("fill-opacity", cfg.opacityArea);

        series++;
        // var length = polygon._groups[0][0].getTotalLength();
        // long.push(length);
        // shapes.push(polygon._groups[0][0]);
    });
    series = 0;

    // var w_radar = new Array();
    // for (var i = 0; i < long.length; i++) {
    //     w_radar[i] = new Array();
    //     w_radar[i][shapes.length] = long[i];
    // }

    // for (var i = 0; i < long.length; i++) {
    //     for (var j = i + 1; j < shapes.length; j++) {
    //         var inter = Intersection.intersectPolygonPolygon(shapes[i].points, shapes[j].points);
    //         w_radar[i][j] = inter.points.length * 10
    //     }
    // }
    // console.log(w_radar)

    data.forEach(function (y, x) {
        var dataValues = [];
        content.selectAll(".nodes")
            .data(y).enter()
            .append("svg:circle")
            .attr("class", "radar-chart-serie" + series)
            .attr('r', cfg.radius)
            .attr("alt", function (j) {
                return Math.max(j.value, 0)
            })
            .attr("cx", function (j, i) {
                dataValues.push([
                    cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                    cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                ]);
                return cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total));
            })
            .attr("cy", function (j, i) {
                return cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total));
            })
            .attr("data-id", function (j) {
                return j.axis
            })
            .attr("fill", cfg.color(series)).style("fill-opacity", .9)
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .append("svg:title")
            .text(function (j) {
                return Math.max(j.value, 0)
            });

        series++;
    });
    
    tooltip = content.append('text')
        .style('opacity', 0)
        .style('font-family', 'sans-serif')
        .style('font-size', '13px');

    // let svg = d3.select('.vis-radarchart').append('svg')
    //     .attr('width',width + margin.left + margin.right)
    //     .attr('height',height + margin.top + margin.bottom)
    //     .append("g")
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    //Create the title for the legend
    // var text = g.append("text")
    //     .attr("class", "title")
    //     .attr('transform', 'translate(90,0)') 
    //     .attr("x", width - 70)
    //     .attr("y", 10)
    //     .attr("font-size", "12px")
    //     .attr("fill", "#404040")
    //     .text("What % of owners use a specific service in a week");
            
    //Initiate Legend	
    // var legend = g.append("g")
    //     .attr("class", "legend")
    //     .attr("height", 100)
    //     .attr("width", 200)
    //     .attr('transform', 'translate(90,20)') 
    //     ;
    //     //Create colour squares
    // legend.selectAll('rect')
    //     .data(LegendOptions)
    //     .enter()
    //     .append("rect")
    //     .attr("x", width - 65)
    //     .attr("y", function(d, i){ return i * 20;})
    //     .attr("width", 10)
    //     .attr("height", 10)
    //     .style("fill", function(d, i){ return cfg.color(i);})
    //     ;
    // //Create text next to squares
    // legend.selectAll('text')
    //     .data(LegendOptions)
    //     .enter()
    //     .append("text")
    //     .attr("x", width - 52)
    //     .attr("y", function(d, i){ return i * 20 + 9;})
    //     .attr("font-size", "11px")
    //     .attr("fill", "#737373")
    //     .text(function(d) { return d; })
    //     ;

    /** show legend **/
    // var colorSet = getSeries(data, encoding);
    var colorSet = [0,1,2];
    var legends = legend.selectAll("legend_color")
        .data(colorSet)
        .enter().append("g")
        .attr("class", "legend_color")
        .attr('transform', (d, i) =>`translate(${10}, 0)`);//i * 80 + (chartWidth - 80 * colorSet.length)/2
    // legends.append("circle")
    //     .attr("fill", d => color(d))
    //     .attr("r", 6)
    //     .attr("cy", -5);
    legends.append("rect")
        .attr("fill", d => color(d))
        .attr('x', -5)
        .attr('y', -10)
        .attr("width", '15px')
        .attr('height', '15px')
        .attr("rx", 1.5)
        .attr("ry", 1.5)
    
        let legend_nodes=legends.nodes();
        let before = legend_nodes[0];
        let current;
        let offset = 10;

    for(let i = 1; i< legend_nodes.length; i++){
    current = legend_nodes[i];
    // if(d3.select(before).select("text").node().getComputedTextLength()){
    //     offset += d3.select(before).select("text").node().getComputedTextLength();
    // }else{
    //     offset += getWidth(colorSet[i-1])
    // } 
    d3.select(current)
            .attr('transform', `translate(${i*30 + offset}, 0)`);
    before = current;
    }
    if(legend.node().getBBox().width){
    // legend.attr("transform", `translate(${(chartWidth - legend.node().getBBox().width)/2}, ${chartHeight + 60})`);
    legend.attr("transform", `translate(${(chartWidth - legend.node().getBBox().width)/2 -10}, ${chartHeight + 55})`);
    }else{
    offset += getWidth(colorSet[colorSet.length-1]);
    legend.attr("transform", `translate(${(chartWidth - offset - 30 * colorSet.length + 20)/2}, ${chartHeight + 60})`);
    }	

    function handleMouseOver(d, i) {  // Add interactivity
        console.log('1111')

        // Use D3 to select element, change color and size
        d3.select(this).style({
          fill: "orange",
        //   r: radius * 2
        });

        // Specify where to put label of text
        // svg.append("text").attr({
        //    id: "t" + d.x + "-" + d.y + "-" + i,  // Create an id for text so we can select it later for removing on mouseout
        //     x: function() { return xScale(d.x) - 30; },
        //     y: function() { return yScale(d.y) - 15; }
        // })
        // .text(function() {
        //   return [d.x, d.y];  // Value of the text
        // });
      }

  function handleMouseOut(d, i) {
        // Use D3 to select element, change color back to normal
        d3.select(this).style({
          fill: "black",
        //   r: radius
        });

        // Select text by id and then remove
        // d3.select("#t" + d.x + "-" + d.y + "-" + i).remove();  // Remove text location
      }

}

export default draw;