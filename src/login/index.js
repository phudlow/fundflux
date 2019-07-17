import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import '../common.scss';

import UserForm from '../shared/UserForm';

class Login extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div id="login-page">
                Login
                {/* <UserForm /> */}
            </div>
        )
    }
}

ReactDOM.render(<Login />, document.getElementById('root'));
