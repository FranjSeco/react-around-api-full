import React from 'react';

function PopupWithForm(props) {
    return (
        <div className={`overlay ${(props.isOpen) && 'overlay_popup'}`} >
            <div className={`popup`}>
                <button className="close-icon" onClick={props.onClose} type="button"> </button>
                <form className={`popup__form form`} onSubmit={props.onSubmit} name={props.title}>
                    <h2 className={`popup__title`}>
                        {props.title}
                    </h2>
                    {
                        props.children
                    }
                    <button className={`popup__btn form-submit`} onClick={props.onClose} type="submit">
                        {props.btn}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default PopupWithForm;