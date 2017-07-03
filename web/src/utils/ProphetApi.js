const api = process.env.REACT_APP_PROPHET_API_URL || 'http://localhost:8890'

let token = localStorage.token

if (!token)
    token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
    'Accept': 'application/json',
    'Authorization': token
}

export const addnode = (hostname, ip) =>
    fetch(`${api}/local/addnode`, {
        method: 'PUT',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            hostname,
            ip
        })
    }).then(res => res.json())

export const delnode = (hostname) =>
    fetch(`${api}/local/delnode`, {
        method: 'DELETE',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            hostname
        })
    }).then(res => res.json())

export const listnodes = () =>
    fetch(`${api}/local/listnodes`, {
        method: 'GET',
        headers: {
            ...headers,
        }
    }).then(res => res.json())
        .then(data => data.Data)

export const fetchmetric = (hostname, measurement, measure, from, to) =>
    fetch(`${api}/local/fetchmetric`, {
        method: 'GET',
        headers: {
            ...headers,
        },
        body: JSON.stringify({
            hostname,
            measurement,
            measure,
            from,
            to
        })
    }).then(res => res.json())
        .then(data => data.Data)