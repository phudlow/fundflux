import React from 'react';
import Modal from './Modal';

class SignupSuccessModal extends Modal {
    constructor(props) {
        super(props);
    }
    getBodyHtml() {
        const props = this.props;

        return (
            <div>
                <div>
                    <i className="fa fa-camera"></i>
                    <h1>{props.successModalText.SUCCESS}</h1>
                    <br/><br/>
                    {/* {props.successModalText.CHECK_EMAIL} */}
                </div>
                <a href={`/login?email=${encodeURIComponent(props.email)}`}>
                    {props.successModalText.RETURN_TO_LOGIN}
                </a>
            </div>
        )
    }
    render() {
        return super.render();
    }
}

export default SignupSuccessModal;
