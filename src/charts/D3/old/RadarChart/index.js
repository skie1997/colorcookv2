import React, { Component } from 'react';
import draw from './vis';
import hover from './hover';
import select from './select';
import {animate} from './animation';
import D3Chart from '../D3Chart';

export default class RadarChart extends Component {

    componentDidMount() {
        draw(this.props);
    }

    componentDidUpdate(preProps) {
        draw(this.props);
    }

    render() {
        return (
            <D3Chart className='vis-radarchart'  chartId={'vis-radarchart'} draw={draw} hover={hover} select={select} animate={animate} {...this.props}/>
        )
    }
}
