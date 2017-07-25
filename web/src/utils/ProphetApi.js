const querystring = require('querystring');
const api = process.env.REACT_APP_PROPHET_API_URL || 'http://localhost:3001'


let token = localStorage.token

if (!token)
    token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
    'Accept': 'application/json',
    'Authorization': token
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
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

export const setconfig = (config) => {
    var para = '?' + querystring.stringify(config)
    return (
        fetch(`${api}/local/setconfig${para}`, {
            method: 'PUT',
            headers: {
                ...headers,
            }
        }).then(handleErrors)
    )

}

export const loadconfig = () => {
    return (
        fetch(`${api}/local/loadconfig`, {
            method: 'GET',
            headers: {
                ...headers,
            }
        }).then(handleErrors)
            .then(res => res.json())
            .then(json => json.data)
    )
}

export const fetchmetric = (hostname, measurement, measure, from, to, latest = false) => {
    var parameters = {
        hostname,
        measurement,
        measure,
        from,
        to,
        latest
    }
    var para = '?' + querystring.stringify(parameters)
    return (
        fetch(`${api}/local/fetchmetric${para}`, {
            method: 'GET',
            headers: {
                ...headers,
            }
        }).then(handleErrors)
            .then(res => res.json())
            .then(json => json.data[0].Series[0].values)
    )
}

export const queryDB = (q) => {
    var parameters = {
        q
    }
    var para = '?' + querystring.stringify(parameters)
    return (
        fetch(`${api}/local/querydb${para}`, {
            method: 'GET',
            headers: {
                ...headers,
            }
        }).then(handleErrors)
            .then(res => res.json())
            .then(json => json.data[0].Series[0].values)
            .catch((r) => {
                console.log("queryDB err")
                console.log(r)})
    )
}
