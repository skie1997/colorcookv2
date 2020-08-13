import React, { Component } from 'react';
import html2canvas from 'html2canvas';
// import jsPDF from "jspdf";
import './bookmarkspane.css';
import {
        DownloadOutlined,
        DownOutlined,
        UpOutlined
    } from '@ant-design/icons/lib/icons';

export default class BookmarksPane extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //选择要下载的bookmarks-index
            index: '',
        };
        
    }

    chooseD=(index,e)=>{
        var pre=document.getElementsByClassName('preview');
        for (var i = 0; i < pre.length; i++) {
            pre[i].style.borderColor = '#eee';
        }
        // pre.styel.borderColor = '#eee';
        var select=document.getElementById('pre'+index);
        select.style.borderColor = 'rgb(129,216,247)';
        this.setState({
           index: index,
        });
    }

    downLoad=(e)=>{
        var mycanvas=document.getElementById('pre'+this.state.index).lastChild;
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

    displayBookmarks=() =>{
        console.log('displaymark')
        this.props.displayBookmarks(!this.props.displayFlag);
    }


    render() {
        return (
            <div id="story" className='pane'style={{ height: '300px',zIndex:'999' }}>
                {/* <div id="storylineHeader">
                    <font color="white" weight="bold">BookMarks</font>
                </div> */}
                <div className='header'>Bookmarks
                    
                    {
                        this.props.displayFlag? 
                        <DownOutlined className='bookmarksDown'onClick = {this.displayBookmarks.bind(this)} />
                        :
                        <UpOutlined  onClick = {this.displayBookmarks.bind(this)}/>

                    }
                    <DownloadOutlined onClick ={this.downLoad.bind(this)}/>
                    
                </div>
                <div id="bookmarksPreview" >
                    <div className='content' style={{ width:'9900px' }}>
                        {/* ()=>this.chooseD(id)等效于this.chooseD.bind(this, id),this.chooseD.bind(this, id)影响性能 */}
                        <div className='preview' id='pre1' onClick={() => this.chooseD(1)}>
                        </div>
                        <div className='preview' id='pre2' onClick={() => this.chooseD(2)}>
                        </div>
                        <div className='preview' id='pre3' onClick={() => this.chooseD(3)}>
                        </div>
                        <div className='preview' id='pre4' onClick={() => this.chooseD(4)}>
                        </div>
                        <div className='preview' id='pre5' onClick={() => this.chooseD(5)}>
                        </div>
                        <div className='preview' id='pre6' onClick={() => this.chooseD(6)}>
                        </div>
                        <div className='preview' id='pre7' onClick={() => this.chooseD(7)}>
                        </div>
                        <div className='preview' id='pre8' onClick={() => this.chooseD(8)}>
                        </div>
                        <div className='preview' id='pre9' onClick={() => this.chooseD(9)}>
                        </div>
                        <div className='preview' id='pre10' onClick={() => this.chooseD(10)}>
                        </div>
                        <div className='preview' id='pre11' onClick={() => this.chooseD(11)}>
                        </div>
                        <div className='preview' id='pre12' onClick={() => this.chooseD(12)}>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
