import React, { Component } from 'react';

import { userForm } from '../../../locale/en-us';
const { errorMsgs } = userForm;

class UserForm extends Component {
    constructor(props) {
        super(props);

        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        this.handleChange  = this.handleChange.bind(this);
        this.validateInput = this.validateInput.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    validateInput(e) {
        let newInvalidMsg = {};

        // If no DOM event designating an input is passed, all inputs are validated
        if (e) {
            const inputName = e.target.name;
            newInvalidMsg[inputName] = this[inputName + 'Validate'](this.state[inputName]);
        }
        else {
            for (const inputName in this.state.invalidMsg) {
                newInvalidMsg[inputName] = this[inputName + 'Validate'](this.state[inputName]);
            }
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
        if (!this.emailRegex.test(email)) {
            return errorMsgs.email.EMAIL_INVALID;
        }
        return null;
    }
    passwordValidate(password) {
        if (!password.length) {
            return errorMsgs.password.PASSWORD_MISSING;
        }
        if (password.length < 8) {
            return errorMsgs.password.PASSWORD_TOO_SHORT;
        }
        return null;
    }
    render() {
        return (
            <form className="userform" onSubmit={this.handleSubmit}>
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
                <div>
                    <input type="submit" disabled={this.state.processingRequest} />
                    <span>
                        <span style={{display: 'inline-block'}}>Don't have an account?</span>
                        <span style={{display: 'inline-block'}}>&nbsp;Sign up&nbsp;<a href="/signup">here</a>.</span>
                    </span>
                </div>
            </form>
        );
    }
}

export default UserForm;
