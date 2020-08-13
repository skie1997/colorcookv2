import React, { Component,PureComponent } from 'react';
import {  List, Divider } from 'antd';
import ChartCard from '@/components/ChartCard';
import ChartCategory from '@/constants/ChartCategory';
import './charttab.css';
import {d3Charts} from './chartList';
import _ from 'lodash';


export default class ChartTab extends PureComponent {
    static defaultProps = {
      cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
      rowHeight: 100,
    };
    constructor(props) {
        super(props);
        this.state = {
            activeKey: ChartCategory.VEGALITE,
            widgets: []
        }
        // this.handlechart = this.handlechart.bind(this)
    }

    // handlechart(charttype) {
    //     let dataindex = 0;
    //     console.log('this.props',this.props.switchData(2))
    //     if (charttype === 'scatter plot') {
    //         this.props.switchData(1); //countrys.csv
    //         dataindex = 1
    //     }else if(charttype === 'map'){
    //         this.props.switchData(2); //china.csv
    //         dataindex = 2
    //     }else{
    //         this.props.switchData(0); //car.csv
    //     }

    //   const size = {
    //     x: (this.props.widgets.length * 3) % (this.state.colos || 12),
    //     y: Infinity, // puts it at the bottom
    //     w: 3,
    //     h: 2,
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
    //   let newWidgets = _.cloneDeep(this.props.widgets)
    //   this.props.addChart(newWidgets.concat({...size,...type,...dataIndex,...category}));
    //   this.setState(
    //     {
    //       widgets: this.state.widgets.concat({
    //         ...size,
    //         ...type,
    //         ...dataIndex,
    //         ...category,
    //       }),
    //     },
    //   );
    // };
  

    render() {
        return (
            // <div className="pane charttab" style={{ height: '242px', marginBottom: '8px'}}>
            <div style={{ height: '242px', marginBottom: '8px'}}>
                    <div className='header' >Charts</div>
                        <List
                            style={{marginTop: '20px', backgroundColor:'#fff',border: '0px solid #d9d9d9'}} 
                            grid={{ gutter: 17, column: 3 }}
                            dataSource={d3Charts}
                            renderItem={item => (
                            <List.Item style={{padding: '1px'}}>
                                {/* <LazyLoad> */}
                                    <ChartCard 
                                        chartcategory={ChartCategory.D3}
                                        // chartsrc={item.src} 
                                        charttype={item.chart} 
                                        chartname={item.name}
                                        // handlechart = {this.handlechart}
                                        {...this.props}
                                    />
                                {/* </LazyLoad> */}
                            </List.Item>
                            )}
                        />    
            </div>
        )
    }
}
