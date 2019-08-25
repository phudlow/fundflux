import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from '../modals/Modal';
import { editingProject, postProject } from '../../actions';

class ProjectForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            awaitingResponse: false,
            name: this.props.project.name || '',
            description: this.props.project.description || ''
        };

        this.getBodyHtml = this.getBodyHtml.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        if (this.state.awaitingResponse) {
            return;
        }
        this.props.postProject({
            id: this.props.project.id,
            name: this.state.name,
            description: this.state.description
        });
    }
    getBodyHtml() {
        return (
            <form onSubmit={this.handleSubmit} autoComplete="off">
                <h3>{`${this.props.project.id ? 'Update' : 'Create'} Project`}</h3>
                <label>
                    Name:
                    <input type="text" name="name" onChange={this.handleChange} value={this.state.name} />
                </label>
                <br/><br/>
                <label>
                    Description:
                    <input type="text" name="description" onChange={this.handleChange} value={this.state.description} />
                </label>
                <br/><br/>
                <div>
                    <div className="button red">Delete</div>
                    <div>
                        <div className="button white cancel" onClick={this.props.editingProject.bind(null, null)}>Cancel</div>
                        <input type='Submit' className="button" defaultValue="Save" />
                    </div>
                </div>
            </form>
        );
    }
    render() {
        return (
            <Modal
                visible="true"
                getBodyHtml={this.getBodyHtml}
                onCloseBtnClick={this.props.editingProject.bind(null, null)}
            />
        )
    }
}

const mapStateToProps = state => {
    const projectId = state.ui.editingProjectId;
    return {
        project: projectId === 'new' ? {} : state.projects.byId[projectId]
    };
};

const mapDispatchToProps = dispatch => {
    return {
        editingProject: id => dispatch(editingProject(id)),
        postProject: data => postProject(dispatch)(data),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectForm);
