import React, { Component } from 'react';
import { Spin, Layout } from 'antd';
import EditPane from '../EditPane';
import CanvasPane from '../CanvasPane';
import ResourcePane from '../ResourcePane';
import ToolPane from '../ToolPane';
import BookmarksPane from '../BookmarksPane';
import  d3DefaultSpec from '@/charts/D3/spec';
import d3Channels from '@/charts/D3/channels';
//帮助构造拖拽接口
import HTML5Backend from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import './editview.css';
import html2canvas from 'html2canvas';
import {
        TagOutlined,
        DownloadOutlined,
        ShareAltOutlined,
        DeleteOutlined,
        RedoOutlined
        } from '@ant-design/icons/lib/icons';
import SceneTool from '../ToolPane/Tools/SceneTool';
import { displayFlag } from '../../selectors/canvas';
import HttpUtil from '@/HttpUtil';
import ApiUtil from '@/ApiUtil';


const { Sider, Content, Footer } = Layout;
var index = 0;


export default class EditorView extends Component {
        state = {
            windowWidth:window.innerWidth,
            windowHeight:window.innerHeight,
            contentHeight:window.innerHeight-320,
            contentWidth:window.innerWidth-660,
            scrollLeft:0,
        };


    preCanvas=(e)=>{
        //打印日志
        HttpUtil.post(ApiUtil.API_COLOR_LOG, 'bookMarks')
        .then(re=>{         
        })
        .catch(error=>{
            console.log(error.message);
        })

        index++;
        console.log(index);
        function convertCanvasToImage(canvas){  
            //新Image对象，可以理解为DOM  
            var image = new Image();
            // canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持  
            // 指定格式 PNG  
            image.src = canvas.toDataURL("image/png");
            return image;  
        } 
        // var mycanvas=document.getElementById('canvas-wrapper');
        var mycanvas=document.getElementById('layoutStage');

        html2canvas(mycanvas).then(function(canvas) {
            // var mycanvas=document.getElementById('canvas'); 

            //将转换后的img标签插入到html中  

            var img=convertCanvasToImage(canvas);  

            var pre1 = document.getElementById('pre'+ index);
            var tarcanvas = pre1.appendChild(canvas);
            tarcanvas.style.width = '100%';
            tarcanvas.style.height = '100%';
            var ctx = tarcanvas.getContext('2d');

            img.onload = function () {
                // ctx.drawImage(img, 1050,450,800,600,20, 0,256,180);
                ctx.drawImage(img, 0,0,img.width,img.height,0,0,100,50)
                // console.log('onload finish');
            }


            // document.getElementById('pre1').append(img);
        });

    } 
    downLoadCurrent=(e)=>{
         //打印日志
         HttpUtil.post(ApiUtil.API_COLOR_LOG, 'saveDashBoard')
         .then(re=>{         
         })
         .catch(error=>{
             console.log(error.message);
         })

        var  mycanvas=document.getElementById('layoutStage');
        // var  mycanvas=document.getElementsByClassName('ant-layout-content')[3];
        // var  mycanvas=document.getElementsByClassName('dashboard')[0]
        
        function fileDownload(downloadUrl) {
            let aLink = document.createElement("a");
            aLink.style.display = "none";
            aLink.href = downloadUrl;
            aLink.download = "myDashBoard.png";
            // 触发点击-然后移除
            document.body.appendChild(aLink);
            aLink.click();
            document.body.removeChild(aLink);
          }
        

        html2canvas(mycanvas).then(function(canvas) {
            var imgData = canvas.toDataURL("image/png");
            fileDownload(imgData);
          });
         
    }
    cleanCurrent = () => {
        //data panel

        //打开chart mode - 恢复默认bartchart
        let charttype = 'bar chart'
              
        this.props.changeChartMode(charttype)

        //改变dataIndex
        this.props.switchData(0)

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

        //canvas panel
        let widgets = [],
        selectChartIndex = -1,
        layout = '',
        colormap = [],
        globalColorpair = [];

        this.props.removeChart(widgets);
        this.props.selectChart(selectChartIndex);
        this.props.changeLayout(layout);
        this.props.changeColormap(colormap);
        this.props.changeGlobalColorpair(globalColorpair);

    }
    updatePage = () =>{
         //打印日志
         HttpUtil.post(ApiUtil.API_COLOR_LOG, 'updatePage')
         .then(re=>{         
         })
         .catch(error=>{
             console.log(error.message);
         })

        let data;
        let colorData = {'colormap': this.props.colormap, 'backgroundcolor': this.props.backgroundColor, 'currentColorset': this.props.currentColorset}

        this.props.changeLoading(true);
        HttpUtil.post(ApiUtil.API_COLOR_COLORATION, colorData)
            .then(re=>{
              

                data = re.data
                console.log('dataColor',data)
                this.props.changeGlobalColorpair(data)
                    
            })
            .catch(error=>{
              
                console.log(error.message);
            }).then(re=>{
              

                this.props.changeLoading(false);
                    
            })
       
    }

    

    render() {
   
        const {windowWidth,windowHeight,contentHeight,contentWidth} = this.state;
        const isLoading = this.props.isLoading;
 
        return (
            <Spin spinning={isLoading}>
            <div id="editview" style={{ height: windowHeight+'px',width: windowWidth+'px' }}  >
            <DndProvider backend={HTML5Backend}>
                <Layout>
                    <Sider width={520}>
                        <Layout style={{ height: windowHeight +'px' }}>
                            <Content width={520} style={{ height: windowHeight - 237+'px' }}>
                                <Layout width={520}>
                                <Sider 
                                    width={260}                            
                                    style={{ background: '#fff', height: windowHeight-237+'px', zIndex:0}} 
                                >
                                    <ToolPane width={260} contentHeight={windowHeight}/>
                                </Sider>
                                <Content 
                                    width={250} 
                                    style={{background : '#fff', height: windowHeight-237+'px',
                                    zIndex:0}} 
                                >
                                    <ResourcePane contentHeight={windowHeight}/>
                                
                                </Content>   
                                </Layout> 
                            </Content>
                            <Footer style={{height: '237px', padding: '0px', backgroundColor: '#fff', marginBottom: '5px'}}>
                                <div className='pane'>
                                    <div className='header'>Color Palettes</div>
                                    <SceneTool {...this.props}/>
                                </div>
                            </Footer>
                        </Layout>
                    </Sider>
                    <Content style={{ width: contentWidth}}>
                        <Layout style={{ height: 730 }}>
                            

                            <Content style={{ background: '#fff', height: 513+'px' }}>
                                <div className='pane'>
                                    <div className='header'>Canvas
                                        {/* <ShareAltOutlined /> */}
                                        
                                        <DeleteOutlined onClick={this.cleanCurrent.bind(this)}/>
                                        <DownloadOutlined onClick={this.downLoadCurrent.bind(this)}/>
                                        <TagOutlined onClick={this.preCanvas.bind(this)}/>
                                        <RedoOutlined onClick={this.updatePage.bind(this)}/>
                                    </div>
                                    <CanvasPane contentHeight={453} contentWidth={contentWidth}/>
                                </div>
                            </Content>
                        </Layout>
                        <Layout 
                            className={this.props.displayFlag ? 'showBookmarks' : 'hideBookmarks'}
                            style={{ height: '235px', backgroundColor: '#fff'}}
                        >
                            {/* 收起左边栏按钮 */}
                            {/* <div className="maskbutton1" 
                                onClick={this.showMedia}
                                style={{left:showResourcePane?"359px":"0px",top:canvasH/2+33+"px",width:"18px",}}>
                                <p style={{marginLeft:"4px",marginTop:"3px"}} >{showBookmarksPane?"<":">" }</p>
                            </div> */}
                            <BookmarksPane />
                        </Layout>
                    </Content>
                </Layout>
            </DndProvider>     
            </div>
            </Spin>
        )
    }
}
