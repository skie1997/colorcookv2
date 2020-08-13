import React, { Component } from 'react';
import './field.css';
import _ from 'lodash'
import { DragSource } from 'react-dnd';
import DNDType from '@/constants/DNDType';

const boxSource = {


	beginDrag(props) {
		console.log('begin-drag',props)
		
		return {
			field: props.field,
			// specstyle: props.currentVis.spec.style
		}
	},
	endDrag(props, monitor) {
		console.log('end-drag',props)
		const item = monitor.getItem();
		const dropResult = monitor.getDropResult();
		
		console.log('props',props)
		console.log('props-chartMode',props.chartMode)
		console.log('props',this.props)

		//这里用浅拷贝就能更新，后面的props更新方法无效
		const newSpec = props.chartMode? {...props.generateSpec}:{...props.editSpec};
		const newChannels = props.chartMode? {...props.generateChannels} :{...props.editChannels};
		
				
		if (dropResult) {
			newSpec["encoding"][dropResult.name]["field"] = item.field.name;
			newSpec["encoding"][dropResult.name]["type"] = item.field.type;

			newChannels[dropResult.name]['isEncoding'] = true;

			

			
			if(props.chartMode){
				//运行这里页面没刷新
				props.changeGenerateSpec(newSpec);
				props.changeGenerateChannels(newChannels);

				// console.log('newChannels-chartmode',this.props.gnerateChannels)
				// console.log('isEncoded',dropResult.isEncoded)
			}else{
				props.changeEditSpec(newSpec);
				console.log('update-field',newSpec)
				props.changeEditChannels(newChannels);
				
			}
			//运行这里，页面刷新了
			props.encoding(dropResult.name, item.field, dropResult.isEncoded);
			console.log('newChannels-fields',props.editSpec? props.editSpec: 'false')
			console.log('newChannels-fields',props.editChannels)

			
		}
		return props;
	},
}

class Field extends Component {

    render() {
		const { connectDragSource } = this.props;
        return connectDragSource(
            <div className="field">
				<div style={{display: "inline-block"}}>{this.props.field.name}</div>
            </div>
        )
    }
}

export default DragSource(
    DNDType.DND_MAPPING,
    boxSource,
	(connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging()
	}),
)(Field)
