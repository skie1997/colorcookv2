import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
import { DropTarget } from 'react-dnd';
import DNDType from '@/constants/DNDType';
import Color from '@/constants/Color';
import _ from 'lodash'
import './shelf.css';
import colorStyle_light from '../../../../colorStyle_light';

const boxTarget = {
	drop: (props) => ({ 
        name: props.channel.name,
        isEncoding: props.channel.isEncoding,
    })
}

class Shelf extends Component {

    constructor(props) {
        super(props);
        this.removeEncoding = this.removeEncoding.bind(this);
    }

    removeEncoding() {
        //这里用深拷贝，避免立马更新
        const newSpec = this.props.chartMode? _.cloneDeep(this.props.generateSpec): _.cloneDeep(this.props.editSpec);

        console.log('newSpec-shelf', newSpec)
        
        delete newSpec["encoding"][this.props.channel.name].field;
        delete newSpec["encoding"][this.props.channel.name].type;

        console.log('newSpec-shelf', newSpec)

        const newChannels = this.props.chartMode? _.cloneDeep(this.props.generateChannels):_.cloneDeep(this.props.editChannels);
        newChannels[this.props.channel.name]['isEncoding'] = false;


        // newSpec["encoding"][this.props.channel.name]["field"] = item.field.name;
        // newSpec["encoding"][this.props.channel.name]["type"] = item.field.type;
        // console.log('isEncoded',dropResult.isEncoded)
        if(this.props.chartMode){
            this.props.changeGenerateSpec(newSpec);
            this.props.changeGenerateChannels(newChannels)
        }else{
            this.props.changeEditSpec(newSpec);
            this.props.changeEditChannels(newChannels)
        }
        this.props.removeEncoding(this.props.channel.name, this.props.channel.field)
    }

    render() {
        const { canDrop, isOver, connectDropTarget } = this.props;
        const isActive = canDrop && isOver;
        const isAvailable = this.props.dropAvailable;
        let backgroundColor = this.props.channel.isEncoding ? Color.LIGHT_BLUE : '#fff';
        if (!isAvailable) {
            backgroundColor = 'darkgrey';
        }
		else if (isActive) {
			backgroundColor = Color.LIGHT_BLUE;
		} 
		else if (canDrop) {
			backgroundColor = Color.BLUE;
        }

        console.log('shlfchannels',this.props.channel)
        console.log('this.props.generateSpec',this.props.chartMode)
        console.log('this.props.generateSpec',this.props)

        const encoding = this.props.chartMode? this.props.generateSpec['encoding']: this.props.editSpec['encoding'];


        
        return connectDropTarget(
            <div>
                <Row className="shelf">
                    <Col span={4} className="channelName">{this.props.channel.name}</Col>
                    <Col span={ this.props.channel.isEncoding ? 14 : 18} className="channelSlot" 
                    style={{ backgroundColor: backgroundColor, color: this.props.channel.isEncoding ? "#ffffff" : "#37415C",borderRadius:this.props.channel.isEncoding ?'0px 0px 0px 0px':'0px 5px 5px 0px'}}>
                        {this.props.channel.isEncoding && encoding[this.props.channel.name].field!== undefined? encoding[this.props.channel.name].field : 'drop field here'}</Col>
                    <Col span={ this.props.channel.isEncoding ? 4 : 0} className="channelSlot" style={{ backgroundColor,borderRadius:'0px 5px 5px 0px' }}>
                        <Button shape="circle" type="link" ghost size="small" icon="close" onClick={this.removeEncoding}/>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default DropTarget(
	DNDType.DND_MAPPING,
	boxTarget,
	(connect, monitor) => ({
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
		canDrop: monitor.canDrop()
	})
)(Shelf);