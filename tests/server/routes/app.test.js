/**
 * Tests creation/deletion of app entities, as well as fetching all via GET /appdata.
 */
const { createTestUser, sortDeep } = require('../../utils');

const ROOT = process.env.SERVER_ROOT;

// Describe testUser's data
const testData = {
    projects: [
        {
            name: "Business",
            description: "For personal accounts",
            accounts: [],
            plans: []
        },
        {
            name: "Personal",
            description: "For personal accounts",
            accounts: [
                {
                    name: "Savings",
                    description: "Lower liquidity savings account."
                },
                {
                    name: "Checking",
                    description: "Personal checking"
                }
            ],
            plans: [
                {
                    name: "Long-term",
                    description: "-- Description --",
                    transactions: []
                },
                {
                    name: "Current",
                    description: null,
                    transactions: [
                        {
                            name: "Investments",
                            description: "Income from investments",
                            start_date: "2010-05-15",
                            frequency: "monthly",
                            deltas: []
                        },
                        {
                            name: "Salary",
                            description: "Income from job",
                            start_date: "2000-01-01",
                            frequency: "biweekly",
                            deltas: [
                                {
                                    accountName: "Checking",
                                    value: "2000.00",
                                    name: "Salary to Checking",
                                    description: "to checking desc"
                                },
                                {
                                    accountName: "Savings",
                                    value: "500.00",
                                    name: "Salary to Savings",
                                    description: "Save up"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

// Describe testUser2's data
const testData2 = {
    projects: [
        {
            name: "Another user's project",
            description: "Another user's project description",
            accounts: [
                {
                    name: "Another user's account",
                    description: "Another user's account description"
                },
            ],
            plans: [
                {
                    name: "Another user's plan",
                    description: "Another user's plan description",
                    transactions: [
                        {
                            name: "Another user's transaction",
                            description: "Another user's transaction description",
                            start_date: "2015-09-07",
                            frequency: "yearly",
                            deltas: [
                                {
                                    accountName: "Another user's account",
                                    value: "70000.00",
                                    name: "Another user's delta",
                                    description: "Another user's delta description"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

// Set testUser data into the database via POST /{entity} routes
// Mutates testData to match form returned by GET /appdata as entities are created and ids are recieved
function setInitialData(user, data) {

    // Create all projects
    return Promise.all(data.projects.map(project => {
        return user.post(ROOT + '/project', {
            body: {
                name: project.name,
                description: project.description
            }
        })
        .then(resBody => {

            // Set id on project and foreign ids on plans and accounts
            project.id = resBody.data.id;
            project.plans.forEach(p => p.project_id = resBody.data.id);
            project.accounts.forEach(a => a.project_id = resBody.data.id);

            // Create all accounts AND plans for this project
            return Promise.all(Array.prototype.concat(
                project.accounts.map(account => {
                    return user.post(ROOT + '/account', {
                        body: {
                            project_id: account.project_id,
                            name: account.name,
                            description: account.description
                        }
                    })
                    .then(resBody => {

                        // Set id on account
                        account.id = resBody.data.id;

                        // Delete the accountName value of each delta within the transactions in this plan,
                        // then put the id of the account with that name on account_id of that delta.
                        // accountName is not a normal field on this data and is used here to reference
                        // an account whose id cannot be known until now, when it's created.
                        // For the sake of testing, account table names are unique in the test data.
                        project.plans.forEach(plan => {
                            plan.transactions.forEach(transaction => {
                                transaction.deltas.forEach(delta => {
                                    if (delta.accountName === resBody.data.name) {
                                        delete delta.accountName;
                                        delta.account_id = resBody.data.id;
                                    }
                                });
                            });
                        });
                    });
                }),
                project.plans.map(plan => {
                    return user.post(ROOT + '/plan', {
                        body: {
                            project_id: plan.project_id,
                            name: plan.name,
                            description: plan.description
                        }
                    })
                    .then(resBody => {

                        // Set id on plan and foreign id on transactions
                        plan.id = resBody.data.id;
                        plan.transactions.forEach(t => t.plan_id = resBody.data.id);

                        // Create all transactions for this plan
                        return Promise.all(plan.transactions.map(transaction => {
                            return user.post(ROOT + '/transaction', {
                                body: {
                                    plan_id: transaction.plan_id,
                                    name: transaction.name,
                                    description: transaction.description,
                                    start_date: transaction.start_date,
                                    frequency: transaction.frequency
                                }
                            })
                            .then(resBody => {

                                // Set id on transaction and foreign id on deltas
                                transaction.id = resBody.data.id;
                                transaction.deltas.forEach(d => d.transaction_id = resBody.data.id);

                                // Create all deltas for this transaction
                                return Promise.all(transaction.deltas.map(delta => {
                                    return user.post(ROOT + '/delta', {
                                        body: {
                                            transaction_id: delta.transaction_id,
                                            account_id: delta.account_id,
                                            value: delta.value,
                                            name: delta.name,
                                            description: delta.description
                                        }
                                    })
                                    .then(resBody => {

                                        // Set id on delta
                                        delta.id = resBody.data.id;
                                    });
                                }));
                            });
                        }));
                    });
                })
            ));
        });
    }));
}

let testUser, testUser2;
describe('API endpoints for app', () => {
    
    beforeAll(async () => {
        testUser = await createTestUser();
        await testUser.login();
        await setInitialData(testUser, testData);

        testUser2 = await createTestUser();
        await testUser2.login();
        await setInitialData(testUser2, testData2);
    }, 15000);

    afterAll(async () => {
        await testUser.remove();
        await testUser2.remove();
    });

    test('Both testUser\'s data fetched via GET /appdata matches expected after creation using POST endpoints', async () => {
        const results = await Promise.all([
            testUser.get(ROOT + '/appdata'),
            testUser2.get(ROOT + '/appdata')
        ]);
        expect(results.map(res => sortDeep(res))).toEqual([
            { data: sortDeep(testData) },
            { data: sortDeep(testData2) }
        ]);
    });

    test('Can delete delta', async () => {
        const delta = testData.projects[1].plans[1].transactions[1].deltas[1];
        await testUser.delete(ROOT + '/delta/' + delta.id);
        testData.projects[1].plans[1].transactions[1].deltas.pop();

        const results = await Promise.all([
            testUser.get(ROOT + '/appdata'),
            testUser2.get(ROOT + '/appdata')
        ]);
        expect(results.map(res => sortDeep(res))).toEqual([
            { data: sortDeep(testData) },
            { data: sortDeep(testData2) }
        ]);
    });

    test('Can delete transaction', async () => {
        const transaction = testData.projects[1].plans[1].transactions[1];
        await testUser.delete(ROOT + '/transaction/' + transaction.id);
        testData.projects[1].plans[1].transactions.pop();

        const results = await Promise.all([
            testUser.get(ROOT + '/appdata'),
            testUser2.get(ROOT + '/appdata')
        ]);
        expect(results.map(res => sortDeep(res))).toEqual([
            { data: sortDeep(testData) },
            { data: sortDeep(testData2) }
        ]);
    });

    test('Can delete plan', async () => {
        const plan = testData.projects[1].plans[1];
        await testUser.delete(ROOT + '/plan/' + plan.id);
        testData.projects[1].plans.pop();

        const results = await Promise.all([
            testUser.get(ROOT + '/appdata'),
            testUser2.get(ROOT + '/appdata')
        ]);
        expect(results.map(res => sortDeep(res))).toEqual([
            { data: sortDeep(testData) },
            { data: sortDeep(testData2) }
        ]);
    });

    test('Can delete account', async () => {
        const account = testData.projects[1].accounts[1];
        await testUser.delete(ROOT + '/account/' + account.id);
        testData.projects[1].accounts.pop();

        const results = await Promise.all([
            testUser.get(ROOT + '/appdata'),
            testUser2.get(ROOT + '/appdata')
        ]);
        expect(results.map(res => sortDeep(res))).toEqual([
            { data: sortDeep(testData) },
            { data: sortDeep(testData2) }
        ]);
    });

    test('Can delete project', async () => {
        const project = testData.projects[1];
        await testUser.delete(ROOT + '/project/' + project.id);
        testData.projects.pop();

        const results = await Promise.all([
            testUser.get(ROOT + '/appdata'),
            testUser2.get(ROOT + '/appdata')
        ]);
        expect(results.map(res => sortDeep(res))).toEqual([
            { data: sortDeep(testData) },
            { data: sortDeep(testData2) }
        ]);
    });

});
