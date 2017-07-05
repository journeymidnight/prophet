import React , { Component } from 'react';
import * as ProphetApi from './utils/ProphetApi'
import HostTable from './components/Table'
import { Pagination, Form, InputGroup, FormControl, Button, Glyphicon} from 'react-bootstrap'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'

class Host extends Component {
    state = {
        hosts:[],
        query: '',
        activePage:1
    }

    updateQuery = (query) => {
        this.setState({ query: query.trim() })
    }

    clearQuery = () => {
        this.setState({ query: '' })
    }

    componentDidMount() {
        ProphetApi.listnodes().then((hosts) => {
            this.setState({ hosts })
        })
    }

    handleSelect = (eventKey) => {
        this.setState({
            activePage: eventKey
        });
    }

    handleClick = () => {
        const { history } = this.props
        history.push('/host/add')
    }

    render () {
        console.log("hosts:", this.state.hosts)
        const { query, hosts } = this.state
        let showingHosts
        if (query) {
            const match = new RegExp(escapeRegExp(query), 'i')
            showingHosts = hosts.filter((host) => match.test(host.HostName))
        } else {
            showingHosts = hosts
        }
        showingHosts.sort(sortBy('HostName'))
        return (
            <div>
                <div>
                    <Form inline>
                        <InputGroup>
                            <InputGroup.Addon><Glyphicon glyph="glyphicon glyphicon-search" /></InputGroup.Addon>
                            <FormControl value={query} type="text" onChange={(event) => this.updateQuery(event.target.value)}/>
                        </InputGroup>
                        <Button bsStyle="primary" className="addButton" onClick={this.handleClick} ><Glyphicon glyph="glyphicon glyphicon-plus" />Host</Button>
                    </Form>
                </div>
                <div>
                    <HostTable hosts={showingHosts} activePage={this.state.activePage} maxRow={10} />
                </div>
                <div className="pagination-container">
                    <Pagination
                        prev
                        next
                        first
                        last
                        ellipsis
                        boundaryLinks
                        items={showingHosts.length/10+1}
                        maxButtons={5}
                        activePage={this.state.activePage}
                        onSelect={this.handleSelect} />
                </div>
            </div>
        )
    }
}
export default Host;