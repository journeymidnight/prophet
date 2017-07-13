import React , { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap'
import { Metric, MetricChart, MetricWithChartInside } from './components/Metric'
import * as ProphetApi from './utils/ProphetApi'

class Dashboard extends Component {
    state = {
        health: true,
        osdIn: 0,
        osdUp: 0,
        osdALL: 0,
        monIn: 0,
        monAll: 0,
        pools: 0,
        pgALL: 0,
        healthpgs: 0,
        warningpgs: 0,
        errorpgs: 0,
        readBps: [],
        readOps: [],
        writeOps: [],
        writeBps: [],
        readBpsL: 0,
        readOpsL: 0,
        writeOpsL: 0,
        writeBpsL: 0,
        usedBytes: 0,
        freeBytes: 0,
        hosts: 0,
        osds: 0,

    }
    componentDidMount() {
        var to = Date.parse(new Date());
        var from = to - 10*60*1000 //latest ten minites
        var twoHours = 2*60*60*1000 //2 hours
        ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_pgmap_state", "healthpgs", String(from), String(to)).then(
            (array) => {
                var temp = array.filter((x) => x[1] != null)
                var lastItem = temp.pop()
                console.log("health pg num:", lastItem[1])
                this.setState({healthpgs:lastItem[1]})
                return lastItem
            }
        )
        ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_pgmap_state", "errorpg", String(from), String(to)).then(
            (array) => {
                var temp = array.filter((x) => x[1] != null)
                var lastItem = temp.pop()
                console.log("error pg num:", lastItem[1])
                this.setState({errorpgs:lastItem[1]})
                return lastItem
            }
        )
        ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_pgmap_state", "warningpg", String(from), String(to)).then(
            (array) => {
                var temp = array.filter((x) => x[1] != null)
                var lastItem = temp.pop()
                console.log("warningpg pg num:", lastItem[1])
                this.setState({warningpgs:lastItem[1]})
                return lastItem
            }
        )
        ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_osdmap", "num_osds", String(from), String(to)).then(
            (array) => {
                var temp = array.filter((x) => x[1] != null)
                var lastItem = temp.pop()
                console.log("num_osds num:", lastItem[1])
                this.setState({osdALL:lastItem[1]})
                return lastItem
            }
        )

        ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_osdmap", "num_up_osds", String(from), String(to)).then(
            (array) => {
                var temp = array.filter((x) => x[1] != null)
                var lastItem = temp.pop()
                console.log("num_up_osds num:", lastItem[1])
                this.setState({osdUp:lastItem[1]})
                return lastItem
            }
        )
        ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_osdmap", "num_in_osds", String(from), String(to)).then(
            (array) => {
                var temp = array.filter((x) => x[1] != null)
                var lastItem = temp.pop()
                console.log("num_in_osds num:", lastItem[1])
                this.setState({osdIn:lastItem[1]})
                return lastItem
            }
        )
        ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_usage", "total_used_bytes", String(from), String(to)).then(
            (array) => {
                var temp = array.filter((x) => x[1] != null)
                var lastItem = temp.pop()
                console.log("total_used_bytes:", lastItem[1])
                this.setState({usedBytes:lastItem[1]})
                return lastItem
            }
        )
        ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_usage", "total_avail_bytes", String(from), String(to)).then(
            (array) => {
                var temp = array.filter((x) => x[1] != null)
                var lastItem = temp.pop()
                console.log("total_avail_bytes:", lastItem[1])
                this.setState({freeBytes:lastItem[1]})
                return lastItem
            }
        )
        ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_pool_stats", "write_op_per_sec", String(to-twoHours), String(to)).then(
            (array) => {
                var temp = array.filter((x) => x[1] != null)

                this.setState({writeOps:temp})
                var lastItem = temp.pop()
                this.setState({writeOpsL:lastItem[1]})
                console.log("write_op_per_sec latest:", temp)
                return temp
            }
        )
        ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_pool_stats", "read_op_per_sec", String(to-twoHours), String(to)).then(
            (array) => {
                var temp = array.filter((x) => x[1] != null)
                this.setState({readOps:temp})
                var lastItem = temp.pop()
                this.setState({readOpsL:lastItem[1]})
                console.log("read_op_per_sec latest:", temp)
                return temp
            }
        )
    }
    render () {
        var osdOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            color: ['#0000FF','#FFFF00','#FF0000'],
            legend: {
                data: ['HEALTH', 'WARNING', 'ERROR'],
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top:'15%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data: ['']
            },
            series: [
                {
                    name: 'HEALTH',
                    type: 'bar',
                    data: [this.state.healthpgs],
                },
                {
                    name: 'WARNING',
                    type: 'bar',
                    data: [this.state.warningpgs]
                },
                {
                    name: 'ERROR',
                    type: 'bar',
                    data: [this.state.errorpgs]
                }
            ]
        }

        var usageOption = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            color: ['#FF0000', '#0000FF'],
            series : [
                {
                    name: 'capacity usage',
                    type: 'pie',
                    radius : '70%',
                    center: ['50%', '60%'],
                    data:[
                        {value:this.state.usedBytes, name:'used'},
                        {value:this.state.freeBytes, name:'free'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }

        var iopsOption = {
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top:'15%',
                containLabel: true
            },
            legend: {
                data: ['read ops', 'write ops'],
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    params = params[0];
                    var date = new Date(params.name);
                    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
                },
                axisPointer: {
                    animation: false
                }
            },
            color: ['#0000FF','#FFFF00','#FF0000'],
            xAxis: {
                type: 'time',
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%'],
                splitLine: {
                    show: false
                }
            },
            series: [{
                name: 'read ops',
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: this.state.readOps
            },
                {
                    name: 'write ops',
                    type: 'line',
                    showSymbol: false,
                    hoverAnimation: false,
                    data: this.state.writeOps
                }]
        }
        return (
            <Grid fluid>
                <Row className="gutter-10">
                    <Col md={3} sm={6}>
                        <Metric icon="glyphicon glyphicon-heart"
                                title="HEALTH"
                                content="NA"
                                subContend="8 secs ago"
                                footer="1 warning"/>
                    </Col>
                    <Col md={3} sm={6}>
                        <Metric icon="glyphicon glyphicon-hdd"
                                title="OSD"
                                content={`${this.state.osdIn}/${this.state.osdUp}`}
                                subContend="In & Up"
                                footer=""/>
                    </Col>
                    <Col md={3} sm={6}>
                        <Metric icon="glyphicon glyphicon-eye-open"
                                title="MONITOR"
                                content="NA/NA"
                                subContend="Quorum"
                                footer=""/>
                    </Col>
                    <Col md={3} sm={6}>
                        <Metric icon="glyphicon glyphicon-tint"
                                title="POOLS"
                                content="NA"
                                subContend="Active"
                                footer=""/>
                    </Col>
                </Row>
                <Row className="gutter-0">
                    <Col md={4} sm={12}>
                        <Metric icon="glyphicon glyphicon-th"
                                title="PLACEMENT GROUP STATUS"
                                content={`${this.state.healthpgs}/${this.state.healthpgs+this.state.errorpgs+this.state.warningpgs}`}
                                subContend="Active & Clean"
                                footer="" />

                    </Col>

                    <Col md={8} sm={12}>
                        <MetricChart option={osdOption} />
                    </Col>

                </Row>
                <Row className="gutter-10">
                    <Col md={6} sm={12}>
                        <Row className="gutter-0">
                            <Col md={4} sm={12}>
                                <Metric icon="glyphicon glyphicon-sort"
                                        title="IOPS"
                                        content={`${this.state.writeOpsL+this.state.readOpsL}`}
                                        subContend="Reads + Writes"
                                        footer="" />
                            </Col>
                            <Col md={8} sm={12}>
                                <MetricChart option={iopsOption} />
                            </Col>
                        </Row>
                    </Col>
                    <Col md={3} sm={6}>
                        <MetricWithChartInside
                            icon="glyphicon glyphicon-sort"
                            title="USAGE"
                            option={usageOption}
                            footer={`Total:${this.state.usedBytes+this.state.freeBytes} Bytes`} />
                    </Col>
                    <Col md={3} sm={6}>
                        <Metric icon="glyphicon glyphicon-th"
                                               title="HOSTS"
                                               content="NA"
                                               subContend="Reporting"
                                               footer="NA/2OSD" />
                    </Col>
                </Row>
            </Grid>
        )
    }
}
export default Dashboard;