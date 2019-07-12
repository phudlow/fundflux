import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import '../common.scss';

import SignupForm from './SignupForm';
import SuccessModal from './SuccessModal';

import { errorMsgs, ACCOUNT_CREATED } from '../../locale/en-us/signup';

class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            invalidMsg: {
                email: undefined,
                password: undefined
            },
            processingRequest: false,
            accountCreated: false
        }

        this.validationRegexes = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            password: {
                lowerCase: /[a-z]/,
                upperCase: /[A-Z]/,
                digit: /[0-9]/,
                specialChar: /[ \!"#\$%&'\(\)\*\+,\-\.\/\:;\<\=\>\?@\[\\\]\^_`\{\|\}~]/
            }
        }
        this.unavailableEmails = [];

        this.handleChange      = this.handleChange.bind(this);
        this.handleSubmit      = this.handleSubmit.bind(this);
        this.validateInput     = this.validateInput.bind(this);
        this.closeSuccessModal = this.closeSuccessModal.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    validateInput(e) {
        let newInvalidMsg;

        // If no DOM event designating an input is passed, all inputs are validated
        if (e) {
            const inputName = e.target.name;
            newInvalidMsg = {
                [inputName]: this[inputName + 'Validate'](this.state[inputName])
            };
        }
        else {
            newInvalidMsg = {
                email: this['emailValidate'](this.state.email),
                password: this['passwordValidate'](this.state.password)
            };
        }

        return new Promise(resolve => {
            this.setState({
                invalidMsg: Object.assign({}, this.state.invalidMsg, newInvalidMsg)
            }, resolve);
        });
    }
    emailValidate(email) {
        if (!email.length) {
            return errorMsgs.email.EMAIL_MISSING;
        }
        if (!this.validationRegexes.email.test(email)) {
            return errorMsgs.email.EMAIL_INVALID;
        };
        if (this.unavailableEmails.includes(email)) {
            return errorMsgs.email.EMAIL_UNAVAILABLE;
        };
        return null;
    }
    passwordValidate(password) {
        if (!password.length) {
            return errorMsgs.password.PASSWORD_MISSING;
        }
        if (password.length < 8) {
            return errorMsgs.password.PASSWORD_TOO_SHORT;
        }

        let numCharTypes = 0;
        for (let charType in this.validationRegexes.password) {
            if (password.match(this.validationRegexes.password[charType])) {
                numCharTypes++;
            }
        }
        if (numCharTypes < 3) {
            return errorMsgs.password.PASSWORD_CHAR_REQ_FAIL;
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
        const res = await fetch(SERVER_ROOT + '/signup', {
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
    closeSuccessModal() {
        this.setState({
            accountCreated: false,
            processingRequest: false
        })
    }
    render() {
        return (
            <div>
                <SignupForm
                    onSubmit={this.handleSubmit}
                    onChange={this.handleChange}
                    onBlur={this.validateInput}
                    processingRequest={this.state.processingRequest}
                    invalidMsg={this.state.invalidMsg}
                />
                <SuccessModal
                    email={this.state.email}
                    visible={this.state.accountCreated}
                    onClose={this.closeSuccessModal}
                />
            </div>
        );
    }
}

ReactDOM.render(<Signup />, document.getElementById('root'));
