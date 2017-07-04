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
                            <FormControl type="text" />
                        </InputGroup>
                        <Button bsStyle="primary" className="addButton"><Glyphicon glyph="glyphicon glyphicon-plus" />Host</Button>
                    </Form>
                </div>
                <div>
                    <HostTable hosts={showingHosts} activePage={this.state.activePage}/>
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