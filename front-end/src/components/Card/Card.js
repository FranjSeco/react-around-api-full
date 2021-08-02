import React from 'react';
import {CurrentUserContext} from '../../contexts/CurrentUserContext.js'

function Card({card, onClick, onCardLike, onDeleteCardPopup}) {
  function handleClick() {
    onClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onDeleteCardPopup(card._id);
  }
  const userInfo = React.useContext(CurrentUserContext); 
  const isOwned = userInfo._id === card.owner;
  const isLiked = card.likes !== undefined ? card.likes.includes(userInfo._id) : false;

  return (
    <div className="element">
      <img className="element__image" src={card.link || card.data.link} alt={card.name || card.data.name} onClick={handleClick}/>
      <button className={`element__trash ${(isOwned) ? 'element__trash_display' : '' }`} onClick={handleDeleteClick} type="button" />
      <div className="element__text">
        <h2 className="element__title">{card.name || card.data.name}</h2>
        <div className="element__like-container">
          <button className={`element__like-btn ${(isLiked) ? 'element__like-black' : ''}`} onClick={handleLikeClick} type="button" />
          <p className={`element__like-counter ${( card.likes !== undefined && card.likes.length > 0) ? 'element__like-counter_display' : ''}`}>{card.likes !== undefined && card.likes.length}</p>
        </div>
      </div>
    </div>
  )
}

export default Card;
