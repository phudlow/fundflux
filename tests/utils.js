const ROOT = process.env.SERVER_ROOT;
const uuid = require('uuid');
const rp = require('request-promise-native');
const _ = require('lodash');
const sortAny = require('sort-any');

function createTestUser (options = {}) {
    const { email = `${uuid()}@testuser.com`, password = uuid() } = options;

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

module.exports = { createTestUser, inputIntoUserForm, sortDeep };
