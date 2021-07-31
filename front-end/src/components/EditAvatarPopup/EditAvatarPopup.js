import React from 'react';
import PopupWithForm from '../PopUp/PopupWithForm.js'


function EditAvatarPopup(props) {
    const avatarInputRef = React.useRef('');

    function handleSubmit(e) {
        e.preventDefault();
    
        props.onUpdateAvatar({
            avatar: avatarInputRef.current.value
        });

        avatarInputRef.current.value = '';
    }

    return (
        <PopupWithForm
            onSubmit={handleSubmit}
            name={'avatar'}
            title={'Edit Avatar'}
            btn={'Save'}
            isOpen={props.isOpen}
            onClose={props.onClose}
            >
            <input 
            ref={avatarInputRef} 
            id="avatar-input" 
            className="popup__input avatar-form__input_about form-input" 
            placeholder="Avatar URL" 
            type="url" 
            name="link" 
            required />
            <span 
            id="avatar-input-error" 
            className="form-input-error" />
        </PopupWithForm>
    )
}

export default EditAvatarPopup;