import React from 'react';
import PopupWithForm from '../PopUp/PopupWithForm.js'


function AddPlacePopup(props) {
    // const [url, setUrl] = React.useState('');
    // const [place, setPlace] = React.useState('');
    const placeInputRef = React.useRef('');
    const urlInputRef = React.useRef('');

    // function handlePlaceInput() {
    //     setPlace(e.target.value);
    // }
    // function handleUrlInput(e) {
    //     setUrl(e.target.value);
    // }

    function handleSubmit(e) {
        e.preventDefault();

        props.onAddPlace({
            name: placeInputRef.current.value, 
            link: urlInputRef.current.value
        }) 

        placeInputRef.current.value = '';
        urlInputRef.current.value = '';
    }

    return (
        <PopupWithForm
            onSubmit={handleSubmit}
            name={'image'}
            title={'New Place'}
            btn={'Save'}
            isOpen={props.isOpen}
            onClose={props.onClose}
            >

            <input 
            ref={placeInputRef}
            id="image-input" 
            className="popup__input image-form__input_name form-input" 
            placeholder="Title" 
            type="text" 
            name="name" 
            minLength={1} 
            maxLength={30} 
            required
            //onChange={handlePlaceInput}
            />
            <span 
            id="image-input-error" 
            className="form-input-error" 
            />
            <input 
            ref={urlInputRef}
            id="url-input" 
            className="popup__input image-form__input_about form-input" 
            placeholder="Image URL" 
            type="url" 
            name="link" 
            required
            //onChange={handleUrlInput}
            
            />
            <span 
            id="url-input-error" 
            className="form-input-error" />
        </PopupWithForm>
    )
}


export default AddPlacePopup;