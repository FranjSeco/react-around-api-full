export const BASE_URL = 'https://register.nomoreparties.co';

// const  responseCheck = (res) => {
//     return res.ok ? res.json() : Promise.reject(`Error!` + res.statusText);
// }

export const register = (email, password) => { 
    return fetch(`${BASE_URL}/signup`, { 
        method: 'POST', 
        headers: { 
            'Content-Type': 'application/json' 
        }, 
        body: JSON.stringify({email, password}) 
    }) 

    .then(res => { 
        return res.json(); 
    }) 
    .then(res => { 
        return res; 
    }) 
} 

export const authorize = (email, password) => {
    return fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
    })
    .then((res) => {
        return res.json()
    })
    .then((data) => {
        if(data.token) {
            localStorage.setItem('jwt', data.token);
            return data;
        } else {
            return;
        }
    })
}

export const getContent = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(data => data)
}