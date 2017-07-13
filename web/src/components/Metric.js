import React, { Component }from 'react'
import ReactEcharts from 'echarts-for-react';

export class Metric extends Component {

    render () {
        const { icon, title, content, subContend, footer } = this.props
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
                <div style={{textAlign:'center',fontSize: '1em',color:'gray'}}>
                    {footer}
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