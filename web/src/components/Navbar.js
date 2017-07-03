import React, { Component }from 'react'
import { Nav, Navbar, NavItem } from 'react-bootstrap'


class MainNav extends Component {
    constructor() {
        super()
        this.handleSelect=this.handleSelect.bind(this)
    }

    state = {
        activeKey:1
    }

    handleSelect(selectedKey) {
        this.setState({activeKey:selectedKey})
        if (selectedKey === 1) {
            this.props.history.push('/dashboard')
        } else if (selectedKey === 2) {
            this.props.history.push('/host')
        } else {
            this.props.history.push('/manage')
        }

    }

    render() {
        return (
            /*
            <Navbar bsStyle="pills" activeKey={this.state.activeKey} onSelect={this.handleSelect}>
                <NavItem eventKey={1} href="/dashboard">Dashboard</NavItem>
                <NavItem eventKey={2} href="/host">Hosts</NavItem>
                <NavItem eventKey={3} href="/manage">Manage</NavItem>
            </Navbar>*/
            <Navbar inverse collapseOnSelect onSelect={this.handleSelect}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a>Prophet</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>

                <Navbar.Collapse>
                    <Nav>
                        <NavItem eventKey={1} href="/dashboard">Dashboard</NavItem>
                        <NavItem eventKey={2} href="/host">Hosts</NavItem>
                        <NavItem eventKey={3} href="/manage">Manage</NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default MainNav