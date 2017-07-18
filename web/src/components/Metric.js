import React, { Component }from 'react'
import ReactEcharts from 'echarts-for-react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export class Metric extends Component {

    render () {
        const { icon, title, content, subContend, footer , tips=[]} = this.props
        let tooltip = null
        if (tips.length > 0) {
            tooltip = <Tooltip id="tooltip">{tips.map((tip, index) => <p key={index}>{tip}</p>)}</Tooltip>
        }else {
            tooltip = <div></div>
        }
        return (
            <div className="metric">
                <div style={{marginBottom:'15px'}}>
                    <span className={icon} style={{fontSize: '1.5em'}}></span>
                    <span style={{fontSize: '1.5em'}}>&nbsp;{title}</span>
                </div>
                <div style={{textAlign:'center',fontSize: '2.5em',fontWeight:'bold'}}>
                    {content}
                </div>
                <div style={{textAlign:'center',fontSize: '1.3em',color:'gray',marginBottom:'35px'}}>
                    {subContend}
                </div>
                <div style={{textAlign:'center',fontSize: '1em',color:'gray', position: 'absolute', bottom: '5px', width:'100%'}}>
                    {tips.length > 0 ? (
                        <OverlayTrigger placement="right" overlay={tooltip}>
                            <span>{footer}</span>
                        </OverlayTrigger>
                    ):(footer)}
                </div>
            </div>
        )
    }
}

export class MetricChart extends Component {

    render () {
        const {option} = this.props
        return (
            <div className="metric">
                <div style={{marginTop:'30px', marginBottom:'15px', float:'left', marginLeft:'0px', width:'100%'}}>
                    <ReactEcharts
                        option={option}
                        notMerge={true}
                        lazyUpdate={true}
                        style={{height:'150px', width:'100%'}}
                    />
                </div>
            </div>
        )
    }
}

export class MetricWithChartInside extends Component {

    render () {
        const { icon, title, footer, option} = this.props
        return (
            <div className="metric">
                <div style={{marginBottom:'0px'}}>
                    <span className={icon} style={{fontSize: '1.5em'}}></span>
                    <span style={{fontSize: '1.5em'}}>&nbsp;{title}</span>
                </div>
                <div style={{marginBottom:'0px', float:'left', marginLeft:'0px', width:'100%'}}>
                    <ReactEcharts
                        option={option}
                        notMerge={true}
                        lazyUpdate={true}
                        style={{height:'130px', width:'100%'}}
                    />
                </div>
                <div style={{textAlign:'center',fontSize: '1em',color:'gray'}}>
                    {footer}
                </div>
            </div>
        )
    }
}

const ONEHOUR = 60*60
/*
const HALFDAY  = 12*60*60
const ONEDAY  = 24*60*60
const THREEDAYS  = 3*24*60*60
const ONEWEEK  = 7*24*60*60
*/
export class MetricForHost extends Component {

    getInitialState() {
        return {
            title: this.props.title,
            period: ONEHOUR,
            dev:[],
            currentDev:'',
            hostname: this.props.hostname,
            measurement: this.props.measurement,
            measure: this.props.measure,
            data: []
        }
    }

    render() {
        return (
            <div>
                play
            </div>
        )
    }
}
