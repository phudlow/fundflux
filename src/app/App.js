import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAppData } from '../actions';
import Graph from './Graph';

class App extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.fetchAppData();
    }
    render() {
        if (!this.props.fetchedAppData) {
            return (
                <h1>LOADING ...</h1>
            );
        }
        return (
            <div id="app-page">
                App
                <a href="/logout">Logout</a>
                <br/><br/>
                <Graph planId={209} />
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { fetchedAppData } = state;
    return { fetchedAppData };
}

export default connect(mapStateToProps, { fetchAppData })(App);
