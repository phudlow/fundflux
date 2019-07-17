import React from 'react';

function SuccessModal(props) {
    return (
        <div id="signup-success-modal" className={props.visible ? 'visible' : ''} >
            <div className="close-btn" onClick={props.onClose}>✕</div>
            <div>
                {props.successModalText.SUCCESS}
                <br/><br/>
                {props.successModalText.CHECK_EMAIL}
            </div>
            <a href={`/login?email=${encodeURIComponent(props.email)}`}>
                {props.successModalText.RETURN_TO_LOGIN}
            </a>
        </div>
    );
}

export default SuccessModal;
