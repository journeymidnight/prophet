import React , { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap'
import { Metric, MetricChart, MetricWithChartInside } from './components/Metric'
import * as ProphetApi from './utils/ProphetApi'
var unit = require('./utils/Unit');

class Dashboard extends Component {
    state = {
        healthStatus: "",
        healthSummary: [],
        osdIn: 0,
        osdUp: 0,
        osdALL: 0,
        monDown: 0,
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
        hosts: 0
    }

    loaddata = () => {
        var to = Date.parse(new Date());
        var twoHours = 2 * 60 * 60 * 1000 //2 hours
        var fetchHealthpgs = ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_pgmap_state", "healthpgs", "", "", true)
        var fetchErrorpg = ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_pgmap_state", "errorpg", "", "", true)
        var fetchWarningpg = ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_pgmap_state", "warningpg", "", "", true)
        Promise.all([fetchHealthpgs, fetchErrorpg, fetchWarningpg]).then((results) => {
            var latestHealthpg = results[0]
            var latestErrorpg = results[1]
            var latestWarningpg = results[2]
            console.log("result", latestHealthpg, latestErrorpg, latestWarningpg)
            this.setState({
                healthpgs: latestHealthpg[0][1],
                errorpgs: latestErrorpg[0][1],
                warningpgs: latestWarningpg[0][1]
            })
        }).catch((r) => {
            console.log("fetchmetric err")
            console.log(r)
        })

        var fetchNumOsds = ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_osdmap", "num_osds", "", "", true)
        var fetchNumUpOsds = ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_osdmap", "num_up_osds", "", "", true)
        var fetchNumInOsds = ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_osdmap", "num_in_osds", "", "", true)
        Promise.all([fetchNumOsds, fetchNumUpOsds, fetchNumInOsds]).then((results) => {
            var latestOsdNum = results[0]
            var latestUpOsdNum = results[1]
            var latestInOsdNum = results[2]
            this.setState({osdALL: latestOsdNum[0][1], osdUp: latestUpOsdNum[0][1], osdIn: latestInOsdNum[0][1]})
        }).catch((r) => {
            console.log("fetchmetric err")
            console.log(r)
        })

        var fetchTotalUsedBytes = ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_usage", "total_used_bytes", "", "", true)
        var fetchTotalAvailBytes = ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_usage", "total_avail_bytes", "", "", true)
        Promise.all([fetchTotalUsedBytes, fetchTotalAvailBytes]).then((results) => {
            var latestTotalUsedBytes = results[0]
            var latestTotalAvailBytes = results[1]
            this.setState({usedBytes: latestTotalUsedBytes[0][1], freeBytes: latestTotalAvailBytes[0][1]})
        }).catch((r) => {
            console.log("fetchmetric err")
            console.log(r)
        })

        var fetchWriteOpPerSec = ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_pool_stats", "write_op_per_sec", String(to - twoHours), String(to))
        var fetchReadOpPerSec = ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_pool_stats", "read_op_per_sec", String(to - twoHours), String(to))
        Promise.all([fetchWriteOpPerSec, fetchReadOpPerSec]).then((results) => {
            var writeOpPerSec = results[0].filter((x) => x[1] != null).map((x)=> [x[0],parseFloat(x[1].toFixed(2))])//get rid of null values caused by difference between brower host and server host
            var latestWriteOpPerSec = writeOpPerSec.pop()
            var readOpPerSec = results[1].filter((x) => x[1] != null).map((x)=> [x[0],parseFloat(x[1].toFixed(2))])
            var latestReadOpPerSec = readOpPerSec.pop()
            this.setState({
                writeOpsL: latestWriteOpPerSec[1],
                readOpsL: latestReadOpPerSec[1],
                writeOps: writeOpPerSec,
                readOps: readOpPerSec
            })
            console.log("readOpsL writeOpsL", this.state.readOpsL, this.state.writeOpsL)
        }).catch((r) => {
            console.log("fetchmetric err")
            console.log(r)
        })

        var fetchMonDown = ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_monmap", "down_mon_count", "", "", true)
        var fetchMonALL = ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_monmap", "total_mon_count", "", "", true)
        Promise.all([fetchMonDown, fetchMonALL]).then((results) => {
            var latestMonDown = results[0]
            var latestMonAll = results[1]
            this.setState({monDown: latestMonDown[0][1], monAll: latestMonAll[0][1]})
        }).catch((r) => {
            console.log("fetchmetric err")
            console.log(r)
        })

        var fetchPoolCount = ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_pool_state", "pool_count", "", "", true)
        Promise.all([fetchPoolCount]).then((results) => {
            var latestPoolCount = results[0]
            this.setState({pools: latestPoolCount[0][1]})
        }).catch((r) => {
            console.log("fetchmetric err")
            console.log(r)
        })

        var fetchHostCount = ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_osd_tree", "total_host_count", "", "", true)
        Promise.all([fetchHostCount]).then((results) => {
            var latestHostCount = results[0]
            this.setState({hosts: latestHostCount[0][1]})
        }).catch((r) => {
            console.log("fetchmetric err")
            console.log(r)
        })

        var fetchHealthStatus = ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_healthinfo", "overall_status", "", "", true)
        var fetchHealthSummary = ProphetApi.fetchmetric("SpecifiedByConfig", "ceph_healthinfo", "ceph_health_summary", "", "", true)
        Promise.all([fetchHealthStatus, fetchHealthSummary]).then((results) => {
            var latestHealthStatus = results[0]
            var latestHealthSummary = results[1]
            this.setState({healthStatus: latestHealthStatus[0][1], healthSummary: latestHealthSummary[0][1].split(',').filter((x) => x !== "" )})
            console.log("info", this.state.healthStatus, this.state.healthSummary)
        }).catch((r) => {
            console.log("fetchmetric err")
            console.log(r)
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
//                formatter: "{a} <br/>{b} : {c} ({d}%)"
                formatter: function (params) {
                    return params.seriesName + '<br/>' + params.name + ' : ' +  unit.byte(params.value) + '('+ params.percent + '%)'
                }
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
            color: ['#0000FF', '#FF0000', '#FFFF00'],
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
                                content={`${this.state.healthStatus.split('_')[1]}`}
                                subContend=""
                                footer={`${this.state.healthSummary.length} warning`}
                                tips={this.state.healthSummary}/>
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
                                content={`${this.state.monAll - this.state.monDown}/${this.state.monAll}`}
                                subContend="Quorum"
                                footer=""/>
                    </Col>
                    <Col md={3} sm={6}>
                        <Metric icon="glyphicon glyphicon-tint"
                                title="POOLS"
                                content={`${this.state.pools}`}
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
                                        content={String(this.state.writeOpsL+this.state.readOpsL)}
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
                            footer={`Total: ${unit.byte(this.state.usedBytes+this.state.freeBytes)}`} />
                    </Col>
                    <Col md={3} sm={6}>
                        <Metric icon="glyphicon glyphicon-th"
                                               title="HOSTS"
                                               content={`${this.state.hosts}`}
                                               subContend="Reporting"
                                               footer={`${this.state.monAll} MON/${this.state.osdALL} OSD`} />
                    </Col>
                </Row>
            </Grid>
        )
    }
}
export default Dashboard;