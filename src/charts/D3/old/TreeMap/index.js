import React, { Component } from 'react';
import D3Chart from '../D3Chart';
import draw from './vis';
import hover from './hover';
import select from './select';
import {animate} from './animation';

export default class TreeMap extends Component {

    // componentDidMount() {
    //     draw(this.props);
    // }

    // componentDidUpdate(preProps) {
    //     draw(this.props);
    // }

    render() {
        return (
            <D3Chart className='vis-treemap' classId='vis-treemap' draw={draw} hover={hover} select={select} animate={animate} {...this.props}/>
        )
    }
}
