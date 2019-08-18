import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAppData, selectingProject } from '../actions';

import Nav from './Nav';
import Graph from './charts/Graph';
import SelectProject from './tables/SelectProject';
import AccountsTable from './tables/AccountsTable';
import PlansTable from './tables/PlansTable';

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
                    { this.props.ui.selectingProject ? <SelectProject /> : null }
                    <div style={{'border-bottom': '1px solid #ddd'}}>
                        <h1 onClick={() => this.props.selectingProject()}>Project</h1>
                        {this.props.currentProjectName}
                    </div>
                    {/* App<a href="/logout">Logout</a> */}
                    {/* <Graph planId={209} /> */}
                    {/* <AccountsTable checkboxes={true} projectId={149} /> */}
                    {/* <PlansTable checkboxes={true} projectId={149} /> */}
                </main>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { fetchedAppData, ui } = state;
    state = {
        fetchedAppData,
        ui,
        currentProjectName: state.projects && state.currentProjectId && state.projects.byId[state.currentProjectId].name
    };
    return state;
};

const mapDispatchToProps = dispatch => {
    return {
        selectingProject: () => dispatch(selectingProject()),
        fetchAppData: fetchAppData(dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
