import React from 'react';

function SuccessModal(props) {
    return (
        <div id="signup-success-modal" className={props.visible ? 'visible' : ''} >
            <div className="close-btn" onClick={props.onClose}>✕</div>
            <div>
                Success! Your account has been created.
                Please check your email to verify your account before logging in.
            </div>
            <a href={`/login?email=${encodeURIComponent('asd asd~asd#'+props.email)}`}>Return to Login</a>
        </div>
    );
}

export default SuccessModal;
