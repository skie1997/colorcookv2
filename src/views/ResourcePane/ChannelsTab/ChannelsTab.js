import React, { Component } from 'react';
import { Button, Divider } from 'antd';
import './channelstab.css';
import d3Channels from '@/charts/D3/channels';
import { getCategories, getAggregatedRows, getWidth } from '@/charts/D3/PieChart/helper';
import Encoding from '@/components/ChartEditor/MappingPanel/Encoding';
import * as d3 from 'd3';
import _ from "lodash";
import HttpUtil from '@/HttpUtil';
import ApiUtil from '@/ApiUtil';
import{ getStackedData as  getStackedDataArea, getSeries as getSeriesArea} from '@/charts/D3/AreaChart/helper'
import{ getStackedData as  getStackedDataBar, getSeries as getSeriesBar} from '@/charts/D3/BarChart/helper'
import{ getStackedData as  getStackedDataLine, getSeries as getSeriesLine} from '@/charts/D3/LineChart/helper'
import{ getAggregatedRows as  getAggregatedRowsPie, getCategories as getCategoriesPie} from '@/charts/D3/PieChart/helper'
import{ getAggregatedRows as  getAggregatedRowsScatter, getSeries as getSeriesScatter} from '@/charts/D3/ScatterPlot/helper'
import{ getStackedData as  getStackedDataTree, getSeries as getSeriesTree} from '@/charts/D3/TreeMap/helper'
import{ getStackedData as  getStackedDataRadar, getSeries as getSeriesRadar} from '@/charts/D3/RadarChart/helper'
import { chartMode } from '../../../selectors/canvas';

export default class ChannelsTab extends Component {
    static defaultProps = {
        cols: { lg: 12, md: 10, sm: 8, xs: 4, xxs: 2 },
        rowHeight: 30,
      };

    constructor(props) {
        super(props);
        this.handleChartOk = this.handleChartOk.bind(this)
        this.state = {
            // layouts: this.getFromLS("layouts") || {},
            layouts: {
              cols: { lg: 12, md: 10, sm: 8, xs: 4, xxs: 2 },
              rowHeight: 40,
              title: 'Start to make a new dashboard!'
            },
            widgets: []
        }

    }
    //data-mapping
    handleChartOk = () => {

        //生成模式
        if(this.props.chartMode){
            //layout中增加chart
            
            //计算weights
            const size = {
                x: (this.props.widgets.length * 2) % (this.state.cols || 8),
                y: Infinity, // puts it at the bottom
                w: 2,
                h: 1,
                i: new Date().getTime().toString(),
            };
            const type = {
                type: this.props.chartMode
            };
            const dataIndex = {
                dataIndex: this.props.dataIndex
            }
            const category = {
                category: 'D3'
            }
            const spec = {
                spec: this.props.generateSpec
            }
            const legendChangedColor = {
                legendChangedColor: {'leftPoint':'','rightPoint':''}
            }


            //下面开始更新colormap
            
            const rowData = this.props.dataList[this.props.dataIndex];
    
            //计算fields和data
            let fieldsList = [];
            let weightsList = []; 
            let mapField = []; //增设heatmap/map标记

            
            
            switch(this.props.chartMode){
    
                case 'area chart':      
                    let fieldsArea = getSeriesArea(rowData, spec.spec.encoding);
                    fieldsList = Object.keys(fieldsArea);

                    //初始化weigths二维数组，比如：3个fields，则创建3*4的零数组（因为要计算和背景的weights）
                    weightsList = [];
                    for( let i  = 0 ; i < fieldsList.length; i++ ){
                        let item = [];
                        for( let j  = 0 ; j <= fieldsList.length; j++ ){
                            item.push(0);
                        }
                        weightsList.push(item)
                    }
    
                    
                    for( let i  = 0 ; i < weightsList.length; i++ ){
                        if(i==0){
                            weightsList[i][weightsList.length] += size.w + size.h/fieldsList.length;
                            weightsList[i][i+2] +=size.w; //近似为宽度
                        }else if(i == weightsList.length-1){
                            weightsList[i][0] += size.w + size.h/fieldsList.length;
                            weightsList[i][i] += size.w;
                        }else{
                            weightsList[i][0] += size.h/fieldsList.length;
                            weightsList[i][i] += size.w;
                            weightsList[i][i+2] += size.w;
                        }
                    }


                    break;
                
                case 'bar chart':
                    let dataBar = getStackedDataBar(rowData, spec.spec.encoding)
                    fieldsList = Object.keys(getSeriesBar(rowData, spec.spec.encoding))

                    //初始化weigths二维数组，比如：3个fields，则创建3*4的零数组（因为要计算和背景的weights）
                    weightsList = [];
                    for( let i  = 0 ; i < fieldsList.length; i++ ){
                        let item = [];
                        for( let j  = 0 ; j <= fieldsList.length; j++ ){
                            item.push(0);
                        }
                        weightsList.push(item)
                    }

                    //判断是否为最底部的bar
                    let flagListBott = new Array(dataBar[0].length);
                    for( let i  = 0 ; i < dataBar[0].length; i++ ){
                        flagListBott[i] = false;
                    }

                    let flagListTop = new Array(dataBar[0].length);
                    for( let i  = 0 ; i < dataBar[0].length; i++ ){
                        flagListTop[i] = false;
                    }

                    console.log('dataBar[0].length',dataBar[0].length)

                    //bar最高点代表的值
                    let maxBar = 0;
                    for(let i = 0; i < dataBar[dataBar.length-1].length; i++){
                        if(dataBar[dataBar.length-1][i][1] > maxBar){
                            maxBar = dataBar[dataBar.length-1][i][1];
                        }
                    }
                    console.log('barWeight',dataBar)

                    for( let i  = 0 ; i < dataBar.length; i++ ){
                        for(let j = 0; j< dataBar[i].length; j++){
                            if((dataBar[i][j][1]-dataBar[i][j][0]) > 0 ){
                                console.log('barJ',j)
                                //先计算两边与背景色边界
                                weightsList[i][0] +=  2 * (dataBar[i][j][1]-dataBar[i][j][0]) / maxBar * size.h;
                                //再计算下边界
                                if(flagListBott[j] == false){
                                    weightsList[i][0] += size.w / dataBar.length;
                                    
                                }else{
                                    weightsList[i][i] += size.w / dataBar.length;
                                }
                                flagListBott[j] = true;

                                
                            }
                        }

                    }
                    for( let i  = dataBar.length - 1 ; i >= 0; i-- ){
                        for(let j = 0; j< dataBar[i].length; j++){
                            if((dataBar[i][j][1]-dataBar[i][j][0]) > 0 ){
                            
                                //计算上边界
                                if(flagListTop[j] == false){
                                    weightsList[i][0] += size.w / dataBar.length;
                                    
                                }else{
                                    weightsList[i][i+2] += size.w / dataBar.length;
                                }
                                flagListTop[j] = true;    
                            }
                        }

                    }

                    break;
                case 'line chart':
                    let dataSeriesBar = getSeriesBar(rowData, spec.spec.encoding);
                    fieldsList = Object.keys(dataSeriesBar);
                    // console.log('fieldsList_bar',fieldsList);
                    
                    //初始化weigths二维数组，比如：3个fields，则创建3*4的零数组（因为要计算和背景的weights）
                    weightsList = [];
                    for( let i  = 0 ; i < fieldsList.length; i++ ){
                        let item = [];
                        for( let j  = 0 ; j <= fieldsList.length; j++ ){
                            item.push(0);
                        }
                        weightsList.push(item)
                    }
                    
                    for( let i  = 0 ; i < weightsList.length; i++ ){
                        weightsList[i][0] += size.w;
                    }
                    break;
                case 'pie chart':
                    let dataCategories = getCategoriesPie(rowData, spec.spec.encoding);
                    fieldsList = Object.keys(dataCategories);
                    
                    //初始化weigths二维数组，比如：3个fields，则创建3*4的零数组（因为要计算和背景的weights）
                    weightsList = [];
                    for( let i  = 0 ; i < fieldsList.length; i++ ){
                        let item = [];
                        for( let j  = 0 ; j <= fieldsList.length; j++ ){
                            item.push(0);
                        }
                        weightsList.push(item)
                    }
                    
                    let dataPie = getAggregatedRowsPie(rowData, spec.spec.encoding);

                    let sumPie = 0;
                    let rPie = parseInt(`${size.w > size.h? size.h * 3/2-20/800:size.w * 6/2-20/400}`);
                
                    for(let i = 0; i < dataPie.length; i++){
                        sumPie += parseFloat(dataPie[i][spec.spec.encoding.size.field]);
                    }
                    console.log('rPie',rPie)
                    for( let i  = 0 ; i < fieldsList.length; i++ ){
                        //计算与背景的边界
                        weightsList[i][0] += dataPie[i][spec.spec.encoding.size.field] / sumPie * 2 * Math.PI * rPie;
                        
                        if(i<(weightsList.length - 1)){
                            console.log('weightsList[i][i]11',weightsList[i][i])
                            weightsList[i][i] += rPie;
                            console.log('weightsList[i][i]',weightsList[i][i])
                        }else{
                            weightsList[i][1] += rPie;
                        }
                    }

    
                    break;
                case 'radar chart':
                    let dataRadar = getStackedDataRadar(rowData, spec.spec.encoding)
                    
                    //后面会对其进行排序以分辨同心圆内外顺序
                    fieldsList = Object.keys(getSeriesRadar(rowData, spec.spec.encoding))
            

                    //记录radar每个同心圆的总value值
                    let dataValueListRadar = new Array(fieldsList.length);
                    for( let i  = 0 ; i < dataValueListRadar.length; i++ ){
                        dataValueListRadar[i] = 0;
                    }

                    //初始化weigths二维数组，比如：3个fields，则创建3*4的零数组（因为要计算和背景的weights）
                    weightsList = [];
                    for( let i  = 0 ; i < fieldsList.length; i++ ){
                        let item = [];
                        for( let j  = 0 ; j <= fieldsList.length; j++ ){
                            item.push(0);
                        }
                        weightsList.push(item)
                    }

                    for(let i = 0; i < rowData.length; i++){
                        for(let j = 0; j < fieldsList.length; j++){
                        //    console.log('rowData[spec.spec.encoding.x.field]',rowData[i][spec.spec.encoding.color.field])
                        if(rowData[i][spec.spec.encoding.color.field] == fieldsList[j]){
                            //    console.log('rowData[spec.spec.encoding.x.field]',rowData[i][spec.spec.encoding.size.field])
                            dataValueListRadar[j] += rowData[i][spec.spec.encoding.y.field];
                        }
                        }
                    }

                    //排序索引，即圆由小到大排列
                    let sortIndex=  Array.from(Array(dataValueListRadar.length).keys())
                                        .sort((a, b) => dataValueListRadar[a] < dataValueListRadar[b] ? -1 : (dataValueListRadar[b] < dataValueListRadar[a]) | 0)
                    
                    let fieldsListTemp = [];
                    let dataValueListRadarTemp = [];
                    sortIndex.forEach((v,a)=>{
                        fieldsListTemp.push(fieldsList[v]);
                        dataValueListRadarTemp.push(dataValueListRadar[v])
                    })

                    fieldsList = fieldsListTemp;
                    dataValueListRadar = dataValueListRadarTemp;
                    let widthRadar = size.w * 800/6;
                    let heightRadar = size.h * 400/3;
                    for(let i = 0; i< dataValueListRadar.length; i++){
                        if(i == (dataValueListRadar.length-1)){
                            weightsList[i][0] = parseInt(`${widthRadar<heightRadar? widthRadar-40:heightRadar-40}`) * Math.PI / 800 * 6
                        }else{
                            weightsList[i][i+2] = dataValueListRadar[i] / dataValueListRadar[dataValueListRadar.length-1] * parseInt(`${widthRadar<heightRadar? widthRadar-40:heightRadar-40}`) * Math.PI / 800 * 6
                        }
                    }
                    break;
                case 'scatterplot':
                    let dataSeriesScatter = getSeriesScatter(rowData, spec.spec.encoding);
                    // fieldsList = Object.keys(dataSeriesScatter);
                    fieldsList = dataSeriesScatter;

                    //初始化weigths二维数组，比如：3个fields，则创建3*4的零数组（因为要计算和背景的weights）
                    weightsList = [];
                    for( let i  = 0 ; i < fieldsList.length; i++ ){
                        let item = [];
                        for( let j  = 0 ; j <= fieldsList.length; j++ ){
                            item.push(0);
                        }
                        weightsList.push(item)
                    }
        

                    //  console.log('dataSeriesScatter',dataSeriesScatter)
                    //  console.log('fieldsList',fieldsList)
                    //  console.log('rowDataSca',rowData)
                    //  console.log('rowDataSca',rowData.map(d=>d[spec.spec.encoding.color.field]))
                    
                    for(let i = 0; i < rowData.length; i++){
                        for(let j = 0; j < fieldsList.length; j++){
                            // console.log('rowData[spec.spec.encoding.x.field]',rowData[i][spec.spec.encoding.color.field])
                            if(rowData[i][spec.spec.encoding.color.field] == fieldsList[j]){
                                // console.log('rowData[spec.spec.encoding.x.field]',rowData[i][spec.spec.encoding.color.field])
                                weightsList[j][0] += 20 * Math.PI / 150;
                            }
                        }
                    }

    
                    break;

                case 'treemap':
                    let dataSeriesTree = getSeriesTree(rowData, spec.spec.encoding)
                    fieldsList = Object.keys(dataSeriesTree)
                    // console.log('fidlist-tree',dataSeriesTree)
                    
                    //记录treemap每个区域的总value值
                    let dataValueList = new Array(fieldsList.length);
                    for( let i  = 0 ; i < dataValueList.length; i++ ){
                        dataValueList[i] = 0;
                    }
                
                    //初始化weigths二维数组，比如：3个fields，则创建3*4的零数组（因为要计算和背景的weights）
                    weightsList = [];
                    for( let i  = 0 ; i < fieldsList.length; i++ ){
                        let item = [];
                        for( let j  = 0 ; j <= fieldsList.length; j++ ){
                            item.push(0);
                        }
                        weightsList.push(item)
                    }
                    

                    for(let i = 0; i < rowData.length; i++){
                        for(let j = 0; j < fieldsList.length; j++){
                        //    console.log('rowData[spec.spec.encoding.x.field]',rowData[i][spec.spec.encoding.color.field])
                        if(rowData[i][spec.spec.encoding.color.field] == fieldsList[j]){
                            //    console.log('rowData[spec.spec.encoding.x.field]',rowData[i][spec.spec.encoding.size.field])
                            dataValueList[j] += rowData[i][spec.spec.encoding.size.field];
                        }
                        }
                    }
                let allValue = d3.sum(dataValueList)
            
                for( let i  = 0 ; i < dataValueList.length; i++ ){
                    // for(let j = 0; j< dataBar[i].length; j++){
                        if(dataValueList[i] > 0 ){
                            //先计算上下与背景色边界
                            weightsList[i][0] +=  2 * dataValueList[i] / allValue;
                            
                            //再计算左边界
                            if(i == 0 || dataValueList[i-1] == 0){
                                weightsList[i][0] += size.h;
                            }else{
                                weightsList[i][i] += size.h;
                            }

                            //再计算右边界
                            if(i == (dataValueList.length - 1) || dataValueList[i] == 0){
                                weightsList[i][0] += size.h;
                            }else{
                                weightsList[i][i+2] += size.h;
                            }   
                        }
                    } 

                    break;

                case 'heat map':
                    mapField.push(spec.spec.encoding.color.field);
                    break;

                case 'map':
                    mapField.push(spec.spec.encoding.color.field);
                    break;  
                }

                let colormap = this.props.colormap;
                
                colormap.push({
                    fieldsList: fieldsList,
                    weightsList: weightsList,
                    mapField: mapField,
                    charttype: this.props.chartMode
                });
                // var content = JSON.stringify(colormap);
                // var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
                // const href = URL.createObjectURL(blob);
                // const link = document.createElement('a');
                // link.href = href;
                // link.download = 'colormap' + ".json";
                // document.body.appendChild(link);
                // link.click();
                // document.body.removeChild(link);

                let data = []

                this.props.changeColormap(colormap);
               
                let colorData = {'colormap': this.props.colormap, 'backgroundcolor': this.props.backgroundColor, 'currentColorset': this.props.currentColorset}
                // console.log('colorData',colorData)
                this.props.changeLoading(true);

                HttpUtil.post(ApiUtil.API_COLOR_COLORATION, colorData)
                    .then(re=>{
                        
                    
                        data = re.data
                 
                        this.props.changeGlobalColorpair(data)
                        
                    })
                   
                    .catch(error=>console.log(error.message))
                    .then(re=>{
                        console.log('addChart')
                        let newWidgets = _.cloneDeep(this.props.widgets)
                        this.props.addChart(newWidgets.concat({...size,...type,...dataIndex,...category,...spec, ...legendChangedColor}));                  
                        
                    })
                    .catch(error=>{
                        
                        console.log(error.message);
                    })
                    .then(re=>{
                        
  
                        
                        //改变dataIndex
                        this.props.switchData(this.props.widgets[this.props.widgets.length-1].dataIndex)

                        // //改变selectChartIndex
                        // this.props.selectChart(i);

                        

                        //改变edit mode
                        this.props.changeEditMode(this.props.widgets.length-1);

                        //改变edit channels
                        let channels = d3Channels(this.props.widgets[this.props.widgets.length-1].type);
                        
                        //注意这里是遍历字典 要按key查找
                        let channelsName = Object.keys(channels);
                        
                        for(let i = 0; i< channelsName.length; i++){
                            channels[channelsName[i]]['isEncoding'] = true;
                        }


        
                        this.props.changeEditChannels(channels)
                        // console.log('this.props.changeEditChannels', d3Channels(this.props.widgets[this.props.widgets.length-1].type))
                        
                        this.props.changeEditSpec(this.props.widgets[this.props.widgets.length-1].spec)

                        //关闭chart mode
                        this.props.changeChartMode(false);

                        this.props.changeLoading(false);
                        
                        
                    });

                    // 

            
            

        }

        //编辑模式
        else{
            
            //避坑大法 - 解决改变状态却不刷新页面问题
            //https://blog.csdn.net/qq_40259641/article/details/105275819
            let widgets = [...this.props.widgets];


            
            //更新colormap,重新计算边界
            const rowData = this.props.dataList[widgets[this.props.editMode].dataIndex];
            // const spec = widgets[this.props.selectChartIndex].spec;
            const spec = this.props.editSpec;
            console.log('spec-tab',this.props.editSpec)
            const size = {w:widgets[this.props.editMode].w, h: widgets[this.props.editMode].h};

            //计算fields和data
            let fieldsList = [];
            let weightsList = []; 
            let mapField = []; //增设heatmap/map标记
            

            switch(widgets[this.props.editMode].type){
                case 'area chart':      
                        let fieldsArea = getSeriesArea(rowData, spec.encoding);
                        fieldsList = Object.keys(fieldsArea);

                        //初始化weigths二维数组，比如：3个fields，则创建3*4的零数组（因为要计算和背景的weights）
                        weightsList = [];
                        for( let i  = 0 ; i < fieldsList.length; i++ ){
                            let item = [];
                            for( let j  = 0 ; j <= fieldsList.length; j++ ){
                                item.push(0);
                            }
                            weightsList.push(item)
                        }
        
                        
                        for( let i  = 0 ; i < weightsList.length; i++ ){
                            if(i==0){
                                weightsList[i][0] += size.w + size.h/fieldsList.length;
                                weightsList[i][i+2] +=size.w; //近似为宽度
                            }else if(i == weightsList.length-1){
                                weightsList[i][0] += size.w + size.h/fieldsList.length;
                                weightsList[i][i] += size.w;
                            }else{
                                weightsList[i][0] += size.h/fieldsList.length;
                                weightsList[i][i] += size.w;
                                weightsList[i][i+2] += size.w;
                            }
                        }


                        break;
                    
                    case 'bar chart':
                        let dataBar = getStackedDataBar(rowData, spec.encoding)
                        fieldsList = Object.keys(getSeriesBar(rowData, spec.encoding))
                        console.log('bar-fieldsList', fieldsList)

                        //初始化weigths二维数组，比如：3个fields，则创建3*4的零数组（因为要计算和背景的weights）
                        weightsList = [];
                        for( let i  = 0 ; i < fieldsList.length; i++ ){
                            let item = [];
                            for( let j  = 0 ; j <= fieldsList.length; j++ ){
                                item.push(0);
                            }
                            weightsList.push(item)
                        }

                        //判断是否为最底部的bar
                        let flagListBott = new Array(dataBar[0].length);
                        for( let i  = 0 ; i < dataBar[0].length; i++ ){
                            flagListBott[i] = false;
                        }

                        let flagListTop = new Array(dataBar[0].length);
                        for( let i  = 0 ; i < dataBar[0].length; i++ ){
                            flagListTop[i] = false;
                        }

                        console.log('dataBar[0].length',dataBar[0].length)

                        //bar最高点代表的值
                        let maxBar = 0;
                        for(let i = 0; i < dataBar[dataBar.length-1].length; i++){
                            if(dataBar[dataBar.length-1][i][1] > maxBar){
                                maxBar = dataBar[dataBar.length-1][i][1];
                            }
                        }
                        console.log('barWeight',dataBar)

                        for( let i  = 0 ; i < dataBar.length; i++ ){
                            for(let j = 0; j< dataBar[i].length; j++){
                                if((dataBar[i][j][1]-dataBar[i][j][0]) > 0 ){
                                    console.log('barJ',j)
                                    //先计算两边与背景色边界
                                    weightsList[i][0] +=  2 * (dataBar[i][j][1]-dataBar[i][j][0]) / maxBar * size.h;
                                    //再计算下边界
                                    if(flagListBott[j] == false){
                                        weightsList[i][0] += size.w / dataBar.length;
                                        
                                    }else{
                                        weightsList[i][i] += size.w / dataBar.length;
                                    }
                                    flagListBott[j] = true;

                                    
                                }
                            }

                        }
                        for( let i  = dataBar.length - 1 ; i >= 0; i-- ){
                            for(let j = 0; j< dataBar[i].length; j++){
                                if((dataBar[i][j][1]-dataBar[i][j][0]) > 0 ){
                                
                                    //计算上边界
                                    if(flagListTop[j] == false){
                                        weightsList[i][0] += size.w / dataBar.length;
                                        
                                    }else{
                                        weightsList[i][i+2] += size.w / dataBar.length;
                                    }
                                    flagListTop[j] = true;    
                                }
                            }

                        }

                        break;
                    case 'line chart':
                        let dataSeriesBar = getSeriesBar(rowData, spec.encoding);
                        fieldsList = Object.keys(dataSeriesBar);
                        // console.log('fieldsList_bar',fieldsList);
                        
                        //初始化weigths二维数组，比如：3个fields，则创建3*4的零数组（因为要计算和背景的weights）
                        weightsList = [];
                        for( let i  = 0 ; i < fieldsList.length; i++ ){
                            let item = [];
                            for( let j  = 0 ; j <= fieldsList.length; j++ ){
                                item.push(0);
                            }
                            weightsList.push(item)
                        }
                        
                        for( let i  = 0 ; i < weightsList.length; i++ ){
                            weightsList[i][0] += size.w;
                        }
                        break;
                    case 'pie chart':
                        console.log('pie-channels')
                        let dataCategories = getCategoriesPie(rowData, spec.encoding);
                        fieldsList = Object.keys(dataCategories);
                        
                        //初始化weigths二维数组，比如：3个fields，则创建3*4的零数组（因为要计算和背景的weights）
                        weightsList = [];
                        for( let i  = 0 ; i < fieldsList.length; i++ ){
                            let item = [];
                            for( let j  = 0 ; j <= fieldsList.length; j++ ){
                                item.push(0);
                            }
                            weightsList.push(item)
                        }
                        
                        let dataPie = getAggregatedRowsPie(rowData, spec.encoding);
    
                        let sumPie = 0;
                        let rPie = parseInt(`${size.w > size.h? size.h * 3/2-20/800:size.w * 6/2-20/400}`);
                    
                        for(let i = 0; i < dataPie.length; i++){
                            sumPie += parseFloat(dataPie[i][spec.encoding.size.field]) ;
                        }
                        console.log('sumPie',sumPie)
                        console.log('rPie',rPie)
                        for( let i  = 0 ; i < fieldsList.length; i++ ){
                            //计算与背景的边界
                            weightsList[i][0] += dataPie[i][spec.encoding.size.field] / sumPie * 2 * Math.PI * rPie;
                            
                            if(i<(weightsList.length - 1)){
                                console.log('weightsList[i][i]11',weightsList[i][i])
                                weightsList[i][i] += rPie;
                                console.log('weightsList[i][i]',weightsList[i][i])
                            }else{
                                weightsList[i][1] += rPie;
                            }
                        }

        
                        break;
                    case 'radar chart':
                        let dataRadar = getStackedDataRadar(rowData, spec.encoding)
                        
                        //后面会对其进行排序以分辨同心圆内外顺序
                        fieldsList = Object.keys(getSeriesRadar(rowData, spec.encoding))
                

                        //记录radar每个同心圆的总value值
                        let dataValueListRadar = new Array(fieldsList.length);
                        for( let i  = 0 ; i < dataValueListRadar.length; i++ ){
                            dataValueListRadar[i] = 0;
                        }

                        //初始化weigths二维数组，比如：3个fields，则创建3*4的零数组（因为要计算和背景的weights）
                        weightsList = [];
                        for( let i  = 0 ; i < fieldsList.length; i++ ){
                            let item = [];
                            for( let j  = 0 ; j <= fieldsList.length; j++ ){
                                item.push(0);
                            }
                            weightsList.push(item)
                        }

                        for(let i = 0; i < rowData.length; i++){
                            for(let j = 0; j < fieldsList.length; j++){
                            //    console.log('rowData[spec.spec.encoding.x.field]',rowData[i][spec.spec.encoding.color.field])
                            if(rowData[i][spec.encoding.color.field] == fieldsList[j]){
                                //    console.log('rowData[spec.spec.encoding.x.field]',rowData[i][spec.spec.encoding.size.field])
                                dataValueListRadar[j] += rowData[i][spec.encoding.y.field];
                            }
                            }
                        }

                        //排序索引，即圆由小到大排列
                        let sortIndex=  Array.from(Array(dataValueListRadar.length).keys())
                                            .sort((a, b) => dataValueListRadar[a] < dataValueListRadar[b] ? -1 : (dataValueListRadar[b] < dataValueListRadar[a]) | 0)
                        
                        let fieldsListTemp = [];
                        let dataValueListRadarTemp = [];
                        sortIndex.forEach((v,a)=>{
                            fieldsListTemp.push(fieldsList[v]);
                            dataValueListRadarTemp.push(dataValueListRadar[v])
                        })

                        fieldsList = fieldsListTemp;
                        dataValueListRadar = dataValueListRadarTemp;
                        let widthRadar = size.w * 800/6;
                        let heightRadar = size.h * 400/3;
                        for(let i = 0; i< dataValueListRadar.length; i++){
                            if(i == (dataValueListRadar.length-1)){
                                weightsList[i][0] = parseInt(`${widthRadar<heightRadar? widthRadar-40:heightRadar-40}`) * Math.PI / 800 * 6
                            }else{
                                weightsList[i][i+2] = dataValueListRadar[i] / dataValueListRadar[dataValueListRadar.length-1] * parseInt(`${widthRadar<heightRadar? widthRadar-40:heightRadar-40}`) * Math.PI / 800 * 6
                            }
                        }
                        break;
                    case 'scatterplot':
                        let dataSeriesScatter = getSeriesScatter(rowData, spec.encoding);
                        // fieldsList = Object.keys(dataSeriesScatter);
                        fieldsList = dataSeriesScatter;

                        //初始化weigths二维数组，比如：3个fields，则创建3*4的零数组（因为要计算和背景的weights）
                        weightsList = [];
                        for( let i  = 0 ; i < fieldsList.length; i++ ){
                            let item = [];
                            for( let j  = 0 ; j <= fieldsList.length; j++ ){
                                item.push(0);
                            }
                            weightsList.push(item)
                        }
            

                        //  console.log('dataSeriesScatter',dataSeriesScatter)
                        //  console.log('fieldsList',fieldsList)
                        //  console.log('rowDataSca',rowData)
                        //  console.log('rowDataSca',rowData.map(d=>d[spec.spec.encoding.color.field]))
                        
                        for(let i = 0; i < rowData.length; i++){
                            for(let j = 0; j < fieldsList.length; j++){
                                // console.log('rowData[spec.spec.encoding.x.field]',rowData[i][spec.spec.encoding.color.field])
                                if(rowData[i][spec.encoding.color.field] == fieldsList[j]){
                                    // console.log('rowData[spec.spec.encoding.x.field]',rowData[i][spec.spec.encoding.color.field])
                                    weightsList[j][0] += 20 * Math.PI / 150;
                                }
                            }
                        }

        
                        break;

                    case 'treemap':
                        let dataSeriesTree = getSeriesTree(rowData, spec.encoding)
                        fieldsList = Object.keys(dataSeriesTree)
                        // console.log('fidlist-tree',dataSeriesTree)
                        
                        //记录treemap每个区域的总value值
                        let dataValueList = new Array(fieldsList.length);
                        for( let i  = 0 ; i < dataValueList.length; i++ ){
                            dataValueList[i] = 0;
                        }
                    
                        //初始化weigths二维数组，比如：3个fields，则创建3*4的零数组（因为要计算和背景的weights）
                        weightsList = [];
                        for( let i  = 0 ; i < fieldsList.length; i++ ){
                            let item = [];
                            for( let j  = 0 ; j <= fieldsList.length; j++ ){
                                item.push(0);
                            }
                            weightsList.push(item)
                        }
                        

                        for(let i = 0; i < rowData.length; i++){
                            for(let j = 0; j < fieldsList.length; j++){
                            //    console.log('rowData[spec.spec.encoding.x.field]',rowData[i][spec.spec.encoding.color.field])
                            if(rowData[i][spec.encoding.color.field] == fieldsList[j]){
                                //    console.log('rowData[spec.spec.encoding.x.field]',rowData[i][spec.spec.encoding.size.field])
                                dataValueList[j] += rowData[i][spec.encoding.size.field];
                            }
                            }
                        }
                    let allValue = d3.sum(dataValueList)
                
                    for( let i  = 0 ; i < dataValueList.length; i++ ){
                        // for(let j = 0; j< dataBar[i].length; j++){
                            if(dataValueList[i] > 0 ){
                                //先计算上下与背景色边界
                                weightsList[i][0] +=  2 * dataValueList[i] / allValue;
                                
                                //再计算左边界
                                if(i == 0 || dataValueList[i-1] == 0){
                                    weightsList[i][0] += size.h;
                                }else{
                                    weightsList[i][i] += size.h;
                                }

                                //再计算右边界
                                if(i == (dataValueList.length - 1) || dataValueList[i] == 0){
                                    weightsList[i][0] += size.h;
                                }else{
                                    weightsList[i][i+2] += size.h;
                                }   
                            }
                        } 

                        break;

                    case 'heat map':
                        mapField.push(spec.encoding.color.field);
                        break;

                    case 'map':
                        mapField.push(spec.encoding.color.field);
                        break;  
            }


            let colormap = this.props.colormap;
                    
            colormap[this.props.editMode]={
                fieldsList: fieldsList,
                weightsList: weightsList,
                mapField: mapField,
                charttype: widgets[this.props.editMode].type
            };


            let data = []

            this.props.changeColormap(colormap);
         
            let colorData = {'colormap': this.props.colormap, 'backgroundcolor': this.props.backgroundColor, 'currentColorset': this.props.currentColorset}
            // console.log('colorData',colorData)
            this.props.changeLoading(true);

            HttpUtil.post(ApiUtil.API_COLOR_COLORATION, colorData)
                .then(re=>{
                    
                    console.log('this.props.loading', this.props.isLoading)

                    data = re.data
                    console.log('dataColor',data)
                    this.props.changeGlobalColorpair(data)
                        
                })
                .catch(error=>{
                    console.log(error.message);
                })
                .then(re=>{

                    
                    console.log('this.props.loading', this.props.isLoading)

                    widgets[this.props.editMode].spec = this.props.editSpec;
                    widgets[this.props.editMode].dataIndex = this.props.dataIndex;

                    //每次update都清空map/heatmap的左右端点
                    widgets[this.props.editMode].legendChangedColor['leftPoint']= '';
                    widgets[this.props.editMode].legendChangedColor['rightPoint']= '';

                    this.props.changeMapping(widgets);
                    this.props.widgets[this.props.editMode].spec = this.props.editSpec;

                    this.props.changeLoading(false);
                });   
        
            
            //以下为异步执行方案
            // var promise = Promise.resolve();
    
            // function onRejected(error) { 
            //       console.log("Catch Error: A or B", error);
            // }

            // promise.then(()=>{
            //     this.props.widgets[this.props.selectChartIndex].spec = this.props.displaySpec;
            //     console.log('11111', this.props.widgets)
            // })
            // .then(()=>{
            //     let widgets = this.props.widgets;
            //     console.log('222',this.props.widgets)
            //     this.props.changeMapping(widgets);
                
            // })
            // .then(()=>{
            //     let widgets = this.props.widgets;
            //     console.log('333',this.props.widgets)
            //     this.props.addChart(widgets);
                
            // })
            // .catch(onRejected);
            // this.setState({
            //     widgets: this.props.widgets
            // })

        }

        
    

    }

    render() {
        console.log('this.props.chartmode',this.props.chartMode)

        return (
            // <div className="pane ChannelsTab" style={{ height: 255}}>
            <div  style={{ height: 283, padding:'10px', marginTop:'-35px'}}>   
                {/* <div className='header'>Channels</div> */}
                <Divider className='headerDivder' orientation="left">Channels</Divider>
                    
                    <Encoding { ...this.props } />

                    {/* {this.props.selectChartIndex !== -1 ? */}
                    <Button type="primary" block style={{ marginTop: '5px', marginLeft:'45px',backgroundColor:'#00aeff', fontSize:'14px', width:'150px', height:'25px',borderRadius:'7px'}} onClick={this.handleChartOk} type="primary">{this.props.chartMode? 'Generate':'Update'}</Button>
                     {/* : null} */}
              
            </div>
        )
    }
}
