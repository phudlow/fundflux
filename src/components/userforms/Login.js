import React from 'react';

import UserForm from './UserForm';

import { userForm } from '../../../locale/en-us';
const { errorMsgs, LOGIN } = userForm;

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

        this.title = LOGIN;

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
                invalidMsg: {
                    email: errorMsgs.INVALID_CREDENTIALS
                },
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
                <nav>
                    <div>FundFlux</div>
                    <div>
                        <a href="/signup">Signup</a>
                    </div>
                </nav>
                {super.render()}
            </div>
        )
    }
}

export default Login;
