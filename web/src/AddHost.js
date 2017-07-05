import React , { Component } from 'react'
import { Link } from 'react-router-dom'
import {Form,FormGroup,Col,ControlLabel,FormControl,Button} from 'react-bootstrap'
import * as ProphetApi from './utils/ProphetApi'

class AddHost extends Component {

    state = {
        hostname:'',
        ip:''
    }
    updateHostName = (hostname) => {
        this.setState({ hostname: hostname.trim() })
    }
    updateIp = (ip) => {
        this.setState({ ip: ip.trim() })
    }
    handleSubmit = (e) => {
        e.preventDefault()
        const { history } = this.props
        ProphetApi.addnode(this.state.hostname, this.state.ip).then(
            (res) => {
                console.log(res)
            }
        )
        history.push('/host')
    }

    render () {
        const { hostname, ip } = this.state
        return (
            <Form horizontal onSubmit={this.handleSubmit}>
                <Link className="back-logo" to="/host">back</Link>
                <FormGroup controlId="formHorizontalEmail">
                    <Col componentClass={ControlLabel} sm={2}>
                        HostName
                    </Col>
                    <Col sm={10}>
                        <FormControl value={hostname} type="text" placeholder="HostName" onChange={(event) => this.updateHostName(event.target.value)}/>
                    </Col>
                </FormGroup>

                <FormGroup controlId="formHorizontalPassword">
                    <Col componentClass={ControlLabel} sm={2}>
                        Ip
                    </Col>
                    <Col sm={10}>
                        <FormControl value={ip} type="text" placeholder="Ip" onChange={(event) => this.updateIp(event.target.value)}/>
                    </Col>
                </FormGroup>
                <FormGroup>
                    <Col smOffset={2} sm={10}>
                        <Button type="submit">
                            Submit
                        </Button>
                    </Col>
                </FormGroup>
            </Form>
        )
    }
}

export default AddHost


