import MyURL from '@/constants/MyURL';
import ChartType from '@/constants/ChartType';

export const vegaliteCharts = [
    {
        chart: ChartType.AREACHART,
        // src: MyURL.OSS+"/charts/areachart.png"
    },
    {
        chart: ChartType.BARCHART,
        // src: MyURL.OSS+"/charts/barchart.png"
    },
    {
        chart: ChartType.HISTOGRAM,
        // src: MyURL.OSS+"/charts/histogram.png"
    },
    {
        chart: ChartType.LINECHART,
        // src: MyURL.OSS+"/charts/linechart.png"
    },
    {
        chart: ChartType.SCATTERPLOT,
        // src: MyURL.OSS+"/charts/scatterplot.png"
    },
];

export const d3Charts = [
    {
        name:"Bar",
        chart: ChartType.BARCHART,
        // src: MyURL.OSS+"/charts/barchart.png"
    },
    {
        name:"Pie",
        chart: ChartType.PIECHART,
        // src: MyURL.OSS+"/charts/piechart.png"
    },
    {
        name:"Line",
        chart: ChartType.LINECHART,
        // src: MyURL.OSS+"/charts/linechart.png"
    },
    {
        name:"Area",
        chart: ChartType.AREACHART,
        // src: MyURL.OSS+"/charts/areachart.png"
    },     
    {
        name:"Scatterplot",
        chart: ChartType.SCATTERPLOT,
        // src: MyURL.OSS+"/charts/scatterplot.png"
    },
    {
        name:"RadarChart",
        chart: ChartType.RADARCHART,
        // src: MyURL.OSS+"/charts/scatterplot.png"
    },
    {
        name:"HeatMap",
        chart: ChartType.HEATMAP,
        // src: MyURL.OSS+"/charts/proportionchart.png"
    },
    {
        name:"TreeMap",
        chart: ChartType.TREEMAP,
        // src: MyURL.OSS+"/charts/proportionchart.png"
    },
    {
        name:"Map",
        chart: ChartType.MAP,
        // src: MyURL.OSS+"/charts/map.png" //map.png
    }
]