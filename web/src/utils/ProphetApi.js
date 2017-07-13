const querystring = require('querystring');
const api = process.env.REACT_APP_PROPHET_API_URL || 'http://localhost:3000'


let token = localStorage.token

if (!token)
    token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
    'Accept': 'application/json',
    'Authorization': token
}


export const addnode = (hostname, ip) => {
    var parameters = {
        hostname,
        ip
    }
    var para = '?' + querystring.stringify(parameters)
    return (
        fetch(`${api}/local/addnode${para}`, {
            method: 'PUT',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
    )
}


export const delnode = (host) => {
    var parameters = {
        hostname: host.HostName
    }
    var para = '?' + querystring.stringify(parameters)
    return (
        fetch(`${api}/local/delnode${para}`, {
            method: 'DELETE',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
    )
}
export const listnodes = () =>
    fetch(`${api}/local/listnodes`, {
        method: 'GET',
        headers: {
            ...headers,
        }
    }).then(res => res.json())
        .then(data => data.data)

export const fetchmetric = (hostname, measurement, measure, from, to) => {
    var parameters = {
        hostname,
        measurement,
        measure,
        from,
        to
    }
    var para = '?' + querystring.stringify(parameters)
    return (
        fetch(`${api}/local/fetchmetric${para}`, {
            method: 'GET',
            headers: {
                ...headers,
            }
        }).then(res => res.json())
            .then(data => data.data)
    )
}
