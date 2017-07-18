import React , { Component } from 'react'
import {Button, ButtonGroup} from 'react-bootstrap'
import * as ProphetApi from './utils/ProphetApi'
import {MetricForHost} from './components/Metric'

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
                <select value={this.state.hostname} onChange={this.handleChange}>
                    {this.state.allHosts.map((item, index) => (
                        <option key={index}>{item.HostName}</option>
                        )
                    )}
                </select>
                <div className="categorySelect">
                    <div>System</div>
                    <ButtonGroup >
                        <Button bsStyle="primary" bsSize="xs" onClick={this.handleClick}>Summary</Button>
                        <Button bsStyle="primary" bsSize="xs" onClick={this.handleClick}>All CPUs</Button>
                    </ButtonGroup>
                </div>
                <div className="categorySelect">
                    <div>Disk</div>
                    <Button bsStyle="primary" bsSize="xs" onClick={this.handleClick}>Bytes</Button>
                    <Button bsStyle="primary" bsSize="xs" onClick={this.handleClick}>IOPS</Button>
                    <Button bsStyle="primary" bsSize="xs" onClick={this.handleClick}>Capacity</Button>
                    <Button bsStyle="primary" bsSize="xs" onClick={this.handleClick}>Inodes</Button>
                </div>
                <div className="categorySelect">
                    <div>Network</div>
                    <Button bsStyle="primary" bsSize="xs" onClick={this.handleClick}>Bytes</Button>
                    <Button bsStyle="primary" bsSize="xs" onClick={this.handleClick}>Packets</Button>
                </div>
                {this.state.category === "All CPUs" ? (
                    <MetricForHost hostname={this.state.hostname} measurement="cpu" measure="usage_idle"/>
                ) : (<div/>)}

            </div>
        )
    }
}

export default HostDetail