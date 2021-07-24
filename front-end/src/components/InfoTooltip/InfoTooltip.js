import React from 'react';




function InfoTooltips(props) {
    return (

        <div className={`overlay ${(props.isOpen) && 'overlay_popup'}`} >
            <div className={`popup`}>
                <button className="close-icon" onClick={props.onClose} type="button"> </button>
                {props.success ?
                    <>
                        <div className='popup__image popup__image_ok'></div>
                        <p className='popup__text'>Success! You have now been registered.</p>
                    </>
                    :
                    <>
                        <div className='popup__image popup__image_notok'></div>
                        <p className='popup__text'>Oops, something went wrong! Please try again.</p>
                    </>
                }
            </div>
        </div>

        

        
    )
}

export default InfoTooltips;