import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectingProject } from '../actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Project extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <div id="project-indicator">
                    <span>
                        <span className="bold">Project:&nbsp;</span>
                        <div className="button white" onClick={() => this.props.selectingProject(true)}>
                            {this.props.currentProjectName}&nbsp;
                            <FontAwesomeIcon icon={['fas', 'caret-down']} />
                        </div>
                    </span>
                    {/* <div className="button">Manage Projects</div> */}
                </div>
                <div className="split-space">
                    {/* <div id="plan-indicator" className="split-space"> */}
                        <span>
                            <span className="bold">Plan:&nbsp;</span>
                            <div className="button white" onClick={() => this.props.selectingProject(true)}>
                                {"Default"}&nbsp;
                                <FontAwesomeIcon icon={['fas', 'caret-down']} />
                            </div>
                        </span>
                        {/* <div className="button">Manage Plans</div> */}
                    {/* </div> */}
                    {/* <div id="plan-indicator" className="split-space"> */}
                        {/* <span> */}
                            {/* <span className="bold">Project:&nbsp;</span> */}
                            {/* <div className="button white" onClick={() => this.props.selectingProject(true)}> */}
                                {/* {this.props.currentProjectName}&nbsp; */}
                                {/* <FontAwesomeIcon icon={['fas', 'caret-down']} /> */}
                            {/* </div> */}
                        {/* </span> */}
                        <div className="button">Accounts (2)</div>
                    {/* </div> */}
                </div>
            </div>
        );
    }
}

//currentProjectName: state.projects && state.currentProjectId && state.projects.byId[state.currentProjectId].name
const mapStateToProps = state => {
    return {
        currentProjectName: state.projects && state.currentProjectId && state.projects.byId[state.currentProjectId].name
    };
};

const mapDispatchToProps = dispatch => {
    return {
        selectingProject: () => dispatch(selectingProject(true))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Project);
