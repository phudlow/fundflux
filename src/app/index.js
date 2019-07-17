import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import '../common.scss';

class App extends Component {
    constructor(props) {
        super(props);
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
