const { query } = require('../db');
const router = require('express').Router();

router.get('/', (req, res) => {
    res.sendFile('app.html', { root: './dist' });
});

router.get('/appdata', async (req, res) => {
    const selectProjectsByUserId = 
        'SELECT id, name, description FROM project WHERE user_id=$1';
    const selectAccountsByProjectId = 
        'SELECT id, project_id, name, description FROM account WHERE project_id=$1';
    const selectPlansByProjectId =
        'SELECT id, project_id, name, description FROM plan WHERE project_id=$1';
    const selectTransationsByPlan = 
        'SELECT id, plan_id, name, description, start_date, end_date, frequency FROM transaction_event WHERE plan_id=$1';
    const selectDeltasByTransation =
        'SELECT id, transaction_id, account_id, from_account_id, name, description, value, formula FROM delta WHERE transaction_id=$1';

    // Fetch all project data
    const projects = (await query(selectProjectsByUserId, [req.user.id])).rows;

    // For each project, fetch plan and account data
    await Promise.all(projects.map(project => {
        return new Promise(async (resolve) => {

            const getAccountsForProject = query(selectAccountsByProjectId, [project.id])
            .then(accounts => project.accounts = accounts.rows );

            const getPlansForProject = query(selectPlansByProjectId, [project.id])
            .then(async plans => {
                project.plans = plans.rows;

                // For each plan, fetch transaction data
                await Promise.all(project.plans.map(plan => {
                    return new Promise(async (resolve) => {

                        await query(selectTransationsByPlan, [plan.id])
                        .then(async transactions => {

                            // node-postgres makes date values new Date()s, we just want a simple string
                            plan.transactions = transactions.rows.map(row => {
                                row.start_date = row.start_date.toISOString().split('T')[0];
                                row.end_date = row.end_date && row.end_date.toISOString().split('T')[0];
                                return row;
                            });

                            // For each transaction, fetch delta data
                            await Promise.all(plan.transactions.map(transaction => {
                                return new Promise(async (resolve) => {
                                    await query(selectDeltasByTransation, [transaction.id])
                                    .then(deltas => transaction.deltas = deltas.rows);
                                    resolve();
                                });
                            }));
                        });
                        resolve();
                    });
                }));
            });

            await Promise.all([getAccountsForProject, getPlansForProject]);
            resolve();
        });
    }));

    res.json({ data: { projects }, email: req.user.email });
});

module.exports = router;
