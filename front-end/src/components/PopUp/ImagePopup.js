import React from 'react';

function ImagePopup(props) {
    return (
        // <div className={`overlay ${(props.isOpen) ? 'overlay_popup' : ''}`}>
        <div className={`overlay ${(props.isOpen) && 'overlay_popup'}`}>
            <div className="image-popup">
                <button className="close-icon" onClick={props.onClose} type="button"> </button>
                <img className="image-popup__picture" src={props.card.link} alt=''/>
                <figcaption className="image-popup__caption" >{props.card.name}</figcaption>
            </div>
        </div>
    )
}

export default ImagePopup;