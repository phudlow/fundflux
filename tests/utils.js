const ROOT = process.env.SERVER_ROOT;
const uuid = require('uuid');
const rp = require('request-promise-native');
const _ = require('lodash');
const sortAny = require('sort-any');

function createTestUser (options = {}) {
    const {
        email = `${uuid()}@testuser.com`,
        password = uuid(),
        login = true,
        initialData = require('./testData').testData
    } = options;

    // Create new instance so that users get their own session cookies
    const client = rp.defaults({
        json: true,
        jar: rp.jar()
    });

    const userObj = {
        email,
        password,
        client,
        get: client.get,
        post: client.post,
        delete: client.delete,
        put: client.put,
        remove: () => {
            return new Promise((resolve, reject) => {
                client.post(ROOT + '/delete-account', { body: { email, password } })
                .then(res => resolve(res))
                .catch(err => reject(err));
            })
        },
        login: function () {
            return new Promise((resolve, reject) => {
                client.post(ROOT + '/login', { body: { email, password } })
                .then(res => {
                    this.loggedIn = true;
                    resolve(res);
                })
                .catch(err => reject(err));
            });
        },
        logout: function () {
            return new Promise((resolve, reject) => {
                client.post(ROOT + '/logout')
                .then(res => {
                    this.loggedIn = false;
                    resolve(res);
                })
                .catch(err => reject(err));
            });
        }
    };

    return new Promise((resolve, reject) => {
        client.post(ROOT + '/signup', { body: { email, password } })
        .then(() => login || initialData       ? userObj.login()                      : Promise.resolve())
        .then(() => initialData                ? setInitialData(userObj, initialData) : Promise.resolve())
        .then(() => !login && userObj.loggedIn ? userObj.logout()                     : Promise.resolve())
        .then(() => resolve(userObj))
        .catch(err => reject(err));
    });
}

async function inputIntoUserForm(page, email, password, confirmPassword) {
    if (typeof email === 'string') {
        await page.click('input[name=email]');
        await page.keyboard.down('Control');
        await page.keyboard.press('KeyA');
        await page.keyboard.up('Control');
        await page.keyboard.press('Delete');
        await page.keyboard.type(email);
    }
    if (typeof password === 'string') {
        await page.click('input[name=password]');
        await page.keyboard.down('Control');
        await page.keyboard.press('KeyA');
        await page.keyboard.up('Control');
        await page.keyboard.press('Delete');
        await page.keyboard.type(password);
    }
    if (typeof confirmPassword === 'string') {
        await page.click('input[name=confirmPassword]');
        await page.keyboard.down('Control');
        await page.keyboard.press('KeyA');
        await page.keyboard.up('Control');
        await page.keyboard.press('Delete');
        await page.keyboard.type(confirmPassword);
    }
}

function sortDeep (object) {
    if (!Array.isArray(object)) {
        if (!(typeof object === 'object') || object === null) {
            return object;
        }
        return _.mapValues(object, sortDeep);
    }
    return sortAny(object.map(sortDeep));
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

                        // Delete the accountName/fromAccountName value of each delta within the transactions in
                        // this plan, then put the id of the account with that name on account_id of that delta.
                        // accountName and fromAccountName is not a normal field on this data and is used here
                        // to reference an account whose id cannot be known until now, when it's created.
                        // For the sake of testing, account table names are unique in the test data.
                        project.plans.forEach(plan => {
                            plan.transactions.forEach(transaction => {
                                transaction.deltas.forEach(delta => {
                                    if (delta.accountName === resBody.data.name) {
                                        delete delta.accountName;
                                        delta.account_id = resBody.data.id;
                                    }
                                    if (delta.fromAccountName === resBody.data.name) {
                                        delete delta.fromAccountName;
                                        delta.from_account_id = resBody.data.id;
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
                                    end_date: transaction.end_date,
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
                                            from_account_id: delta.from_account_id,
                                            value: delta.value,
                                            formula: delta.formula,
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

module.exports = { createTestUser, inputIntoUserForm, sortDeep, setInitialData };
