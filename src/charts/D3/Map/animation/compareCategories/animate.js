import * as d3 from 'd3';
import { getStackedData, getAggregatedRows, getCategories, getSeries} from '../../helper';
import _ from 'lodash';

const offset = 20; // To show whole chart

const draw = (animation, props) => {
    let a = document.createElement("div");
    if (!props.onCanvas) {
        d3.select('.vis-barchart > *').remove();
        a = '.vis-barchart';
    }

    const margin = { top: 10, right: 10, bottom: 40, left: 40 };
    const width = props.width - margin.left - margin.right - offset;
    const height = props.height - margin.top - margin.bottom - offset - 40;
    let svg = d3.select(a)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + 40)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Get Encoding
    const encoding = props.spec.encoding;
    if (_.isEmpty(encoding) || !('x' in encoding) || !('y' in encoding) || _.isEmpty(encoding.x) || _.isEmpty(encoding.y)) {
        svg.append("rect")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("fill", "pink");
        return svg;
    }
    let hasSeries = ('color' in encoding) && ('field' in encoding.color);

    // Process Data
    let data = props.data;
    let stackedData = [];
    if (hasSeries) {
        stackedData = getStackedData(data, encoding);
    } else {
        data = getAggregatedRows(data, encoding);
    }

    // X channel
    let x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(function (d) { return d[encoding.x.field]; }))
        .padding(0.2);

    // Y channel
    let y = d3.scaleLinear()
    if (hasSeries) {
        y.domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])]).nice().range([height, 0]);
    } else {
        y.domain([0, d3.max(data, function (d) { return d[encoding.y.field]; })]).range([height, 0]);
    }

    // Color channel
    let color = d3.scaleOrdinal(d3.schemeCategory10);

    // Bars
    let layer;
    if (hasSeries) {
        layer = svg.selectAll('layer')
            .data(stackedData)
            .enter()
            .append('g')
            .attr('class', 'layer')
            .style('fill', (d, i) => color(i))

        layer.selectAll('rect')
            .data(d => d)
            .enter()
            .append('rect')
            .attr('x', d => x(d.data.x))
            .attr('y', d => y(d[1]))
            .attr('height', d => y(d[0]) - y(d[1]))
            .attr('width', x.bandwidth() - 1)
            .style('stroke-width', '0')

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
            .attr("fill", color(0));
    }

    // Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
    svg.append("g").call(d3.axisLeft(y));

    // Animation
    let dataCategories = getCategories(props.data, encoding);
    let categories = Object.keys(dataCategories);
    let selectedCategory1 = animation.spec.category1 ? animation.spec.category1 : categories[0];
    let selectedCategory2 = animation.spec.category2 ? animation.spec.category2 : categories[1];
    if (animation.spec.effect === 'superposition') {
        // superposition animation
        if (hasSeries) {
            layer.selectAll('rect')
                .transition()
                .duration(animation.duration)
                .style("stroke", "yellow")
                .style("stroke-width", function (d, i) {
                    if (d.data.x.toString() === selectedCategory1 || d.data.x.toString() === selectedCategory2) {
                        return 5;
                    } else {
                        return 0;
                    }
                })
                .style("fill", function (d, i) {
                    if (d.data.x.toString() !== selectedCategory1 && d.data.x.toString() !== selectedCategory2) {
                        return "lightgray";
                    }
                });

        } else {
            svg.selectAll("rect")
                .transition()
                .duration(animation.duration)
                .style("stroke", "yellow")
                .style("stroke-width", function (d, i) {
                    if (d[encoding.x.field].toString() === selectedCategory1 || d[encoding.x.field].toString() === selectedCategory2) {
                        return 5;
                    } else {
                        return 0;
                    }
                })
                .attr("fill", function (d, i) {
                    if (d[encoding.x.field].toString() === selectedCategory1 || d[encoding.x.field].toString() === selectedCategory2) {
                        return color(0);
                    } else {
                        return "lightgray";
                    }
                });
        }
    } else {
        // difference animation
        if (hasSeries) {

            layer.selectAll('rect')
                .transition()
                .duration(animation.duration)
                .style("fill", function (d, i) {
                    if (d.data.x.toString() !== selectedCategory1 && d.data.x.toString() !== selectedCategory2) {
                        return "lightgray";
                    }
                });

            // draw red line
            let lastStack = stackedData[stackedData.length - 1];
            let h1 = y(lastStack.filter(d => d.data.x === selectedCategory1)[0][1]);
            let h2 = y(lastStack.filter(d => d.data.x === selectedCategory2)[0][1]);
            layer.append("line")
                .style("stroke", "red")
                .style("stroke-width", 2)
                .style("stroke-dasharray", ("5, 5"))
                .attr("x1", x(selectedCategory1) + x.bandwidth())
                .attr("y1", h1)
                .attr("x2", x(selectedCategory1) + x.bandwidth())
                .attr("y2", h1)
                .transition()
                .duration(animation.duration)
                .attr("x1", x(selectedCategory1) + x.bandwidth())
                .attr("y1", h1)
                .attr("x2", 0)
                .attr("y2", h1)

            layer.append("line")
                .style("stroke", "red")
                .style("stroke-width", 2)
                .style("stroke-dasharray", ("5, 5"))
                .attr("x1", x(selectedCategory2) + x.bandwidth())
                .attr("y1", h2)
                .attr("x2", x(selectedCategory2) + x.bandwidth())
                .attr("y2", h2)
                .transition()
                .duration(animation.duration)
                .attr("x1", x(selectedCategory2) + x.bandwidth())
                .attr("y1", h2)
                .attr("x2", 0)
                .attr("y2", h2)

        } else {
            svg.selectAll("rect")
                .transition()
                .duration(animation.duration)
                .attr("fill", function (d, i) {
                    if (d[encoding.x.field].toString() === selectedCategory1 || d[encoding.x.field].toString() === selectedCategory2) {
                        return color(0);
                    } else {
                        return "lightgray";
                    }
                });

            // draw red line
            let h1 = y(data.filter(d => d[encoding.x.field].toString() === selectedCategory1)[0][encoding.y.field]);
            let h2 = y(data.filter(d => d[encoding.x.field].toString() === selectedCategory2)[0][encoding.y.field]);
            svg.append("line")
                .style("stroke", "red")
                .style("stroke-width", 2)
                .style("stroke-dasharray", ("5, 5"))
                .attr("x1", x(selectedCategory1) + x.bandwidth())
                .attr("y1", h1)
                .attr("x2", x(selectedCategory1) + x.bandwidth())
                .attr("y2", h1)
                .transition()
                .duration(animation.duration)
                .attr("x1", x(selectedCategory1) + x.bandwidth())
                .attr("y1", h1)
                .attr("x2", 0)
                .attr("y2", h1)

            svg.append("line")
                .style("stroke", "red")
                .style("stroke-width", 2)
                .style("stroke-dasharray", ("5, 5"))
                .attr("x1", x(selectedCategory2) + x.bandwidth())
                .attr("y1", h2)
                .attr("x2", x(selectedCategory2) + x.bandwidth())
                .attr("y2", h2)
                .transition()
                .duration(animation.duration)
                .attr("x1", x(selectedCategory2) + x.bandwidth())
                .attr("y1", h2)
                .attr("x2", 0)
                .attr("y2", h2)
        }
    }
    let dataSeries = [];
    let series = [];
    if (hasSeries) {
        dataSeries = getSeries(data, encoding);
        series = Object.keys(dataSeries);
    }
    // legend
    let colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    const legend = svg.append("g")
        .attr("transform", `translate(0, ${height + 60})`);
    var legends = legend.selectAll("legend_color")
        .data(series)
        .enter()
        .append("g")
        .attr("class", "legend_color")
        .attr('transform', (d, i) => `translate(${i * (80 + 10) + (width - (series.length * 80 + (series.length - 1) * 10)) / 2}, 0)`);
    legends.append("rect")
        .attr("fill", d => colorScale(d))
        .attr('y', -9)
        .attr("width", '10px')
        .attr('height', '10px')
        .attr("rx", 1.5)
        .attr("ry", 1.5)
    // .attr("cy", -5);
    legends.append("text")
        .attr("fill", 'black')
        .attr("x", 15)
        .text(d => d);
    return svg;
}

export default draw;