import React from 'react';
import { connect } from 'react-redux';
import Table from './Table';

function PlansTable (props) {
    if (!props.plans || !props.plans.length) {
        return <div className="no-data">No accounts found.</div>
    }
    return (
        <Table
            checkboxes={props.checkboxes}
            data={props.plans}
            fields={['name', 'description', 'project name']}
        />
    );
}

const mapStateToProps = (state, ownProps) => {
    const projectId = ownProps.projectId;
    return {
        plans: state.projects.byId[projectId].plans.map(planId => {
            const planData = state.plans.byId[planId];
            planData['project name'] = state.projects.byId[projectId].name;
            return planData;
        })
    };
};

export default connect(mapStateToProps)(PlansTable)
