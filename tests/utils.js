const rp = require('request-promise-native').defaults({ 
    resolveWithFullResponse: true,
    json: true 
});
const uuid  = require('uuid');

const ROOT = process.env.SERVER_ROOT;

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
        }
    };

    return new Promise((resolve, reject) => {
        rp.post(ROOT + '/signup', { body: { email, password } })
        .then(res => resolve(userObj))
        .catch(err => resolve(err));
    });
}

module.exports = { createTestUser };
