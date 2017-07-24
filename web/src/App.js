import React , { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
//import * as ProphetApi from './utils/ProphetApi'
import Dashboard from "./Dashboard";
import Host from "./Host";
import HostAdd from "./HostAdd";
import HostDetail from "./HostDetail";
import Manage from "./Manage";
import { Link } from 'react-router-dom'
import MainNav from './components/Navbar'
var NotificationSystem = require('react-notification-system');

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
        redirectToReferrer: false,
        user: '',
        password: ''
    }

    handleSubmit = (e) => {
        e.preventDefault()
        if (this.state.user === "root" && this.state.password === "root") {
            window.notify.addNotification(
                {
                    message: 'Login Success',
                    level: 'success',
                    autoDismiss: 3,
                    position: 'tr'
                }
            )
            fakeAuth.authenticate(() => {
                this.setState({redirectToReferrer: true})
            })
        } else {
            window.notify.addNotification(
                {
                    message: 'Invalid User or Password',
                    level: 'error',
                    autoDismiss: 3,
                    position: 'tr',
                }
            )
        }
    }

    handleUserChange = (event) => {
        this.setState({user: event.target.value});
    }
    onTimePasswordHandler = (event) => {
        this.setState({password: event.target.value});
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
                    <Link className="person-logo" to="/">back</Link>
                    <div className='login-details'>
                        <input type='text' name='user' placeholder='User' value={this.state.user} onChange={this.handleUserChange} />
                        <input type='text' name='password' placeholder='Password' value={this.state.password} onChange={this.onTimePasswordHandler} />
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
    constructor(props) {
        super(props)
        this.state = {
            _notificationSystem: null
        }
    }

    componentDidMount() {
        window.notify = this.refs.notificationSystem;
    }

    render() {
        return (
            <div>
                <Route path="/" render={({ history }) => (
                    fakeAuth.isAuthenticated ? (
                        <MainNav history={history}/>
                    ) : (
                        <div/>
                    )
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
                <PrivateRoute exact path="/host/add" component={HostAdd}/>
                <PrivateRoute exact path="/host/detail/:hostname" component={HostDetail}/>
                <PrivateRoute exact path="/manage" component={Manage}/>
                <NotificationSystem ref="notificationSystem" />
            </div>
        )
    }
}

export default App;