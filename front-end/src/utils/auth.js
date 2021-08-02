// export const BASE_URL = 'https://register.nomoreparties.co';
// export const BASE_URL = 'http://localhost:3000';
export const BASE_URL = "https://api.newus.students.nomoreparties.site";


// const  responseCheck = (res) => {
//     return res.ok ? res.json() : Promise.reject(`Error!` + res.statusText);
// }

export const register = (email, password) => {
    console.log(email, password)
    return fetch(`${BASE_URL}/signup`, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': "application/json",
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
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
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            localStorage.setItem('jwt', data.token);
            return data;
        })
        .catch((err) => console.log(err));
}

export const checkToken = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
        .then(res => {
            return res.json()
        })
        .catch(err => console.log(err))
}