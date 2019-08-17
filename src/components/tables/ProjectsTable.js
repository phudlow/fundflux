import React from 'react';
import { connect } from 'react-redux';
import Table from './Table';

function ProjectsTable (props) {
    if (!props.data || !props.data.length) {
        return <div className="no-data">No projects found.</div>
    }
    return (
        <Table
            checkboxes={props.checkboxes}
            data={props.projects}
            fields={['name', 'description']}
        />
    );
}

const mapStateToProps = (state) => {
    return {
        projects: Object.values(state.projects.byId)
    };
};

export default connect(mapStateToProps)(ProjectsTable)
