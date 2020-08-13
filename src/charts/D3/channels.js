import ChartType from '@/constants/ChartType';
import barchartChannels from './BarChart/channels';
import linechartChannels from './LineChart/channels';
import areachartChannels from './AreaChart/channels';
import piechartChannels from './PieChart/channels';
import proportionChannels from './ProportionChart/channels';
import treemapChannels from './TreeMap/channels';
import scatterplotChannels from './ScatterPlot/channels';
import mapChannels from './Map/channels';
import radarchartChannels from './RadarChart/channels';
import heatmapChannels from './HeatMap/channels';

export default function d3Channels(chartType) {
    console.log('chartType',chartType)

    switch (chartType) {
        case ChartType.BARCHART:
            console.log('barchartChannels', barchartChannels)
            return barchartChannels;

        case ChartType.LINECHART:
            return linechartChannels;

        case ChartType.AREACHART:
            return areachartChannels;

        case ChartType.PIECHART:
            return piechartChannels;

        case ChartType.PROPORTIONCHART:
            return proportionChannels;

        case ChartType.TREEMAP:
            return treemapChannels;

        case ChartType.SCATTERPLOT:
            return scatterplotChannels;
        
        case ChartType.MAP:
            return mapChannels;
        
        case ChartType.RADARCHART:
            return radarchartChannels;
        case ChartType.HEATMAP:
            return heatmapChannels;
        default:
            return {}
    }
}