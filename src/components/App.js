import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAppData } from '../actions';

import Nav from './Nav';
import Graph from './charts/Graph';
import SelectProject from './tables/SelectProject';
import AccountsTable from './tables/AccountsTable';
import PlansTable from './tables/PlansTable';
import Project from './Project';
import ProjectForm from './forms/ProjectForm';

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
                <main>
                    { this.props.currentProjectId ? <Project /> : null }
                    {/* App<a href="/logout">Logout</a> */}
                    {/* <Graph planId={209} /> */}
                    {/* <AccountsTable checkboxes={true} projectId={149} /> */}
                    {/* <PlansTable checkboxes={true} projectId={149} /> */}
                    { this.props.ui.selectingProject ? <SelectProject /> : null }
                    { /* */ }
                    { this.props.ui.editingProjectId ? <ProjectForm /> : null }
                </main>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { fetchedAppData, ui, currentProjectId } = state;
    state = {
        fetchedAppData,
        ui,
        currentProjectId
    };
    return state;
};

const mapDispatchToProps = dispatch => {
    return {
        selectingProject: which => dispatch(selectingProject(which)),
        fetchAppData: fetchAppData(dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
