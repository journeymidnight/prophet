import React, { Component }from 'react'
import { Table } from 'react-bootstrap'
class HostTable extends Component {

    render() {
        const { hosts, activePage, maxRow, onRemoveHost} = this.props
        var subHosts = hosts.slice((activePage-1)*maxRow,activePage*maxRow)
        console.log("hosts:", hosts, hosts.length)
        return (
            hosts.length === 0 ? (
                <div></div>) : (
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
                            <td>{item.Ip}
                                <button onClick={() => onRemoveHost(item)} className='host-remove'>
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )
        )
    }
}

export default HostTable