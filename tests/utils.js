const ROOT = process.env.SERVER_ROOT;
const uuid = require('uuid');
const rp = require('request-promise-native').defaults({ 
    resolveWithFullResponse: true,
    json: true 
});

function createTestUser (options = {}) {
    const { email = `${uuid()}@testuser.com`, password = uuid() } = options;

    const userObj = {
        email,
        password,
        remove: () => {
            return new Promise((resolve, reject) => {
                rp.post(ROOT + '/delete-account', { body: { email, password } })
                .then(res => resolve(res))
                .catch(err => reject(err));
            })
        },
        // login: () => {}
    };

    return new Promise((resolve, reject) => {
        rp.post(ROOT + '/signup', { body: { email, password } })
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
