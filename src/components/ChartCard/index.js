import React, { Component } from 'react';
import * as d3 from 'd3';
import { DragSource } from 'react-dnd';
import DNDType from '@/constants/DNDType';
import ElementType from '@/constants/ElementType';
import {Tooltip} from 'antd'
import {Element, ChartInfo} from '@/models/Element';
import {getDefaultSpec} from '@/charts/Info';
import  d3DefaultSpec from '@/charts/D3/spec';
import d3Channels from '@/charts/D3/channels';
import ChartCategory from '@/constants/ChartCategory';
import HttpUtil from '@/HttpUtil';
import ApiUtil from '@/ApiUtil';
import {AreaChartOutlined,
    PieChartOutlined,
    BarChartOutlined,
    LineChartOutlined,
    RadarChartOutlined,
    DotChartOutlined,
    HeatMapOutlined,
    PlusCircleFilled
    } from '@ant-design/icons/lib/icons';
import _, { sortedIndex } from 'lodash';
import './chartcard.css';

import{ getStackedData as  getStackedDataArea, getSeries as getSeriesArea} from '@/charts/D3/AreaChart/helper'
import{ getStackedData as  getStackedDataBar, getSeries as getSeriesBar} from '@/charts/D3/BarChart/helper'
import{ getStackedData as  getStackedDataLine, getSeries as getSeriesLine} from '@/charts/D3/LineChart/helper'
import{ getAggregatedRows as  getAggregatedRowsPie, getCategories as getCategoriesPie} from '@/charts/D3/PieChart/helper'
import{ getAggregatedRows as  getAggregatedRowsScatter, getSeries as getSeriesScatter} from '@/charts/D3/ScatterPlot/helper'
import{ getStackedData as  getStackedDataTree, getSeries as getSeriesTree} from '@/charts/D3/TreeMap/helper'
import{ getStackedData as  getStackedDataRadar, getSeries as getSeriesRadar} from '@/charts/D3/RadarChart/helper'
import { editMode } from '../../selectors/canvas';



//img size
let w = 400;
let h = 400;
//drag end pos
let x = 240;
let y = 100;

//初始化chartmode icon-highlightcolor
const defaultHighlightColor = 'rgb(129,216,247)';
// const chartSource = {

// 	beginDrag(props) {
//         props.cleanInterationLayer(true);
//         props.displayResourceTargetArea(true);
//         let dataIndex = 0
//         if (props.charttype === 'scatterplot') {
//             props.switchData(1); //countrys.csv
//             dataIndex = 1
//         }else if(props.charttype === 'map'){
//             props.switchData(2); //china.csv
//             dataIndex = 2
//         }else{
//             props.switchData(0); //car.csv
//         }
       
// 		return {
//             category: props.chartcategory,
//             type: props.charttype,
//             dataIndex: dataIndex
//         };
// 	},

// 	endDrag(props, monitor) {
//         props.displayResourceTargetArea(false);
// 		const item = monitor.getItem();
//         const dropResult = monitor.getDropResult();
        
//         ////获取鼠标结束拖拽的位置，基于canvas基点计算位置
//         let e = window.event;       //Firefox下是没有event这个对象的！！

//         //更改
//         let canvas=document.getElementsByClassName("react-grid-layout layout")[0];
//         let pos = canvas.getBoundingClientRect();//获取canvas基于父页面的位差
//         if((Number(e.clientX)-Number(pos.left))>0){
//             x = Number(e.clientX)-Number(pos.left)-w/2; //根据鼠标位置计算画布上元素位置,强制类型转换
//             y = Number(e.clientY)-Number(pos.top)-h/2;
//         }
//         console.log('dropResult-pan',dropResult);
// 		if (dropResult) {
//             console.log('dropResult',dropResult);
//             if (dropResult.target === "canvas") {
//                 //add element to scene
//                 const newScene = _.cloneDeep(dropResult.currentScene);
//                 const newChart = new ChartInfo(
//                     item.dataIndex,
//                     item.category, // category
//                     item.type, //type
//                     getDefaultSpec(item.category, item.type), //spec
//                     x,
//                     y,
//                     w,
//                     h,
//                     0,
//                 )
//                 const newElement = new Element(ElementType.CHART, newChart);
//                 newScene.addElement(newElement);
//                 props.addElement(newElement);
//                 props.updateScene(dropResult.sceneIndex, newScene);
//                 // props.displayTrackEditor();
//             } 
// 		}
//     },
// }



export default class ChartCard extends Component {
    static defaultProps = {
        cols: { lg: 12, md: 10, sm: 8, xs: 4, xxs: 2 },
        rowHeight: 30,
      };
      constructor(props) {
          super(props);
          console.log('this.props-card',this.props)
          this.state = {
            //   activeKey: ChartCategory.VEGALITE,
              widgets: []
          }
          this.handlechart = this.handlechart.bind(this);
      }
      
  
      handlechart(charttype) {

     

        // let generateChannels = getChannels('D3', charttype)
        // for (const key in generateChannels) {
        //     generateChannels[key].isEncoded = false;
        //     generateChannels[key].field = '';
        // }

        // //改变generateChannels
        // this.props.changeGenerateChannels(generateChannels);


        //改变dataset
        let dataindex = this.props.dataList.length-1;
        
        // if (charttype === 'scatterplot') {
        //     console.log('dataindex-chartcard',charttype)
        //     // this.props.switchData(1); //countrys.csv
        //     dataindex = 1
        // }else if(charttype === 'map'){
        //     // this.props.switchData(2); //china.csv
        //     dataindex = 2
        // }

        //打开chart mode
        this.props.changeChartMode(charttype);  
        
        //改变dataIndex
        this.props.switchData(dataindex)

        // //改变selectChartIndex
        // this.props.selectChart(i);

        //关闭edit mode
        this.props.changeEditMode(false);

       // 改变generate channels
       let channels = d3Channels(charttype);
       //注意这里是遍历字典 要按key查找
       let channelsName = Object.keys(channels);
                        
       for(let i = 0; i< channelsName.length; i++){
           channels[channelsName[i]]['isEncoding'] = false;
       }

        this.props.changeGenerateChannels(d3Channels(charttype))
        this.props.changeGenerateSpec(d3DefaultSpec(charttype))

        // this.props.changeEditChannels(d3Channels(charttype))
        // this.props.changeEditSpec(d3DefaultSpec(charttype))
        
        //     console.log('this.state.colos',this.state.cols)
        //     console.log('this.props.widgets.length',this.props.widgets.length)
        
        // //计算weights
        //   const size = {
        //     x: (this.props.widgets.length * 2) % (this.state.cols || 8),
        //     y: Infinity, // puts it at the bottom
        //     w: 2,
        //     h: 1,
        //     i: new Date().getTime().toString(),
        //   };
        //   const type = {
        //       type: charttype
        //   };
        //   const dataIndex = {
        //       dataIndex: dataindex
        //   }
        //   const category = {
        //       category: ChartCategory.D3
        //   }
        //   const spec = {
        //       spec: getDefaultSpec(ChartCategory.D3, charttype)
        //   }

        //   const updateCode = {
        //       updateCode: false
        //   }

        //     //下面开始更新colormap
            
        //     const rowData = this.props.dataList[dataindex];
    
        //       //计算fields和data
        //       let fieldsList = [];
        //       let weightsList = []; 
        //       let mapField = []; //增设heatmap/map标记

             
            
        //       switch(charttype){
    
        //         case 'area chart':      
        //             let fieldsArea = getSeriesArea(rowData, spec.spec.encoding);
        //             fieldsList = Object.keys(fieldsArea);

        //             //初始化weigths二维数组，比如：3个fields，则创建3*4的零数组（因为要计算和背景的weights）
        //             weightsList = [];
        //             for( let i  = 0 ; i < fieldsList.length; i++ ){
        //                 let item = [];
        //                 for( let j  = 0 ; j <= fieldsList.length; j++ ){
        //                     item.push(0);
        //                 }
        //                 weightsList.push(item)
        //             }
    
                    
        //             for( let i  = 0 ; i < weightsList.length; i++ ){
        //                 if(i==0){
        //                     weightsList[i][0] += size.w + size.h/fieldsList.length;
        //                     weightsList[i][i+2] +=size.w; //近似为宽度
        //                 }else if(i == weightsList.length-1){
        //                     weightsList[i][0] += size.w + size.h/fieldsList.length;
        //                     weightsList[i][i] += size.w;
        //                 }else{
        //                     weightsList[i][0] += size.h/fieldsList.length;
        //                     weightsList[i][i] += size.w;
        //                     weightsList[i][i+2] += size.w;
        //                 }
        //             }


        //             break;
                
        //         case 'bar chart':
        //             let dataBar = getStackedDataBar(rowData, spec.spec.encoding)
        //             fieldsList = Object.keys(getSeriesBar(rowData, spec.spec.encoding))

        //             //初始化weigths二维数组，比如：3个fields，则创建3*4的零数组（因为要计算和背景的weights）
        //             weightsList = [];
        //             for( let i  = 0 ; i < fieldsList.length; i++ ){
        //                 let item = [];
        //                 for( let j  = 0 ; j <= fieldsList.length; j++ ){
        //                     item.push(0);
        //                 }
        //                 weightsList.push(item)
        //             }

        //             //判断是否为最底部的bar
        //             let flagListBott = new Array(dataBar[0].length);
        //             for( let i  = 0 ; i < dataBar[0].length; i++ ){
        //                 flagListBott[i] = false;
        //             }

        //             let flagListTop = new Array(dataBar[0].length);
        //             for( let i  = 0 ; i < dataBar[0].length; i++ ){
        //                 flagListTop[i] = false;
        //             }

        //             console.log('dataBar[0].length',dataBar[0].length)

        //             //bar最高点代表的值
        //             let maxBar = 0;
        //             for(let i = 0; i < dataBar[dataBar.length-1].length; i++){
        //                 if(dataBar[dataBar.length-1][i][1] > maxBar){
        //                     maxBar = dataBar[dataBar.length-1][i][1];
        //                 }
        //             }
        //             console.log('barWeight',dataBar)

        //             for( let i  = 0 ; i < dataBar.length; i++ ){
        //                 for(let j = 0; j< dataBar[i].length; j++){
        //                     if((dataBar[i][j][1]-dataBar[i][j][0]) > 0 ){
        //                         console.log('barJ',j)
        //                         //先计算两边与背景色边界
        //                         weightsList[i][0] +=  2 * (dataBar[i][j][1]-dataBar[i][j][0]) / maxBar * size.h;
        //                         //再计算下边界
        //                         if(flagListBott[j] == false){
        //                             weightsList[i][0] += size.w / dataBar.length;
                                    
        //                         }else{
        //                             weightsList[i][i] += size.w / dataBar.length;
        //                         }
        //                         flagListBott[j] = true;

                                 
        //                     }
        //                 }

        //             }
        //             for( let i  = dataBar.length - 1 ; i >= 0; i-- ){
        //                 for(let j = 0; j< dataBar[i].length; j++){
        //                     if((dataBar[i][j][1]-dataBar[i][j][0]) > 0 ){
                             
        //                         //计算上边界
        //                         if(flagListTop[j] == false){
        //                             weightsList[i][0] += size.w / dataBar.length;
                                    
        //                         }else{
        //                             weightsList[i][i+2] += size.w / dataBar.length;
        //                         }
        //                         flagListTop[j] = true;    
        //                     }
        //                 }

        //             }

        //             break;
        //         case 'line chart':
        //             let dataSeriesBar = getSeriesBar(rowData, spec.spec.encoding);
        //             fieldsList = Object.keys(dataSeriesBar);
        //             // console.log('fieldsList_bar',fieldsList);
                    
        //             //初始化weigths二维数组，比如：3个fields，则创建3*4的零数组（因为要计算和背景的weights）
        //             weightsList = [];
        //             for( let i  = 0 ; i < fieldsList.length; i++ ){
        //                 let item = [];
        //                 for( let j  = 0 ; j <= fieldsList.length; j++ ){
        //                     item.push(0);
        //                 }
        //                 weightsList.push(item)
        //             }
                    
        //             for( let i  = 0 ; i < weightsList.length; i++ ){
        //                 weightsList[i][0] += size.w;
        //             }
        //             break;
        //         case 'pie chart':
        //             let dataCategories = getCategoriesPie(rowData, spec.spec.encoding);
        //             fieldsList = Object.keys(dataCategories);
                    
        //             //初始化weigths二维数组，比如：3个fields，则创建3*4的零数组（因为要计算和背景的weights）
        //             weightsList = [];
        //             for( let i  = 0 ; i < fieldsList.length; i++ ){
        //                 let item = [];
        //                 for( let j  = 0 ; j <= fieldsList.length; j++ ){
        //                     item.push(0);
        //                 }
        //                 weightsList.push(item)
        //             }
                    
        //             let dataPie = getAggregatedRowsPie(rowData, spec.spec.encoding);
  
        //             let sumPie = 0;
        //             let rPie = parseInt(`${size.w > size.h? size.h * 3/2-20/800:size.w * 6/2-20/400}`);
                   
        //             for(let i = 0; i < dataPie.length; i++){
        //                 sumPie += dataPie[i][spec.spec.encoding.size.field];
        //             }
        //             console.log('rPie',rPie)
        //             for( let i  = 0 ; i < fieldsList.length; i++ ){
        //                 //计算与背景的边界
        //                 weightsList[i][0] += dataPie[i][spec.spec.encoding.size.field] / sumPie * 2 * Math.PI * rPie;
                        
        //                 if(i<(weightsList.length - 1)){
        //                     console.log('weightsList[i][i]11',weightsList[i][i])
        //                     weightsList[i][i] += rPie;
        //                     console.log('weightsList[i][i]',weightsList[i][i])
        //                 }else{
        //                     weightsList[i][1] += rPie;
        //                 }
        //             }

      
        //             break;
        //         case 'radar chart':
        //             let dataRadar = getStackedDataRadar(rowData, spec.spec.encoding)
                    
        //             //后面会对其进行排序以分辨同心圆内外顺序
        //             fieldsList = Object.keys(getSeriesRadar(rowData, spec.spec.encoding))
               

        //              //记录radar每个同心圆的总value值
        //              let dataValueListRadar = new Array(fieldsList.length);
        //              for( let i  = 0 ; i < dataValueListRadar.length; i++ ){
        //                 dataValueListRadar[i] = 0;
        //              }

        //               //初始化weigths二维数组，比如：3个fields，则创建3*4的零数组（因为要计算和背景的weights）
        //             weightsList = [];
        //             for( let i  = 0 ; i < fieldsList.length; i++ ){
        //                 let item = [];
        //                 for( let j  = 0 ; j <= fieldsList.length; j++ ){
        //                     item.push(0);
        //                 }
        //                 weightsList.push(item)
        //             }

        //             for(let i = 0; i < rowData.length; i++){
        //                 for(let j = 0; j < fieldsList.length; j++){
        //                 //    console.log('rowData[spec.spec.encoding.x.field]',rowData[i][spec.spec.encoding.color.field])
        //                    if(rowData[i][spec.spec.encoding.color.field] == fieldsList[j]){
        //                     //    console.log('rowData[spec.spec.encoding.x.field]',rowData[i][spec.spec.encoding.size.field])
        //                     dataValueListRadar[j] += rowData[i][spec.spec.encoding.y.field];
        //                    }
        //                 }
        //             }

        //             //排序索引，即圆由小到大排列
        //             let sortIndex=  Array.from(Array(dataValueListRadar.length).keys())
        //                                 .sort((a, b) => dataValueListRadar[a] < dataValueListRadar[b] ? -1 : (dataValueListRadar[b] < dataValueListRadar[a]) | 0)
                    
        //             let fieldsListTemp = [];
        //             let dataValueListRadarTemp = [];
        //             sortIndex.forEach((v,a)=>{
        //                 fieldsListTemp.push(fieldsList[v]);
        //                 dataValueListRadarTemp.push(dataValueListRadar[v])
        //             })

        //             fieldsList = fieldsListTemp;
        //             dataValueListRadar = dataValueListRadarTemp;
        //             let widthRadar = size.w * 800/6;
        //             let heightRadar = size.h * 400/3;
        //             for(let i = 0; i< dataValueListRadar.length; i++){
        //                 if(i == (dataValueListRadar.length-1)){
        //                     weightsList[i][0] = parseInt(`${widthRadar<heightRadar? widthRadar-40:heightRadar-40}`) * Math.PI / 800 * 6
        //                 }else{
        //                     weightsList[i][i+2] = dataValueListRadar[i] / dataValueListRadar[dataValueListRadar.length-1] * parseInt(`${widthRadar<heightRadar? widthRadar-40:heightRadar-40}`) * Math.PI / 800 * 6
        //                 }
        //             }
        //             break;
        //         case 'scatterplot':
        //             let dataSeriesScatter = getSeriesScatter(rowData, spec.spec.encoding);
        //             // fieldsList = Object.keys(dataSeriesScatter);
        //             fieldsList = dataSeriesScatter;

        //              //初始化weigths二维数组，比如：3个fields，则创建3*4的零数组（因为要计算和背景的weights）
        //              weightsList = [];
        //              for( let i  = 0 ; i < fieldsList.length; i++ ){
        //                  let item = [];
        //                  for( let j  = 0 ; j <= fieldsList.length; j++ ){
        //                      item.push(0);
        //                  }
        //                  weightsList.push(item)
        //              }
           

        //             //  console.log('dataSeriesScatter',dataSeriesScatter)
        //             //  console.log('fieldsList',fieldsList)
        //             //  console.log('rowDataSca',rowData)
        //             //  console.log('rowDataSca',rowData.map(d=>d[spec.spec.encoding.color.field]))
                    
        //             for(let i = 0; i < rowData.length; i++){
        //                  for(let j = 0; j < fieldsList.length; j++){
        //                     // console.log('rowData[spec.spec.encoding.x.field]',rowData[i][spec.spec.encoding.color.field])
        //                     if(rowData[i][spec.spec.encoding.color.field] == fieldsList[j]){
        //                         // console.log('rowData[spec.spec.encoding.x.field]',rowData[i][spec.spec.encoding.color.field])
        //                         weightsList[j][0] += 20 * Math.PI / 150;
        //                     }
        //                  }
        //             }

      
        //             break;

        //         case 'treemap':
        //             let dataSeriesTree = getSeriesTree(rowData, spec.spec.encoding)
        //             fieldsList = Object.keys(dataSeriesTree)
        //             // console.log('fidlist-tree',dataSeriesTree)
                    
        //             //记录treemap每个区域的总value值
        //             let dataValueList = new Array(fieldsList.length);
        //             for( let i  = 0 ; i < dataValueList.length; i++ ){
        //                 dataValueList[i] = 0;
        //             }
                   
        //             //初始化weigths二维数组，比如：3个fields，则创建3*4的零数组（因为要计算和背景的weights）
        //             weightsList = [];
        //             for( let i  = 0 ; i < fieldsList.length; i++ ){
        //                 let item = [];
        //                 for( let j  = 0 ; j <= fieldsList.length; j++ ){
        //                     item.push(0);
        //                 }
        //                 weightsList.push(item)
        //             }
                    

        //             for(let i = 0; i < rowData.length; i++){
        //                 for(let j = 0; j < fieldsList.length; j++){
        //                 //    console.log('rowData[spec.spec.encoding.x.field]',rowData[i][spec.spec.encoding.color.field])
        //                    if(rowData[i][spec.spec.encoding.color.field] == fieldsList[j]){
        //                     //    console.log('rowData[spec.spec.encoding.x.field]',rowData[i][spec.spec.encoding.size.field])
        //                        dataValueList[j] += rowData[i][spec.spec.encoding.size.field];
        //                    }
        //                 }
        //             }
        //            let allValue = d3.sum(dataValueList)
            
        //            for( let i  = 0 ; i < dataValueList.length; i++ ){
        //             // for(let j = 0; j< dataBar[i].length; j++){
        //                 if(dataValueList[i] > 0 ){
        //                     //先计算上下与背景色边界
        //                     weightsList[i][0] +=  2 * dataValueList[i] / allValue;
                            
        //                     //再计算左边界
        //                     if(i == 0 || dataValueList[i-1] == 0){
        //                         weightsList[i][0] += size.h;
        //                     }else{
        //                         weightsList[i][i] += size.h;
        //                     }

        //                     //再计算右边界
        //                     if(i == (dataValueList.length - 1) || dataValueList[i] == 0){
        //                         weightsList[i][0] += size.h;
        //                     }else{
        //                         weightsList[i][i+2] += size.h;
        //                     }   
        //                 }
        //             } 

        //             break;

        //         case 'heat map':
        //             mapField.push(spec.spec.encoding.color.field);
        //             break;

        //         case 'map':
        //             mapField.push(spec.spec.encoding.color.field);
        //             break;  
        //         }

        //         let colormap = this.props.colormap;
                
        //         colormap.push({
        //             fieldsList: fieldsList,
        //             weightsList: weightsList,
        //             mapField: mapField,
        //             charttype: charttype
        //         });
        //         // var content = JSON.stringify(colormap);
        //         // var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
        //         // const href = URL.createObjectURL(blob);
        //         // const link = document.createElement('a');
        //         // link.href = href;
        //         // link.download = 'colormap' + ".json";
        //         // document.body.appendChild(link);
        //         // link.click();
        //         // document.body.removeChild(link);

        //         let data = []

        //         this.props.changeColormap(colormap);
        //         // console.log('this.props.colormap',this.props.colormap)
        //         let colorData = {'colormap': this.props.colormap, 'backgroundcolor': this.props.backgroundColor, 'currentColorset': this.props.currentColorset}
        //         // console.log('colorData',colorData)
        //         HttpUtil.post(ApiUtil.API_COLOR_COLORATION, colorData)
        //             .then(re=>{
        //                 data = re.data
        //                 console.log('dataColor',data)
        //                 this.props.changeGlobalColorpair(data)
                           
        //             })
        //             .catch(error=>{
        //                 console.log(error.message);
        //             })
        //             .then(re=>{
        //                 console.log('addChart')
        //                 let newWidgets = _.cloneDeep(this.props.widgets)
        //                 this.props.addChart(newWidgets.concat({...size,...type,...dataIndex,...category,...spec}));
        //                 this.setState(
        //                     {
        //                     widgets: this.state.widgets.concat({
        //                         ...size,
        //                         ...type,
        //                         ...dataIndex,
        //                         ...category,
        //                         ...spec,
        //                         ...updateCode,
        //                     }),
        //                     },
        //                 ); 
        //             });   
                                      

        
        };

    chooseChart() {
        const chartMode = this.props.chartMode;
        // console.log('editmode-tab',this.props.widgets)
        // console.log('editmode-tab',chartMode)
        // console.log('editmode-tab',this.props.editMode)
        const editType = chartMode? false: this.props.widgets[this.props.editMode].type;
        console.log('edittype',editType)
        

        switch(this.props.charttype){
            case 'area chart':
                //这里一定是()=> 不然会产生死循环报错
                return <Tooltip title='area chart'>
                    
                    <div style={{width:'40px',height:'40px',border:chartMode=='area chart'|| (!chartMode && editType=='area chart')?'2px solid rgb(129, 216, 247)':'',borderRadius:'8px'}}>
                    
                        {
                            chartMode=='area chart'|| (!chartMode && editType=='area chart')?
                            <AreaChartOutlined  onClick={()=> this.handlechart('area chart')} style={{fontSize:'25px', color: defaultHighlightColor}}/>  
                            :
                            <AreaChartOutlined  onClick={()=> this.handlechart('area chart')}/>  
                            

                        }
                        {
                            chartMode=='area chart'?
                            <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60f;</span></div>
                            :
                                !chartMode&&editType=='area chart'?
                                <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60e;</span></div>
                                :
                                null
                        }
                        
                    </div>
                    </Tooltip>
                    
            
            case 'bar chart':
                return <Tooltip title='bar chart'>
                    <div style={{width:'40px',height:'40px',border:chartMode=='bar chart'|| (!chartMode && editType=='bar chart')?'2px solid rgb(129, 216, 247)':'',borderRadius:'8px'}}>
                    
                    {
                        chartMode=='bar chart'|| (!chartMode && editType=='bar chart')?
                        <BarChartOutlined  onClick={()=> this.handlechart('bar chart')} style={{fontSize:'25px', color: defaultHighlightColor}}/>  
                        :
                        <BarChartOutlined  onClick={()=> this.handlechart('bar chart')}/>  
                        

                    }
                    {
                        chartMode=='bar chart'?
                        <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60f;</span></div>
                        :
                            !chartMode&&editType=='bar chart'?
                            <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60e;</span></div>
                            :
                            null
                    }
                    
                </div>
                    
                    
                    </Tooltip>
                
            case 'line chart':
                return <Tooltip title='line chart'>
                    <div style={{width:'40px',height:'40px',border:chartMode=='line chart'|| (!chartMode && editType=='line chart')?'2px solid rgb(129, 216, 247)':'',borderRadius:'8px'}}>
                    
                    {
                        chartMode=='line chart'|| (!chartMode && editType=='line chart')?
                        <LineChartOutlined  onClick={()=> this.handlechart('line chart')} style={{fontSize:'25px', color: defaultHighlightColor}}/>  
                        :
                        <LineChartOutlined  onClick={()=> this.handlechart('line chart')}/>  
                        

                    }
                    {
                        chartMode=='line chart'?
                        <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60f;</span></div>
                        :
                            !chartMode&&editType=='line chart'?
                            <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60e;</span></div>
                            :
                            null
                    }
                    
                </div>

                   
                    </Tooltip>
                
            case 'scatterplot':
                return <Tooltip title='scatterplot'>
                    <div style={{width:'40px',height:'40px',border:chartMode=='scatterplot'|| (!chartMode && editType=='scatterplot')?'2px solid rgb(129, 216, 247)':'',borderRadius:'8px'}}>
                    
                    {
                        chartMode=='scatterplot'|| (!chartMode && editType=='scatterplot')?
                        <DotChartOutlined  onClick={()=> this.handlechart('scatterplot')} style={{fontSize:'25px', color: defaultHighlightColor}}/>  
                        :
                        <DotChartOutlined  onClick={()=> this.handlechart('scatterplot')}/>  
                        

                    }
                    {
                        chartMode=='scatterplot'?
                        <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60f;</span></div>
                        :
                            !chartMode&&editType=='scatterplot'?
                            <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60e;</span></div>
                            :
                            null
                    }
                    
                </div>
                    
                   
                    </Tooltip>

                
            case 'proportion chart':
                return <Tooltip title='proportion chart'>
                    <div style={{width:'40px',height:'40px',border:chartMode=='proportion chart'|| (!chartMode && editType=='proportion chart')?'2px solid rgb(129, 216, 247)':'',borderRadius:'8px'}}>
                    
                    {
                        chartMode=='proportion chart'|| (!chartMode && editType=='proportion chart')?
                        <DotChartOutlined  onClick={()=> this.handlechart('proportion chart')} style={{fontSize:'25px', color: defaultHighlightColor}}/>  
                        :
                        <DotChartOutlined  onClick={()=> this.handlechart('proportion chart')}/>  
                        

                    }
                    {
                        chartMode=='proportion chart'?
                        <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60f;</span></div>
                        :
                            !chartMode&&editType=='proportion chart'?
                            <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60e;</span></div>
                            :
                            null
                    }


                    
                    
                </div>
                    </Tooltip>
                    
                
            case 'pie chart':
                return <Tooltip title='pie chart'>
                    <div style={{width:'40px',height:'40px',border:chartMode=='pie chart'|| (!chartMode && editType=='pie chart')?'2px solid rgb(129, 216, 247)':'',borderRadius:'8px'}}>
                    
                    {
                        chartMode=='pie chart'|| (!chartMode && editType=='pie chart')?
                        <PieChartOutlined  onClick={()=> this.handlechart('pie chart')} style={{fontSize:'25px', color: defaultHighlightColor}}/>  
                        :
                        <PieChartOutlined  onClick={()=> this.handlechart('pie chart')}/>  
                        

                    }
                    {
                        chartMode=='pie chart'?
                        <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60f;</span></div>
                        :
                            !chartMode&&editType=='pie chart'?
                            <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60e;</span></div>
                            :
                            null
                    }
                    
                </div>
                    </Tooltip>
                
            case 'map':
                return <Tooltip title='map'>
                    <div style={{width:'40px',height:'40px',border:chartMode=='map'|| (!chartMode && editType=='map')?'2px solid rgb(129, 216, 247)':'',borderRadius:'8px'}}>
                    
                    {
                        chartMode=='map'|| (!chartMode && editType=='map')?
                        <div style={{marginTop:'-6px'}} onClick={()=> this.handlechart('map')}><span className="iconfont" style={{fontSize:'30px', color:defaultHighlightColor}}>&#xe62e;</span></div>
                        :
                        <div style={{marginTop:'-8px'}} onClick={()=> this.handlechart('map')}><span className="iconfont" style={{fontSize:'34px', color:'rgb(89,89,89)'}}>&#xe62e;</span></div>
                        

                    }
                    {
                        chartMode=='map'?
                        <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60f;</span></div>
                        :
                            !chartMode&&editType=='map'?
                            <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60e;</span></div>
                            :
                            null
                    }
                    
                </div>

                    
                    </Tooltip>
            
            case 'treemap':
                return <Tooltip title='treemap'>
                    <div style={{width:'40px',height:'40px',border:chartMode=='treemap'|| (!chartMode && editType=='treemap')?'2px solid rgb(129, 216, 247)':'',borderRadius:'8px'}}>
                    
                    {
                        chartMode=='treemap'|| (!chartMode && editType=='treemap')?
                        <div style={{marginTop:'3px'}} onClick={()=> this.handlechart('treemap')}><span className="iconfont" style={{fontSize:'20px',color:defaultHighlightColor}}>&#xe6c0;</span></div>
                        :
                        <div style={{marginTop:'1px'}} onClick={()=> this.handlechart('treemap')}><span className="iconfont" style={{fontSize:'24px',color:'rgb(89,89,89)'}}>&#xe6c0;</span></div>
                        

                    }
                    {
                        chartMode=='treemap'?
                        <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60f;</span></div>
                        :
                            !chartMode&&editType=='treemap'?
                            <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60e;</span></div>
                            :
                            null
                    }
                    
                </div>
                   
                    </Tooltip>
            
            case 'heat map':
                return <Tooltip title='heat map'>
                    <div style={{width:'40px',height:'40px',border:chartMode=='heat map'|| (!chartMode && editType=='heat map')?'2px solid rgb(129, 216, 247)':'',borderRadius:'8px'}}>
                    
                    {
                        chartMode=='heat map'|| (!chartMode && editType=='heat map')?
                        <div style={{marginTop:'-7px',marginLeft:'0px'}} onClick={()=> this.handlechart('heat map')}><span className="iconfont" style={{fontSize:'35px', color:defaultHighlightColor}}>&#xe6c3;</span></div>
                        :
                        <div style={{marginTop:'-11px',marginLeft:'-1px'}} onClick={()=> this.handlechart('heat map')}><span className="iconfont" style={{fontSize:'40px', color:'rgb(89,89,89)'}}>&#xe6c3;</span></div>
                        

                    }
                    {
                        chartMode=='heat map'?
                        <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px',marginTop:'-10px'}}>&#xe60f;</span></div>
                        :
                            !chartMode&&editType=='heat map'?
                            <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60e;</span></div>
                            :
                            null
                    }
                    
                </div>
                    
                    </Tooltip>
            
            case 'radar chart':
                return <Tooltip title='radar chart'>
                    <div style={{width:'40px',height:'40px',border:chartMode=='radar chart'|| (!chartMode && editType=='radar chart')?'2px solid rgb(129, 216, 247)':'',borderRadius:'8px'}}>
                    
                    {
                        chartMode=='radar chart'|| (!chartMode && editType=='radar chart')?
                        <RadarChartOutlined onClick={()=> this.handlechart('radar chart')} style={{fontSize:'25px',color:defaultHighlightColor}}/>
                        :
                        <RadarChartOutlined onClick={()=> this.handlechart('radar chart')} />
                        

                    }
                    {
                        chartMode=='radar chart'?
                        <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60f;</span></div>
                        :
                            !chartMode&&editType=='radar chart'?
                            <div style={{marginTop:'-11px',marginLeft:'-1px'}} ><span className="iconfont" style={{fontSize:'15px', color:defaultHighlightColor, backgroundColor:'#fff', position: 'absolute', marginLeft:'15px'}}>&#xe60e;</span></div>
                            :
                            null
                    }
                    
                </div>
                    
                    </Tooltip>
        }
    }

    render() {
        
        const { connectDragSource } = this.props
        // return connectDragSource(
        //     <div className="chartcard" align="center">
        //         {this.chooseChart()}
        //         {/* <img src={this.props.chartsrc} alt={this.props.charttype} /> */}
        //         {/* <p style={{ fontSize: '10px',marginTop:'5px'}}>{this.props.chartname}</p> */}
        //     </div>
        // )
        return <div className="chartcard" align="center" >
                {this.chooseChart()}
                {/* <img src={this.props.chartsrc} alt={this.props.charttype} /> */}
                {/* <p style={{ fontSize: '10px',marginTop:'5px'}}>{this.props.chartname}</p> */}
            </div>
        
    }
}

// export default DragSource(
//     DNDType.DND_CHART,
//     chartSource,
// 	(connect, monitor) => ({
// 		connectDragSource: connect.dragSource(),
// 		isDragging: monitor.isDragging()
// 	}),
// )(ChartCard)
