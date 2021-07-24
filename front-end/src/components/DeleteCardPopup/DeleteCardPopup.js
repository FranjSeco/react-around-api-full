import React from 'react';
import PopupWithForm from '../PopUp/PopupWithForm.js'

function DeleteCardPopup(props) {
    function handleSubmit(e) {
        e.preventDefault();
        props.onDeleteCardSubmit();
    }

    return (
        <PopupWithForm
            onSubmit={handleSubmit}
            name={'delete'}
            title={'Are you sure?'}
            btn={'Yes'}
            isOpen={props.isOpen}
            onClose={props.onClose}>
        </PopupWithForm>
    )
}

export default DeleteCardPopup;
