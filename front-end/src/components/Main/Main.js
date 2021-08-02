import React from 'react';
import Card from '../Card/Card.js'
import Footer from '../Footer/Footer.js'
import { CurrentUserContext } from '../../contexts/CurrentUserContext.js'


function Main(props) {
    const currentUser = React.useContext(CurrentUserContext);   

    return (
        <main className="main">
            <section className="profile">
                <div onClick={props.onEditAvatar} className="profile__avatar" />
                <img className="profile__avatar-image" src={currentUser.avatar} alt="Profile" />
                <div className="profile__info">
                    <div className="profile__info-block">
                        <h1 className="profile__info-title">
                            {currentUser.name}
                        </h1>
                        <button onClick={props.onEditProfile} className="profile__info-btn" type="button">
                        </button>
                    </div>
                    <p className="profile__info-about">{currentUser.about}</p>
                </div>
                <button onClick={props.onAddPlace} className="profile__add-btn" type="button">
                </button>
            </section>
            <div className="elements">
                {
                    props.cards.slice(0).reverse().map(
                        (card, id) => (
                            <Card
                            key={id}
                            card={card}
                            onClick={props.onCardClick}
                            onCardLike={props.onCardLike}
                            onDeleteCardPopup={props.onDeleteCardPopup}
                        />
                        ))
                }
            </div>
            <Footer />
        </main >

    )
}

export default Main;