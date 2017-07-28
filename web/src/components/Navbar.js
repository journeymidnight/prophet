import React, { Component }from 'react'
import { Nav, Navbar, NavItem } from 'react-bootstrap'


class MainNav extends Component {
    list = [
        {
            path:'/dashboard',
            context:'Dashboard'
        },
        {
            path:'/host',
            context:'Host'
        },
        {
            path:'/manage',
            context:'Manage'
        }
    ]

    constructor(props) {
        super(props);
        if (window.location.pathname.indexOf('/dashboard') !== -1) {
            this.state = { activeKey: 0 }
        } else if (window.location.pathname.indexOf('/host') !== -1) {
            this.state = { activeKey: 1 }
        } else if (window.location.pathname.indexOf('/manage') !== -1) {
            this.state = { activeKey: 2 }
        } else {
            this.state = { activeKey: 0 }
        }
    }

    handleSelect = (selectedKey) => {
        this.setState({activeKey:selectedKey})
        console.log("useful history", this.props.history)
        if (selectedKey === 0) {
            this.props.history.push('/dashboard')
        } else if (selectedKey === 1) {
            this.props.history.push('/host')
        } else {
            this.props.history.push('/manage')
        }

    }

    render() {
        return (
            <Navbar inverse collapseOnSelect onSelect={this.handleSelect}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a>Prophet</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>

                <Navbar.Collapse>
                    <Nav activeKey={this.state.activeKey}>
                        {
                            this.list.map((item, index) => (
                                <NavItem key={index} eventKey={index} href={item.path}>{item.context}</NavItem>
                            ))
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default MainNav