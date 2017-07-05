import React, { Component }from 'react'
import { Table } from 'react-bootstrap'
class HostTable extends Component {

    render() {
        const { hosts, activePage, maxRow } = this.props
        var subHosts = hosts.slice((activePage-1)*maxRow,activePage*maxRow)
        return (
            <Table striped bordered condensed hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>HostName</th>
                        <th>Ip</th>
                    </tr>
                </thead>
                <tbody>
                    {subHosts.map((item, index) => (
                        <tr key={index}>
                            <td>{(activePage-1)*10 + index + 1}</td>
                            <td>{item.HostName}</td>
                            <td>{item.Ip}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }
}

export default HostTable