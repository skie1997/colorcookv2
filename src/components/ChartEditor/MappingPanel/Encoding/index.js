import React, { Component } from 'react';
import { Divider, Select } from 'antd';
import Shelf from '../Shelf';
const { Option } = Select;

export default class Encoding extends Component {
    

    changeAggregation = (value) => {
        this.props.changeAggregation(this.aggregatedChannel, value);
    }

    render() {
        const shelves = [];
        const animationShelves = [];

        const aggregationSelector = (method) => {
            return <div>
                <Divider>Aggregation: {this.aggregatedChannel}</Divider>
                <Select defaultValue={method} size="small" style={{ width: 200, marginLeft: 8 }} onChange={this.changeAggregation}>
                    <Option value={"average"}>Average</Option>
                    <Option value={"max"}>Max</Option>
                    <Option value={"min"}>Min</Option>
                    <Option value={"sum"}>Sum</Option>
                </Select>
            </div>
        }
        let hasAggregation = false;
        this.aggregatedChannel = "";
        
        const channels = this.props.chartMode? this.props.generateChannels:this.props.editChannels;
        // console.log('channels-encoding',channels);
        // console.log('channels-encoding',this.props.generateChannels);
        // console.log('channels-encoding',this.props.editChannels);

        // if(this.props.chartMode){
        //     channels = this.props.generateChannels;
        // }else if(this.props.channels){
        //     channels = this.props.channels;
        // }

            for (const channel in channels) {
        
                // console.log('this.props.widgets[this.props.selectChartIndex].spec.encoding',channel)
                // let channeldata = {name: channel, isEncoded: false}
                // if ("aggregation" in this.props.channels[channel]) {
                //     hasAggregation = true;
                //     this.aggregatedChannel = channel;
                // }
                // if (this.props.channels[channel].animation) {
                //     animationShelves.push(<Shelf key={channel} channel={this.props.channels[channel]} dropAvailable={true} {...this.props}/>);
                // } else {
                    shelves.push(<Shelf key={channel} channel={channels[channel]} dropAvailable={true} {...this.props}/>);
                // }
            }
       
        return (
            <div style={{height: '165px', overflow: 'auto'}}>
                <div style={{marginTop: '-7px'}}>
                    {shelves}
                    {/* {hasAggregation?aggregationSelector(this.props.channels[this.aggregatedChannel].aggregation):null}
                    {animationShelves.length>0?<Divider>Animation Channels</Divider>:null}
                    {animationShelves} */}
                </div>
            </div>
        )
    }
}
