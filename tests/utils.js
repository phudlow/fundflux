const ROOT = process.env.SERVER_ROOT;
const uuid = require('uuid');
const rp = require('request-promise-native');
const rpOpts = {
    resolveWithFullResponse: true,
    json: true,
    jar: true   // for cookies
};

function createTestUser (options = {}) {
    const { email = `${uuid()}@testuser.com`, password = uuid() } = options;

    // Create new instance so that users get their own session cookies
    const client = rp.defaults(rpOpts);

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
        login: () => {
            return new Promise((resolve, reject) => {
                client.post(ROOT + '/login', { body: { email, password } })
                .then(res => resolve(res))
                .catch(err => reject(err));
            });
        }
    };

    return new Promise((resolve, reject) => {
        client.post(ROOT + '/signup', { body: { email, password } })
        .then(res => resolve(userObj))
        .catch(err => resolve(err));
    });
}

async function inputIntoUserForm(page, email, password) {
    if (email !== null) {
        await page.click('input[name=email]');
        await page.keyboard.down('Control');
        await page.keyboard.press('KeyA');
        await page.keyboard.up('Control');
        await page.keyboard.press('Delete');
        await page.keyboard.type(email);
    }
    if (password !== null) {
        await page.click('input[name=password]');
        await page.keyboard.down('Control');
        await page.keyboard.press('KeyA');
        await page.keyboard.up('Control');
        await page.keyboard.press('Delete');
        await page.keyboard.type(password);
    }
}

module.exports = { createTestUser, inputIntoUserForm };
