import React, { Component } from 'react';
import {Button,Radio,Collapse,Divider } from 'antd';
// import html2canvas from 'html2canvas'

//import { directive } from '@babel/types';
// import {DownloadOutlined} from '@ant-design/icons';
const { Panel } = Collapse;




export default class Style extends Component {

    onChangeLayout=e=>{
        let{spec}=this.props;
        spec.style.layout=e.target.value;
        this.props.handleConfigureOk(spec);
    };

    onChangePictogram=event=>{
        let{spec}=this.props;
        spec.style.pictogram=event.target.value
        this.props.handleConfigureOk(spec);
    }

    // onSaveas=event=>{
    //     html2canvas(document.querySelector('.vis-pictorialchart'),{useCORS:true}).then(function (canvas) {
    //         //获取年月日作为文件名
    //         var timers=new Date();
    //         var fullYear=timers.getFullYear();
    //         var month=timers.getMonth()+1;
    //         var date=timers.getDate();
    //         var randoms=Math.random()+'';
    //         //年月日加上随机数
    //         var numberFileName=fullYear+''+month+date+randoms.slice(3,10);
    //         var imgData=canvas.toDataURL();
    //         //保存图片
    //         var saveFile = function(data, filename){
    //             var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    //             save_link.href = data;
    //             save_link.download = filename;

    //             var event = document.createEvent('MouseEvents');
    //             event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    //             save_link.dispatchEvent(event);
    //         };
    //         //最终文件名+文件格式
    //         var filename = numberFileName + '.png';
    //         saveFile(imgData,filename);
    //         //document.body.appendChild(canvas);  把截的图显示在网页上
    //     })
    // }
    

    render() {
        let {spec} =this.props;
        return (
            <div>
                <div>
                {/* <Row style={{height:50}}> */}
                    {/* <Col span={6}><h3 style={{marginTop:6}}>Data Binding:</h3></Col> */}
                {/* <Col span={18} >  */}
                <Divider>Choose the binding style</Divider>
                <Radio.Group value={spec.style.layout} onChange={this.onChangeLayout}>
                <Radio.Button value="unit">Unit</Radio.Button>
                <Radio.Button value="percent">Percent</Radio.Button>
                <Radio.Button value="area">Area</Radio.Button>
                <Radio.Button value="stacked">Stacked</Radio.Button>
                <Radio.Button value="length">Length</Radio.Button>
                
            </Radio.Group>
                {/* </Col> */}
                {/* </Row> */}
                </div>
                {/* <Button type="primary" onClick={this.onSaveas}>Primary</Button> */}

                <div>
                <Divider>Choose the pictogram</Divider>
                {/* <h3 style={{marginTop:6}}>Choose the pictogram:</h3> */}
                      
                <Collapse accordion>
                    <Panel header="People" key="1">
                    <Button type="" value="boy" style={{background:"url(" + require("./pictograms/People/People.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="girl" style={{background:"url(" + require("./pictograms/People/People1.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="oldman" style={{background:"url(" + require("./pictograms/People/People2.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="oldwoman" style={{background:"url(" + require("./pictograms/People/People3.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="man" style={{background:"url(" + require("./pictograms/People/People4.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="woman" style={{background:"url(" + require("./pictograms/People/People5.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="kid" style={{background:"url(" + require("./pictograms/People/people-kid.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="touch" style={{background:"url(" + require("./pictograms/People/people-hand.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="love" style={{background:"url(" + require("./pictograms/People/people-hand1.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="good" style={{background:"url(" + require("./pictograms/People/people-hand2.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    
                    </Panel>
                    <Panel header="Nature" key="2">
                    <Button type="" value="sun" style={{background:"url(" + require("./pictograms/Nature/Nature.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="cloudy" style={{background:"url(" + require("./pictograms/Nature/Nature1.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="rainy" style={{background:"url(" + require("./pictograms/Nature/Nature2.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="snowy" style={{background:"url(" + require("./pictograms/Nature/Nature3.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="waterdrop" style={{background:"url(" + require("./pictograms/Nature/Nature4.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="snow" style={{background:"url(" + require("./pictograms/Nature/Nature5.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="dog" style={{background:"url(" + require("./pictograms/Nature/Nature6.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    {/* <Button type="" value="car" style={{background:"url(" + require("./pictograms/Nature/Nature7.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/> */}
                    <Button type="" value="fire" style={{background:"url(" + require("./pictograms/Nature/Nature8.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="bird" style={{background:"url(" + require("./pictograms/Nature/Nature9.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="fish" style={{background:"url(" + require("./pictograms/Nature/Nature10.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="cat" style={{background:"url(" + require("./pictograms/Nature/Nature11.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="dogface" style={{background:"url(" + require("./pictograms/Nature/Nature12.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="catface" style={{background:"url(" + require("./pictograms/Nature/Nature13.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="tree" style={{background:"url(" + require("./pictograms/Nature/Nature14.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="flower" style={{background:"url(" + require("./pictograms/Nature/Nature15.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                 
                    </Panel>
                    <Panel header="Household" key="3">
                    <Button type="" value="computer" style={{background:"url(" + require("./pictograms/Household/Household.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="house" style={{background:"url(" + require("./pictograms/Household/Household1.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="cloth" style={{background:"url(" + require("./pictograms/Household/Household2.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="clock" style={{background:"url(" + require("./pictograms/Household/Household3.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="bag" style={{background:"url(" + require("./pictograms/Household/Household4.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="gift" style={{background:"url(" + require("./pictograms/Household/Household5.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="hat" style={{background:"url(" + require("./pictograms/Household/Household6.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="bulb" style={{background:"url(" + require("./pictograms/Household/Household7.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="tv" style={{background:"url(" + require("./pictograms/Household/Household8.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="shoe" style={{background:"url(" + require("./pictograms/Household/Household9.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="thermometer" style={{background:"url(" + require("./pictograms/Household/Household10.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                   
                    </Panel>
                    <Panel header="Biz & Tech & Education" key="4">
                    <Button type="" value="mail" style={{background:"url(" + require("./pictograms/BizTech/BizTech.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="coinc" style={{background:"url(" + require("./pictograms/BizTech/BizTech1.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="coind" style={{background:"url(" + require("./pictograms/BizTech/BizTech2.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="note" style={{background:"url(" + require("./pictograms/BizTech/BizTech3.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="setit" style={{background:"url(" + require("./pictograms/BizTech/BizTech4.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    {/* <Button type="" value="" style={{background:"url(" + require("./pictograms/BizTech/BizTech5.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/> */}
                    <Button type="" value="shoppingcart" style={{background:"url(" + require("./pictograms/BizTech/BizTech6.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="chat" style={{background:"url(" + require("./pictograms/BizTech/BizTech7.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="music" style={{background:"url(" + require("./pictograms/BizTech/BizTech8.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="info" style={{background:"url(" + require("./pictograms/BizTech/BizTech9.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="infoo" style={{background:"url(" + require("./pictograms/BizTech/BizTech10.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="building" style={{background:"url(" + require("./pictograms/BizTech/BizTech11.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="phone" style={{background:"url(" + require("./pictograms/BizTech/BizTech12.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="internet" style={{background:"url(" + require("./pictograms/BizTech/BizTech13.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="book" style={{background:"url(" + require("./pictograms/BizTech/BizTech14.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>

                   
                    </Panel>
                    <Panel header="Food & Drink" key="5">
                    <Button type="" value="knife" style={{background:"url(" + require("./pictograms/Food/Food.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="apple" style={{background:"url(" + require("./pictograms/Food/Food1.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="banana" style={{background:"url(" + require("./pictograms/Food/Food2.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="carrot" style={{background:"url(" + require("./pictograms/Food/Food3.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="coffee" style={{background:"url(" + require("./pictograms/Food/Food4.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="hamburger" style={{background:"url(" + require("./pictograms/Food/Food5.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="milk" style={{background:"url(" + require("./pictograms/Food/Food6.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="bread" style={{background:"url(" + require("./pictograms/Food/Food7.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="tomato" style={{background:"url(" + require("./pictograms/Food/Food8.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="wine" style={{background:"url(" + require("./pictograms/Food/Food9.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="juice" style={{background:"url(" + require("./pictograms/Food/Food10.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="water" style={{background:"url(" + require("./pictograms/Food/Food11.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    
                   
                    </Panel>
                    <Panel header="Transportation" key="6">
                    <Button type="" value="plane" style={{background:"url(" + require("./pictograms/Transportation/Transportation1.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="taxi" style={{background:"url(" + require("./pictograms/Transportation/Transportation2.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="ship" style={{background:"url(" + require("./pictograms/Transportation/Transportation3.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="bus" style={{background:"url(" + require("./pictograms/Transportation/Transportation4.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="carfront" style={{background:"url(" + require("./pictograms/Transportation/Transportation5.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="ambulance" style={{background:"url(" + require("./pictograms/Transportation/Transportation6.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="railway" style={{background:"url(" + require("./pictograms/Transportation/Transportation7.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="bicycle" style={{background:"url(" + require("./pictograms/Transportation/Transportation8.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="rocket" style={{background:"url(" + require("./pictograms/Transportation/Transportation9.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="tractor" style={{background:"url(" + require("./pictograms/Transportation/Transportation10.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="car" style={{background:"url(" + require("./pictograms/Transportation/Transportation11.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
                    <Button type="" value="truck" style={{background:"url(" + require("./pictograms/Transportation/Transportation14.png") + ") center no-repeat" ,width:50,height:50,marginRight:10,marginBottom:10}}  onClick={this.onChangePictogram}/>
               
                    </Panel>
                </Collapse>
            
                </div>
            </div>
          
        )
    }
}