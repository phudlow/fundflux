import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAppData } from '../actions';

import Nav from './Nav';
import Graph from './charts/Graph';
import ProjectsTable from './tables/ProjectsTable';

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
                <Nav />
                {/* App<a href="/logout">Logout</a> */}
                {/* <Graph planId={209} /> */}
                <ProjectsTable
                    checkboxes={true}
                />
                <br/><br/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { fetchedAppData } = state;
    return { fetchedAppData, projects: state.projects };
}

export default connect(mapStateToProps, { fetchAppData })(App);
