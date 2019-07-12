import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import '../common.scss';

console.log("Loaded LOGIN");

class Login extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                Login
            </div>
        )
    }
}

ReactDOM.render(<Login />, document.getElementById('root'));
