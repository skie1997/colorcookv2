import * as d3 from 'd3';
import './style.css';
import _ from 'lodash';

const draw = (props) => {
    let a = document.createElement("div");
    if (!props.onCanvas) {
        d3.select('.vis-heatmap > *').remove();
        a = '.vis-heatmap';
    }
    const data = props.data;
    const margin = {top: 10, right: 10, bottom: 30, left: 50};
    // const width = props.width - margin.left - margin.right;
    const height = props.height - margin.top - margin.bottom;
    const width = height;
    let svg = d3.select(a).append('svg')
            .attr('width',width + margin.left + margin.right)
            .attr('height',height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
        svg.append("rect")
            .attr("height", props.width-20)
            .attr("width", props.height-20)
            .attr("x", 10)
            .attr("y", 10)
            .attr("cx", 50)
            .attr("cy", 50)
            .attr("stroke","#eee")
            .attr("stroke-width",5)
            // .style("border","2px solid #4674b2")
            // .style('border-radius','4px')
            .attr("fill","white")
            .attr("transform", "translate(-" + margin.left + ",-" + margin.top + ")");
    
    const encoding = props.spec.encoding;
    if (_.isEmpty(encoding) || !('x' in encoding) || !('y' in encoding) || _.isEmpty(encoding.x) || _.isEmpty(encoding.y.field) ) {
        svg.append("rect")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("fill", "steelblue"); 
        return svg;
    }
    // Color channel
    const style = props.spec.style;
    const colorset = style.colorset;
   // const color = colorset;

    
    const chartWidth = width,
        chartHeight = height - 10;//plus legend height

    var myGroups = d3.map(data, function(d){return d[encoding.x.field];}).keys();
    var myVars = d3.map(data, function(d){return d[encoding.y.field];}).keys();

    // Build X scales and axis:
    var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(myGroups)
        .padding(0.05);
    svg.append("g")
        .style("font-size", 10)
        // .style('font-family', 'Arial')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(0))
        .select(".domain").remove()

// Build Y scales and axis:
    var y = d3.scaleBand()
        .range([ height, 0 ])
        .domain(myVars)
        .padding(0.05);
    svg.append("g")
        .style("font-size", 10)
        // .style('font-family', 'Arial')
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain").remove()

    var myColor = d3.scaleLinear()
        // .domain([1,50,100])
        .domain([1,100])
        .range(colorset);

    // add the squares
  svg.selectAll()
    .data(data, function(d) {return d[encoding.x.field]+':'+d[encoding.y.field];})
    .enter()
    .append("rect")
        .attr("x", function(d) { return x(d[encoding.x.field]) })
        .attr("y", function(d) { return y(d[encoding.y.field]) })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("width", x.bandwidth() )
        .attr("height", y.bandwidth() )
        .attr("value", function(d) { return d[encoding.color.field]} )
        .style("fill", function(d) { return myColor(d[encoding.color.field])} )
        .style("stroke-width", 4)
        .style("stroke", "none")
        .style("opacity", 1)

    return svg;

      
}

export default draw;