import React , { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
//import * as ProphetApi from './utils/ProphetApi'
import Dashboard from "./Dashboard";
import Host from "./Host";
import Manage from "./Manage";
import { Link } from 'react-router-dom'
import MainNav from './components/Navbar'

const fakeAuth = {
    isAuthenticated: false,
    authenticate(cb) {
        this.isAuthenticated = true
        setTimeout(cb, 100) // fake async
    },
    signout(cb) {
        this.isAuthenticated = false
        setTimeout(cb, 100)
    }
}

class Login extends Component {

    state = {
        redirectToReferrer: false
    }

    handleSubmit = (e) => {
        e.preventDefault()
        fakeAuth.authenticate(() => {
            this.setState({redirectToReferrer: true})
        })
    }

    render() {
        const {from} = this.props.location.state || {from: {pathname: '/'}}
        const redirectToReferrer = this.state.redirectToReferrer

        if (redirectToReferrer) {
            return (
                <Redirect to={from}/>
            )
        }

        return (
            <div>
                <form onSubmit={this.handleSubmit} className='login-form'>
                    <Link className="test-logo" to="/">back</Link>
                    <div className='login-details'>
                        <input type='text' name='user' placeholder='User'/>
                        <input type='text' name='password' placeholder='Password'/>
                        <button>Login</button>
                    </div>
                </form>
            </div>
        )
    }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        fakeAuth.isAuthenticated ? (
            <Component {...props}/>
        ) : (
            <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
            }}/>
        )
    )}/>
)

class App extends Component {
    componentDidMount() {
    }

    render() {
        return (
            <div>
                <Route path="/" render={({ history }) => (
                    <MainNav history={history}/>
                )}/>
                <Route exact path="/" render={() => (
                    fakeAuth.isAuthenticated ? (
                        <Redirect to="/dashboard"/>
                    ) : (
                        <Login location={window.location}/>
                    )
                )}/>
                <Route exact path="/login" component={Login}/>
                <PrivateRoute exact path="/dashboard" component={Dashboard}/>
                <PrivateRoute exact path="/host" component={Host}/>
                <PrivateRoute exact path="/manage" component={Manage}/>
            </div>
        )
    }
}

export default App;