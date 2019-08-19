import React, { Component } from 'react';
import { connect } from 'react-redux';
import Table from './Table';
import Modal from '../modals/Modal';
import { selectedProject, selectingProject, editingProject } from '../../actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignCenter } from '@fortawesome/fontawesome-free-solid';

class SelectProject extends Component {
    constructor(props) {
        super(props);

        this.onRowClick = this.onRowClick.bind(this);
        this.getBodyHtml = this.getBodyHtml.bind(this);
    }
    onRowClick(e) {
        if (e.target.matches('button')) {
            return;
        }
        const projectId = e.currentTarget.getAttribute('data-id');
        this.props.selectedProject(projectId);
    }
    getBodyHtml() {
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
                    fields={['name', 'description', {
                        label: null,
                        content: data => {
                            return (
                                <button onClick={this.props.editingProject.bind(null, data.id)}>Edit</button>
                            );
                        },
                        cellStyle: {
                            textAlign: 'right',
                            padding: 0
                        }
                    }]}
                    onRowClick={this.onRowClick}
                />
            );
        }
        return (
            <div>
                <div>
                    <h3 className="split-space">
                        <span>Select Project</span>
                        <button className="button">
                            <FontAwesomeIcon icon={['fas', 'plus']} />&nbsp;Create
                        </button>
                    </h3>
                </div>
                {table}
            </div>
        );
    }
    render() {
        return (
            <Modal
                getBodyHtml={this.getBodyHtml}
                visible="true"
                includeCloseBtn={!!this.props.currentProjectId}
                onCloseBtnClick={this.props.currentProjectId && this.props.selectingProject.bind(null, false)}
                onOverlayClick={this.props.currentProjectId && this.props.selectingProject.bind(null, false)}
            />
        )
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
        selectedProject: id => dispatch(selectedProject(id)),
        selectingProject: which => dispatch(selectingProject(which)),
        editingProject: id => dispatch(editingProject(id))
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(SelectProject)
