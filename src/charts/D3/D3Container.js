import React, { Component } from 'react';
import ChartType from '@/constants/ChartType';
import BarChart from './BarChart';
import LineChart from './LineChart';
import AreaChart from './AreaChart';
import PieChart from './PieChart';
import ProportionChart from './ProportionChart';
import TreeMap from './TreeMap';
import ScatterPlot from './ScatterPlot';
import Map from './Map';
import RadarChart from './RadarChart';
import HeatMap from './HeatMap';

export default class D3Container extends Component {
    chooseChart() {
        console.log('renderd3',this.props.type)
        switch (this.props.type) {
            case ChartType.BARCHART:
                return  <BarChart {...this.props}/>

            case ChartType.LINECHART:
                return  <LineChart {...this.props}/>

            case ChartType.AREACHART:
                return  <AreaChart {...this.props}/>

            case ChartType.PIECHART:
                return  <PieChart {...this.props}/>

            case ChartType.PROPORTIONCHART:
                return  <ProportionChart {...this.props}/>

            case ChartType.TREEMAP:
                return  <TreeMap {...this.props}/>

            case ChartType.SCATTERPLOT:
                return  <ScatterPlot {...this.props}/>
            case ChartType.MAP:
                return  <Map {...this.props}/> 
            case ChartType.RADARCHART:
                return  <RadarChart {...this.props}/> 
            case ChartType.HEATMAP:
                return  <HeatMap {...this.props}/> 
            default:
                return  null
        }
    }

    render() {
        return this.chooseChart()
    }
}
