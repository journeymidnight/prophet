import React, { Component }from 'react'
import { Table } from 'react-bootstrap'
class HostTable extends Component {

    render() {
        const { hosts, activePage } = this.props
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
                    {hosts.map((item, index) => (
                        <tr key={index}>
                            <td>{(activePage-1)*10 + index}</td>
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