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

    loaddata = () => {
        var to = Date.parse(new Date());
        var from = to - 10*60*1000 //latest ten minites
        var twoHours = 2*60*60*1000 //2 hours
        var fetchHealthpgs = ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_pgmap_state", "healthpgs", String(from), String(to))
        var fetchErrorpg = ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_pgmap_state", "errorpg", String(from), String(to))
        var fetchWarningpg = ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_pgmap_state", "warningpg", String(from), String(to))
        Promise.all([fetchHealthpgs, fetchErrorpg,fetchWarningpg]).then((results) => {
            var latestHealthpg = results[0].filter((x) => x[1] != null).pop()
            var latestErrorpg = results[1].filter((x) => x[1] != null).pop()
            var latestWarningpg = results[2].filter((x) => x[1] != null).pop()
            this.setState({healthpgs:latestHealthpg[1],errorpgs:latestErrorpg[1], warningpgs:latestWarningpg[1]})
        })

        var fetchNumOsds = ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_osdmap", "num_osds", String(from), String(to))
        var fetchNumUpOsds = ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_osdmap", "num_up_osds", String(from), String(to))
        var fetchNumInOsds = ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_osdmap", "num_in_osds", String(from), String(to))
        Promise.all([fetchNumOsds, fetchNumUpOsds,fetchNumInOsds]).then((results) => {
            var latestOsdNum = results[0].filter((x) => x[1] != null).pop()
            var latestUpOsdNum = results[1].filter((x) => x[1] != null).pop()
            var latestInOsdNum = results[2].filter((x) => x[1] != null).pop()
            this.setState({osdALL:latestOsdNum[1],osdUp:latestUpOsdNum[1], osdIn:latestInOsdNum[1]})
        })

        var fetchTotalUsedBytes = ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_usage", "total_used_bytes", String(from), String(to))
        var fetchTotalAvailBytes = ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_usage", "total_avail_bytes", String(from), String(to))
        Promise.all([fetchTotalUsedBytes, fetchTotalAvailBytes]).then((results) => {
            var latestTotalUsedBytes = results[0].filter((x) => x[1] != null).pop()
            var latestTotalAvailBytes= results[1].filter((x) => x[1] != null).pop()
            this.setState({usedBytes:latestTotalUsedBytes[1],freeBytes:latestTotalAvailBytes[1]})
        })

        var fetchWriteOpPerSec = ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_pool_stats", "write_op_per_sec", String(to-twoHours), String(to))
        var fetchReadOpPerSec = ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_pool_stats", "write_op_per_sec", String(to-twoHours), String(to))
        Promise.all([fetchWriteOpPerSec, fetchReadOpPerSec]).then((results) => {
            var writeOpPerSec = results[0].filter((x) => x[1] != null)
            var latestWriteOpPerSec = writeOpPerSec.pop()
            var readOpPerSec = results[1].filter((x) => x[1] != null)
            var latestReadOpPerSec= readOpPerSec.pop()
            this.setState({writeOpsL:latestWriteOpPerSec[1],readOpsL:latestReadOpPerSec[1], writeOps:writeOpPerSec, readOps:readOpPerSec})
        })
    }

    componentDidMount() {
        this.loaddata()
        this.timer = setInterval(() => this.loaddata(), 30000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
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
                    var date = new Date(params.value[0])
                    return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '  ' + params.value[1];
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