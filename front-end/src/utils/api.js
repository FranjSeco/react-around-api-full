class Api {
  constructor({ baseUrl, headers }) {
    // constructor body
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  // RESPONSE CHECK
  _responseCheck(res) {
    return res.ok ? res.json() : Promise.reject(`Error!` + res.statusText)
  }


  // GET https://around.nomoreparties.co/v1/groupId/cards
  getInitialCards() {
    return fetch(this._baseUrl + "/cards", {
      headers: this._headers
    })
    .then(this._responseCheck)
  }


  // GET https://around.nomoreparties.co/v1/groupId/users/me
  getUserInfo() {
    return fetch(this._baseUrl + "/users/me", {
      headers: this._headers
    })
    .then(this._responseCheck)
  }

  getServerInfo() {
    return Promise.all([this.getInitialCards(), this.getUserInfo()])
  }

  // POST https://around.nomoreparties.co/v1/groupId/cards
  addCard({ name, link }) {
    return fetch(this._baseUrl + "/cards", {
      headers: this._headers,
      method: "POST",
      body: JSON.stringify({
        name,
        link
      })
    })
    .then(this._responseCheck)

  }

  // DELETE https://around.nomoreparties.co/v1/groupId/cards/cardId
  removeCard(cardID) {
    return fetch(this._baseUrl + "/cards/" + cardID, {
      headers: this._headers,
      method: "DELETE",
    })
    .then(this._responseCheck)
  }

  // PATCH https://around.nomoreparties.co/v1/groupId/users/me
  editProfile({ name, about }) {
    return fetch(this._baseUrl + "/users/me", {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about
      })
    })
    .then(this._responseCheck)

  }

  editAvatar(avatar) {
      return fetch(this._baseUrl + '/users/me/avatar', {
          headers: this._headers,
          method: "PATCH",
          body: JSON.stringify({
              avatar
          })
      })
      .then(this._responseCheck)

  }

  // PUT https://around.nomoreparties.co/v1/groupId/cards/likes/cardId
  addLike(cardID) {
    return fetch(this._baseUrl + "/cards/" + cardID + "/likes/", {
      headers: this._headers,
      method: "PUT",
    })
    .then(this._responseCheck)

  }

  // DELETE https://around.nomoreparties.co/v1/groupId/cards/likes/cardId
  removeLike(cardID) {
    return fetch(this._baseUrl + "/cards/" + cardID + "/likes/" , {
      headers: this._headers,
      method: "DELETE",
    })
    .then(this._responseCheck)
  }
}

// const api = new Api({
//   baseUrl: "https://around.nomoreparties.co/v1/group-7",
//   headers: {
//     authorization: "3199dd72-198f-4d27-96ce-739071f3c183",
//     "Content-Type": "application/json"
//   }
// });

export default Api;


// owner card id: a2fbf9b0cad144ef98de1a23

// Token: 3199dd72-198f-4d27-96ce-739071f3c183
// Group ID: group-7

