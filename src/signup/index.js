import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import '../common.scss';

import UserForm from '../shared/UserForm';
import SuccessModal from './SuccessModal';

import { userForm } from '../../locale/en-us';
const { errorMsgs, successModalText, SIGN_UP } = userForm;

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

        if (this.state.invalidMsg.email || this.state.invalidMsg.password) {
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
                <div>{SIGN_UP}</div>
                <form onSubmit={this.handleSubmit}>
                    <div className="title">{this.headerText}</div>
                    <div id="email">
                        <label>
                            <input name="email" type="text" placeholder="Email"
                                value={this.state.email}
                                onChange={this.handleChange}
                                onBlur={this.validateInput}
                                disabled={this.state.processingRequest}
                            />
                            <div className="error">{this.state.invalidMsg.email}</div>
                        </label>
                    </div>
                    <div id="password">
                        <label>
                            <input name="password" type="password" placeholder="Password"
                                value={this.state.password}
                                onChange={this.handleChange}
                                onBlur={this.validateInput}
                                disabled={this.state.processingRequest}
                            />
                            <div className="error">{this.state.invalidMsg.password}</div>
                        </label>
                    </div>
                    <div id="confirm-password">
                            <label>
                                <input name="confirmPassword" type="password" placeholder="Confirm Password"
                                    value={this.state.confirmPassword}
                                    onChange={this.handleChange}
                                    onBlur={this.validateInput}
                                    disabled={this.state.processingRequest}
                                />
                                <div className="error">{this.state.invalidMsg.confirmPassword}</div>
                            </label>
                        </div>
                    <input type="submit" disabled={this.state.processingRequest} />
                </form>q
                <SuccessModal
                    email={this.state.email}
                    visible={this.state.accountCreated}
                    onClose={this.handleCloseSuccessModal}
                    successModalText={successModalText}
                />
            </div>
        );
    }
}

ReactDOM.render(<Signup />, document.getElementById('root'));
