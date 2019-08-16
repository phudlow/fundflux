import React from 'react';
import Modal from './Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { signupSuccessModalText } from '../../../locale/en-us.json';
const { SUCCESS, ACCOUNT_CREATED, RETURN_TO_LOGIN } = signupSuccessModalText;

class SignupSuccessModal extends Modal {
    constructor(props) {
        super(props);
    }
    getBodyHtml() {
        const props = this.props;

        return (
            <div>
                <div>
                    <FontAwesomeIcon color="green" icon={['far', 'check-circle']} size="4x"/>
                    <h3>{SUCCESS}</h3>
                    {ACCOUNT_CREATED}
                    {/* {CHECK_EMAIL} */}
                    <br/><br/><br/>
                </div>
                <div className="button" onClick={() => window.location.href = `/login?email=${encodeURIComponent(props.email)}`}>
                    {RETURN_TO_LOGIN}
                </div>
            </div>
        )
    }
    render() {
        return super.render();
    }
}

export default SignupSuccessModal;
