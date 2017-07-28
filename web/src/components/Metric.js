import React, { Component }from 'react'
import ReactEcharts from 'echarts-for-react';
import { OverlayTrigger, Tooltip ,Form, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import * as ProphetApi from '../utils/ProphetApi'

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

export class MetricForHost extends Component {

    constructor(props) {
        super(props)
        this.state = {
            title: this.props.title,
            selectedRange: "30m",
            Ranges: ["5m", "15m", "30m", "1h", "3h", "6h", "12h", "24h"],
            devs:[],
            selectedDev:'',
            hostname: this.props.hostname,
            measurement: this.props.measurement,
            measure: this.props.measure,
            keyName:this.props.keyName,
            data: [],
            config: {}
        }
    }

    handleDevChange = (event)=> {
        this.setState({selectedDev: event.target.value}, this.loaddata);
    }

    handlePeriodChange = (event)=> {
        this.setState({selectedRange: event.target.value}, this.loaddata);
    }

    componentWillReceiveProps(props) {
        this.setState({hostname: props.hostname}, this.loaddata)
    }

    loaddata = () => {
        let queryDevMetricString = `SELECT mean("${this.state.measure}") FROM "${this.state.measurement}" WHERE "${this.state.keyName}" = '${this.state.selectedDev}' AND "host" = '${this.state.hostname}' AND time > now() - ${this.state.selectedRange} GROUP BY time(${this.calGroupTime(this.state.selectedRange)})`
        ProphetApi.queryDB(queryDevMetricString).then((data) => {
            this.setState({data: data.filter((x) => x[1] != null)})
        }).catch((r) => {
            console.log("setState err")
            console.log(r)})
    }

    calGroupTime = (range) => {
        let time = ''
        switch (range) {
            case '3h':
                time = '15s';
                break;
            case '6h':
                time = '30s';
                break;
            case '12h':
                time = '1m';
                break;
            case '24':
                time = '2m';
                break;
            default:
                time = '10s'
        }
        return time
    }

    buildConfig = () => {
        return {
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top:'15%',
                containLabel: true
            },
            legend: {
                data: [this.state.measure],
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    params = params[0];
                    var date = new Date(params.value[0])
                    return date.toTimeString() + '<br/>' + params.value[1].toFixed(2)
                },
                axisPointer: {
                    animation: false
                }
            },
            color: ['#0000FF', '#FF0000', '#FFFF00'],
            xAxis: {
                type: 'time',
                splitLine: {
                    show: true
                }
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%'],
                splitLine: {
                    show: true
                }
            },
            series: [{
                name: this.state.measure,
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: this.state.data
            }]
        }
    }
    componentDidMount() {
        let queryString = `SHOW TAG VALUES FROM "${this.state.measurement}" WITH KEY = "${this.state.keyName}" WHERE "host" = '${this.state.hostname}'`
        ProphetApi.queryDB(queryString).then((devs) => {
            if (devs.length > 0){
                this.setState({devs: devs, selectedDev: devs[0][1]}, this.loaddata)
            }
        })
    }


    render() {
        return (
            <div style={{height: '50vh', marginTop:'15px', backgroundColor:'white', padding:'20px 10px 10px 20px'}}>
                <span style={{fontStyle:'bold', fontSize:'1.5em'}}>{this.state.title}</span>
                <Form inline style={{float: 'right'}}>
                    <FormGroup controlId="DevSelect">
                        <ControlLabel>Dev</ControlLabel>
                        &nbsp;&nbsp;
                        <FormControl componentClass="select" value={this.state.selectedDev} onChange={this.handleDevChange} bsSize="small">
                            {this.state.devs.map((item, index) => (
                                    <option key={index}>{item[1]}</option>
                                )
                            )}
                        </FormControl>
                    </FormGroup>

                    <FormGroup controlId="RangeSelect" style={{marginLeft:'20px'}}>
                        <ControlLabel>Range</ControlLabel>
                        &nbsp;&nbsp;
                        <FormControl componentClass="select" value={this.state.selectedRange} onChange={this.handlePeriodChange} bsSize="small">
                            {this.state.Ranges.map((item, index) => (
                                    <option key={index}>{item}</option>
                                )
                            )}
                        </FormControl>
                    </FormGroup>
                </Form>
                <ReactEcharts
                    option={this.buildConfig()}
                    notMerge={true}
                    lazyUpdate={true}
                    style={{height:'35vh', width:'100%'}}
                />
            </div>
        )
    }
}

export class MetricForHostWithOutDev extends Component {

    constructor(props) {
        super(props)
        this.state = {
            title: this.props.title,
            selectedRange: "30m",
            Ranges: ["5m", "15m", "30m", "1h", "3h", "6h", "12h", "24h"],
            hostname: this.props.hostname,
            measurement: this.props.measurement,
            measure: this.props.measure,
            data: [],
            config: {}
        }
    }

    handlePeriodChange = (event)=> {
        this.setState({selectedRange: event.target.value}, this.loaddata);
    }

    componentWillReceiveProps(props) {
        this.setState({hostname: props.hostname}, this.loaddata)
    }

    loaddata = () => {
        let queryMetricString = `SELECT mean("${this.state.measure}") FROM "${this.state.measurement}" WHERE "host" = '${this.state.hostname}' AND time > now() - ${this.state.selectedRange} GROUP BY time(${this.calGroupTime(this.state.selectedRange)})`
        ProphetApi.queryDB(queryMetricString).then((data) => {
            this.setState({data: data.filter((x) => x[1] != null)})
        })
    }

    calGroupTime = (range) => {
        let time = ''
        switch (range) {
            case '3h':
                time = '15s';
                break;
            case '6h':
                time = '30s';
                break;
            case '12h':
                time = '1m';
                break;
            case '24':
                time = '2m';
                break;
            default:
                time = '10s'
        }
        return time
    }

    buildConfig = () => {
        return {
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top:'15%',
                containLabel: true
            },
            legend: {
                data: [this.state.measure],
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    params = params[0];
                    var date = new Date(params.value[0])
                    return date.toTimeString() + '<br/>' + params.value[1].toFixed(2)
                },
                axisPointer: {
                    animation: false
                }
            },
            color: ['#0000FF', '#FF0000', '#FFFF00'],
            xAxis: {
                type: 'time',
                splitLine: {
                    show: true
                }
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%'],
                splitLine: {
                    show: true
                }
            },
            series: [{
                name: this.state.measure,
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: this.state.data
            }]
        }
    }
    componentDidMount() {
        this.loaddata()
    }


    render() {
        return (
            <div style={{height: '50vh', marginTop:'15px', backgroundColor:'white', padding:'20px 10px 10px 20px'}}>
                <span style={{fontStyle:'bold', fontSize:'1.5em'}}>{this.state.title}</span>
                <Form inline style={{float: 'right'}}>
                    <FormGroup controlId="RangeSelect" style={{marginLeft:'20px'}}>
                        <ControlLabel>Range</ControlLabel>
                        &nbsp;&nbsp;
                        <FormControl componentClass="select" value={this.state.selectedRange} onChange={this.handlePeriodChange} bsSize="small">
                            {this.state.Ranges.map((item, index) => (
                                    <option key={index}>{item}</option>
                                )
                            )}
                        </FormControl>
                    </FormGroup>
                </Form>
                <ReactEcharts
                    option={this.buildConfig()}
                    notMerge={true}
                    lazyUpdate={true}
                    style={{height:'35vh', width:'100%'}}
                />
            </div>
        )
    }
}
