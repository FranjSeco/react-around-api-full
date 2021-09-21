import React from 'react';
import Main from '../Main/Main.js'
import EditProfilePopup from '../EditProfilePopup/EditProfilePopup.js'
import EditAvatarPopup from '../EditAvatarPopup/EditAvatarPopup.js'
import AddPlacePopup from '../AddPlacePopup/AddPlacePopup.js'
import DeleteCardPopup from '../DeleteCardPopup/DeleteCardPopup.js'
import ImagePopup from '../PopUp/ImagePopup.js'


import Api from '../../utils/api.js';
import { CurrentUserContext } from '../../contexts/CurrentUserContext.js';

import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

import Login from '../Login/Login.js';
import Register from '../Register/Register.js';

import Header from '../Header/Header.js';
import InfoTooltips from '../InfoTooltip/InfoTooltip';

import '../../Page.css';
import '../../index.css';

import * as auth from '../../utils/auth';


function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isDeleteCardOpen, setIsDeleteCardOpen] = React.useState(false);
  const [isImageOpen, setIsImageOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [cardToBeDeleted, setCardToBeDeleted] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isInfoToolOpen, setIsInfoToolOpen] = React.useState(false);
  const [success, setSuccess] = React.useState();
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const history = useHistory();
  // REGISTER
  // LOGIN
  // JWT
  const [token, setToken] = React.useState('');
  const [currentUser, setCurrentUser] = React.useState({});

  // PAGE TITLE

  React.useEffect(() => {
    document.title = 'Around-us';
  }, []);

  // API

  const api = new Api({
    // baseUrl: "https://around.nomoreparties.co/v1/group-7",
    // baseUrl: 'http://localhost:3000',
    // baseUrl: "https://api.aroundtheus.students.nomoreparties.site",
    baseUrl: "https://around-us-api.herokuapp.com",
    headers: {
      'Authorization': `Bearer ${token}`,
      // authorization: "3199dd72-198f-4d27-96ce-739071f3c183",
      'content-type': 'application/json'
    }
  });

  React.useEffect(() => {
    history.push('/');
    handleCheckTkn();
  }, [])

  const handleRegistration = (email, password) => {
    if (email && password) {
      auth.register(email, password)
        .then(res => {
          if (res.message) {
            history.push('/signin')
          } else if (!res) {
            handleSuccess(false);
            history.push('/signin')
            return res;
          } else {
            setCurrentUser(res);
            handleSuccess(true);
            history.push('/signin');
            return res;
          }
        })
        .then(handlePopup)
        .catch(err => {
          handleSuccess(false);
          handlePopup();
          console.log(message);
        })
    } else {
      return setMessage('Something went wrong!');
    }
  }

  const handleLogin = (email, password) => {
    auth.authorize(email, password)
      .then(({ token }) => {
        if (token) {
          localStorage.setItem('jwt', token);
          setToken(token);
          setIsLoggedIn(true);
          setEmail(email);
          history.push('/app');
          return;
        }
        history.push('/signup');
      })
      .catch(err => {
        console.log('catch reached')
        setMessage(err.message)
      })
  }

  const handleCheckTkn = () => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth.checkToken(jwt)
        .then((res) => {
          if (res) {
            setEmail(res.data.email);
            setIsLoggedIn(true);
            history.push('/app');
            setToken(jwt);
            return;
          }
          setIsLoggedIn(false);
        })
        .catch(err => console.log(err))
    }
  }

  const handleEmail = (x) => {
    setEmail(x);
  }

  const handleSignOut = () => {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    history.push('./signin');
    setEmail('');
  }

  const handlePopup = () => {
    setIsInfoToolOpen(true);
  }

  const handleSuccess = (x) => {
    setSuccess(x);
  }

  // APP

  React.useEffect(() => {
    if (token) {
      api.getUserInfo()
        .then(res => {
          setCurrentUser(res.data);
        })
        .catch((err) => {
          console.log(`${err}`);
        });

      api.getInitialCards()
        .then(data => {
          setCards(data.data);
        })
        .catch((err) => {
          console.log(`${err}`);
        });
    }
  }, [token, CurrentUserContext])


  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function handleDeleteCardPopup(id) {
    setCardToBeDeleted(id);
    setIsDeleteCardOpen(true);
  }


  // CARD FUNCTIONALITY
  function handleCardLike(card) {
    const isLiked = card.likes !== undefined ? card.likes.includes(currentUser._id) : false;
    const handleLike = !isLiked ? api.addLike(card._id) : api.removeLike(card._id);

    handleLike
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(err => console.log(err));
  }

  function handleDeleteCard() {
    api.removeCard(cardToBeDeleted)
      .then(() => {
        const newSetup = cards.filter((item) => item._id !== cardToBeDeleted);
        setCards(newSetup);
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }

  function handleCardClick({ name, link }) {
    setSelectedCard({ name, link });
    setIsImageOpen(true);
  }


  // POPUPS

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImageOpen(false);
    setSelectedCard({});
    setIsDeleteCardOpen(false);
    setIsInfoToolOpen(false);
  }

  function handleUpdateUser(userInfo) {
    api.editProfile({ ...userInfo })
      .then((data) => {
        setCurrentUser({ ...data.data })
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }

  function handleUpdateAvatar(avatarInput) {
    api.editAvatar(avatarInput.avatar)
      .then((data) => {
        setCurrentUser({ ...data.data })
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }

  function handleAddPlaceSubmit(newPlace) {
    api.addCard({ ...newPlace })
      .then((data) => {

        setCards([...cards, data.data]);
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }

  return (
    <div className='Page'>
      <CurrentUserContext.Provider value={currentUser}>
        <Header email={email} isLoggedIn={isLoggedIn} handleSignOut={handleSignOut} />
        <Switch>

          <ProtectedRoute 
            component={Main}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onDeleteCardPopup={handleDeleteCardPopup}
            exact path="/app" loggedIn={isLoggedIn} />

          <Route path="/signup">
            <Register handleRegistration={handleRegistration} />
          </Route>

          <Route path="/signin">
            <Login handleLogin={handleLogin} handleEmail={handleEmail} />
          </Route>

          <Route>
            {isLoggedIn ? <Redirect to="/app" /> : <Redirect to="/signup" />}
          </Route>

        </Switch>

        <InfoTooltips
          isOpen={isInfoToolOpen}
          onClose={closeAllPopups}
          success={success}
        />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          user={currentUser}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit} />

        <DeleteCardPopup
          isOpen={isDeleteCardOpen}
          onClose={closeAllPopups}
          onDeleteCardSubmit={handleDeleteCard}
        />

        <ImagePopup
          isOpen={isImageOpen}
          card={selectedCard}
          onClose={closeAllPopups}
        />


      </CurrentUserContext.Provider>



    </div>


  );
}

export default App;