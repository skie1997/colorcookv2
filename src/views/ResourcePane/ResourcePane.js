import React, { Component } from 'react';
import ChartTab from './ChartTab/ChartTab';
import ChannelsTab from './ChannelsTab/ChannelsTab';
import './resourcepane.css';


export default class ResourcePane extends Component {

  constructor(props) {
    super(props);
  }



  render() {
    return (
      
      <div className="card-container" style={{height:this.props.contentHeight+"px"}}>
        <div className="pane" >
            <ChartTab {...this.props} />
            <ChannelsTab {...this.props} />
        </div>
      </div>
    )
  }
}
