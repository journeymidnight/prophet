import React , { Component } from 'react'
import {Button, ButtonGroup, FormControl} from 'react-bootstrap'
import * as ProphetApi from './utils/ProphetApi'
import {MetricForHost, MetricForHostWithOutDev} from './components/Metric'

class HostDetail extends Component {
    state = {
        hostname: "",
        category: "",
        allHosts: []
    }

    componentDidMount() {
        const { match } = this.props
        ProphetApi.listnodes().then((hosts) => {
            this.setState({allHosts: hosts})
        })
        this.setState({hostname:match.params.hostname, category:"summary"})
    }
    handleChange = (event) => {
        this.setState({hostname: event.target.value});
    }

    handleClick = (event) => {
        console.log("event:", event.currentTarget.textContent);
        this.setState({category: event.currentTarget.textContent});
        console.log("equal",this.state.category === "All CPUs", this.state.category)
    }

    render () {
        return (
            <div className="host-detail">
                <header>Host Graphs for {this.state.hostname}</header>
                <FormControl componentClass="select" value={this.state.hostname} onChange={this.handleChange} bsSize="small" style={{width:'auto', display:'inline-block'}}>
                    {this.state.allHosts.map((item, index) => (
                            <option key={index}>{item.HostName}</option>
                        )
                    )}
                </FormControl>
                <div className="SelectContainer">
                    <div className="categorySelect">
                        <div>System</div>
                        <ButtonGroup >
                            <Button bsStyle="primary" bsSize="sm" onClick={this.handleClick}>Summary</Button>
                            <Button bsStyle="primary" bsSize="sm" onClick={this.handleClick}>All CPUs</Button>
                        </ButtonGroup>
                    </div>
                    <div className="categorySelect">
                        <div>Disk</div>
                        <Button bsStyle="primary" bsSize="sm" onClick={this.handleClick}>RWRates</Button>
                        <Button bsStyle="primary" bsSize="sm" onClick={this.handleClick}>Capacity</Button>
                        <Button bsStyle="primary" bsSize="sm" onClick={this.handleClick}>Inodes</Button>
                    </div>
                    <div className="categorySelect">
                        <div>Network</div>
                        <Button bsStyle="primary" bsSize="sm" onClick={this.handleClick}>TxRates</Button>
                        <Button bsStyle="primary" bsSize="sm" onClick={this.handleClick}>Packets</Button>
                    </div>
                </div>
                {this.state.category === "Summary" ? (
                    <div>
                        <MetricForHostWithOutDev hostname={this.state.hostname} measurement="system" measure="load1" title="System Load1"/>
                        <MetricForHostWithOutDev hostname={this.state.hostname} measurement="system" measure="load5" title="System Load5"/>
                        <MetricForHostWithOutDev hostname={this.state.hostname} measurement="system" measure="load15" title="System Load5"/>
                        <MetricForHostWithOutDev hostname={this.state.hostname} measurement="system" measure="n_cpus" title="System N_CPUs"/>
                    </div>
                ) : (<div/>)}

                {this.state.category === "All CPUs" ? (
                    <div>
                        <MetricForHost hostname={this.state.hostname} measurement="cpu" measure="usage_idle" keyName="cpu" title="CPU Idle"/>
                        <MetricForHost hostname={this.state.hostname} measurement="cpu" measure="usage_iowait" keyName="cpu" title="CPU IoWait"/>
                    </div>
                ) : (<div/>)}

                {this.state.category === "RWRates" ? (
                    <div>
                        <MetricForHost hostname={this.state.hostname} measurement="disk" measure="rd_sec_per_s" keyName="device" title="Disk Read Sector Per Sec"/>
                        <MetricForHost hostname={this.state.hostname} measurement="disk" measure="wr_sec_per_s" keyName="device" title="Disk Write Sector Per Sec"/>
                    </div>
                ) : (<div/>)}

                {this.state.category === "Capacity" ? (
                    <div>
                        <MetricForHost hostname={this.state.hostname} measurement="disk_duandinode" measure="total" keyName="device" title="Disk Total"/>
                        <MetricForHost hostname={this.state.hostname} measurement="disk_duandinode" measure="used" keyName="device" title="Disk Used"/>
                        <MetricForHost hostname={this.state.hostname} measurement="disk_duandinode" measure="used_percent" keyName="device" title="Disk UsedPercent"/>
                    </div>
                ) : (<div/>)}

                {this.state.category === "Inodes" ? (
                    <div>
                        <MetricForHost hostname={this.state.hostname} measurement="disk_duandinode" measure="inodes_free" keyName="device" title="Disk Inodes Free"/>
                        <MetricForHost hostname={this.state.hostname} measurement="disk_duandinode" measure="inodes_used" keyName="device" title="Disk Inodes Used"/>
                        <MetricForHost hostname={this.state.hostname} measurement="disk_duandinode" measure="inodes_total" keyName="device" title="Disk Inodes Total"/>
                    </div>
                ) : (<div/>)}

                {this.state.category === "TxRates" ? (
                    <div>
                        <MetricForHost hostname={this.state.hostname} measurement="network" measure="txkB_per_s" keyName="device" title="Tx KB Per Sec"/>
                        <MetricForHost hostname={this.state.hostname} measurement="network" measure="rxkB_per_s" keyName="device" title="Rx KB Per Sec"/>
                    </div>
                ) : (<div/>)}

                {this.state.category === "Packets" ? (
                    <div>
                        <MetricForHost hostname={this.state.hostname} measurement="network" measure="txpck_per_s" keyName="device" title="Tx Packet Per Sec"/>
                        <MetricForHost hostname={this.state.hostname} measurement="network" measure="rxpck_per_s" keyName="device" title="Rx Packet Per Sec"/>
                    </div>
                ) : (<div/>)}

            </div>
        )
    }
}

export default HostDetail