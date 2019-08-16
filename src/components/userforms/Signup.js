import React from 'react';

import UserForm from './UserForm';
import SignupSuccessModal from '../modals/SignupSuccessModal';

import { userForm } from '../../../locale/en-us';
const { errorMsgs, SIGN_UP } = userForm;

class Signup extends UserForm {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            invalidMsg: {
                email: undefined,
                password: undefined,
                confirmPassword: undefined
            },
            processingRequest: false,
            accountCreated: false
        }

        this.title = SIGN_UP;

        this.passwordCharRegexes = {
            lowerCase: /[a-z]/,
            upperCase: /[A-Z]/,
            digit: /[0-9]/,
            specialChar: /[ \!"#\$%&'\(\)\*\+,\-\.\/\:;\<\=\>\?@\[\\\]\^_`\{\|\}~]/
        }

        this.unavailableEmails = [];

        this.handleSubmit            = this.handleSubmit.bind(this);
        this.handleCloseSuccessModal = this.handleCloseSuccessModal.bind(this);
    }
    emailValidate(email) {
        let invalidMsg = super.emailValidate(email);

        if (this.unavailableEmails.includes(email)) {
            return errorMsgs.email.EMAIL_UNAVAILABLE;
        }

        return invalidMsg;
    }
    passwordValidate(password) {
        let invalidMsg = super.passwordValidate(password);

        if (invalidMsg) {
            return invalidMsg;
        }

        let numCharTypes = 0;
        for (let charType in this.passwordCharRegexes) {
            if (password.match(this.passwordCharRegexes[charType])) {
                numCharTypes++;
            }
        }
        if (numCharTypes < 3) {
            return errorMsgs.password.PASSWORD_CHAR_REQ_FAIL;
        }

        return invalidMsg;
    }
    confirmPasswordValidate(confirmPassword) {
        if (confirmPassword !== this.state.password) {
            return errorMsgs.password.PASSWORDS_DONT_MATCH;
        }
        return null;
    }
    async handleSubmit(e) {
        e.preventDefault();

        await this.validateInput(null);

        if (this.state.invalidMsg.email || this.state.invalidMsg.password || this.state.invalidMsg.confirmPassword) {
            return;
        }

        this.setState({ processingRequest: true });
        const res = await fetch('/signup', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        });
        
        const data = await res.json();

        if (data.error) {
            if (data.error === 'EMAIL_UNAVAILABLE') {
                this.unavailableEmails.push(this.state.email);
            }
            this.setState({
                invalidMsg: Object.assign({}, this.state.invalidMsg, {
                    email: errorMsgs.email[data.error] || null,
                    password: errorMsgs.password[data.error] || null
                }),
                processingRequest: false
            });
        }

        if (data.message === 'ACCOUNT_CREATED') {
            this.unavailableEmails.push(this.state.email);
            this.setState({
                accountCreated: true
            });
        }
    }
    handleCloseSuccessModal() {
        this.setState({
            accountCreated: false,
            processingRequest: false,
            password: '',
            confirmPassword: ''
        });
    }
    render() {
        return (
            <div id="signup-page">
                <nav>
                    <div>FundFlux</div>
                    <div>
                        <a href="/login">Login</a>
                    </div>
                </nav>
                <form onSubmit={this.handleSubmit}>
                    <h1>{this.title}</h1>
                    <input name="email" type="text" placeholder="Email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        onBlur={this.validateInput}
                        disabled={this.state.processingRequest}
                    />
                    <div className="error">{this.state.invalidMsg.email}</div>
                    <input name="password" type="password" placeholder="Password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        onBlur={this.validateInput}
                        disabled={this.state.processingRequest}
                    />
                    <div className="error">{this.state.invalidMsg.password}</div>
                    <input name="confirmPassword" type="password" placeholder="Confirm Password"
                        value={this.state.confirmPassword}
                        onChange={this.handleChange}
                        onBlur={this.validateInput}
                        disabled={this.state.processingRequest}
                    />
                    <div className="error">{this.state.invalidMsg.confirmPassword}</div>
                    <div>
                        <input type="submit" disabled={this.state.processingRequest} />
                        <span>
                            <a href="/login">Back to login</a>
                        </span>
                    </div>
                </form>
                <SignupSuccessModal
                    email={this.state.email}
                    visible={this.state.accountCreated}
                    onClose={this.handleCloseSuccessModal}
                />
            </div>
        );
    }
}

export default Signup;
