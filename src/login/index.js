import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import '../common.scss';

import UserForm from '../shared/UserForm';

import { LOGIN } from '../../locale/en-us/login';

class Login extends UserForm {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            invalidMsg: {
                email: undefined,
                password: undefined
            },
            processingRequest: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }
    async handleSubmit(e) {
        e.preventDefault();

        await this.validateInput(null);

        if (this.state.invalidMsg.email || this.state.invalidMsg.password) {
            return;
        }

        this.setState({ processingRequest: true });
        const res = await fetch('/login', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        });

        const data = await res.json();

        if (data.error) {
            this.setState({
                processingRequest: false
            });
        }

        if (data.message === 'LOGIN_SUCCESSFUL') {
            window.location.href = '/';
        }
    }
    render() {
        return (
            <div id="login-page">
                <div>{LOGIN}</div>
                {super.render()}
            </div>
        )
    }
}

ReactDOM.render(<Login />, document.getElementById('root'));
