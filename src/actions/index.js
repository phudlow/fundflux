import { RECEIVED_APPDATA, SELECTING_PROJECT, SELECTED_PROJECT } from '../constants';

// Follow Redux convention for normalized stores
function normalizeAppData(data) {
    const result = {
        projects: { byId: {} },
        accounts: { byId: {} },
        plans: { byId: {} },
        transactions: { byId: {} },
        deltas: { byId: {} }
    };

    // For each project
    for (let i = 0, projectsLen = data.projects.length; i < projectsLen; i++) {
        const project = data.projects[i];
        const accounts = project.accounts;
        const plans = project.plans;

        project.accounts = [];
        project.plans = [];

        result.projects.byId[project.id] = project;

        let j, accountsLen, plansLen;

        // For each account within the project
        for (j = 0, accountsLen = accounts.length; j < accountsLen; j++) {
            const account = accounts[j];

            result.accounts.byId[account.id] = account;
            project.accounts.push(account.id);
            delete account.project_id;
        }
        // For each plan within the project
        for (j = 0, plansLen = plans.length; j < plansLen; j++) {
            const plan = plans[j];
            const transactions = plan.transactions;

            plan.transactions = [];

            result.plans.byId[plan.id] = plan;
            project.plans.push(plan.id);
            delete plan.project_id;

            // For each transaction within the plan
            for (let k = 0, tranactionsLen = transactions.length; k < tranactionsLen; k++) {
                const transaction = transactions[k];
                const deltas = transaction.deltas;

                transaction.deltas = [];

                result.transactions.byId[transaction.id] = transaction;
                plan.transactions.push(transaction.id);
                delete transaction.plan_id;

                // For each delta within the transaction
                for (let l = 0, deltasLen = deltas.length; l < deltasLen; l++) {
                    const delta = deltas[l];

                    result.deltas.byId[delta.id] = delta;
                    transaction.deltas.push(delta.id);
                    delete delta.transaction_id;
                }
            }
        }
    }

    // Parse transactions start_date and end_date to Date instances
    Object.values(result.transactions.byId).forEach(transaction => {
        transaction.start_date = transaction.start_date && new Date(transaction.start_date);
        transaction.end_date = transaction.end_date && new Date(transaction.end_date);
    });

    return result;
}

function recievedAppData(data) {
    return {
        type: RECEIVED_APPDATA,
        payload: data
    }
}

export const selectedProject = projectId => {
    return {
        type: SELECTED_PROJECT,
        payload: projectId
    }
};

export const selectingProject = () => {
    return {
        type: SELECTING_PROJECT
    }
};

// "Thunk" to fetch all appdata 
export const fetchAppData = dispatch => {
    return () => {
        return fetch('/appdata')
        .then(
            res => res.json(),
            err => console.log('An error occurred: ', err)
        )
        .then(res => {
            const data = normalizeAppData(res.data);
            data.email = res.email;
            dispatch(recievedAppData(data));
        });
    }
}
