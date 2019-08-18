import React from 'react';
import { connect } from 'react-redux';
import Table from './Table';

function AccountsTable (props) {
    if (!props.accounts || !props.accounts.length) {
        return <div className="no-data">No accounts found.</div>
    }
    return (
        <Table
            checkboxes={props.checkboxes}
            data={props.accounts}
            fields={['name', 'description', 'project name']}
        />
    );
}

const mapStateToProps = (state, ownProps) => {
    const projectId = ownProps.projectId;
    return {
        accounts: state.projects.byId[projectId].accounts.map(accountId => {
            const accountData = state.accounts.byId[accountId];
            accountData['project name'] = state.projects.byId[projectId].name;
            return accountData;
        })
    };
};

export default connect(mapStateToProps)(AccountsTable)
