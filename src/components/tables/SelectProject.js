import React, { Component } from 'react';
import { connect } from 'react-redux';
import Table from './Table';
import { selectedProject } from '../../actions';

class SelectProject extends Component {
    constructor(props) {
        super(props);

        this.onRowClick = this.onRowClick.bind(this);
    }
    onRowClick(e) {
        const projectId = e.currentTarget.getAttribute('data-id');
        this.props.selectedProject(projectId);
    }
    render() {
        let table;
        if (!this.props.projects || !this.props.projects.length) {
            table = (
                <div className="no-data">
                    <h3>No projects found.</h3>
                    <div>Click Create Project to make one!</div>
                </div>
            );
        }
        else {
            table = (
                <Table
                    checkboxes={!!this.props.currentProjectId}
                    whichChecked={this.props.currentProjectId}
                    data={this.props.projects}
                    fields={['name', 'description']}
                    onRowClick={this.onRowClick}
                />
            );
        }
        return (
            <div>
                <div className="split">
                    <h1>Select Project</h1>
                    <div className="button">Create Project</div>
                </div>
                {table}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        currentProjectId: state.currentProjectId,
        projects: Object.values(state.projects.byId)
    };
};

const mapDispatchToProps = dispatch => {
    return {
        selectedProject: id => dispatch(selectedProject(id))
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(SelectProject)
