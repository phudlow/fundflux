import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import '../common.scss';

class App extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        fetch('/appdata')
        .then(res => {
            return res.json();
        })
        .then(res => console.log(res));
    }
    render() {
        return (
            <div id="app-page">
                App
                <a href="/logout">Logout</a>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
