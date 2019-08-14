require('dotenv').config({ path: '.env' });
const args = require('minimist')(process.argv.slice(2));
const { email, password } = args;

const { createTestUser } = require('../tests/utils');

(async function () {
    try {
        const user = await createTestUser({ email, password });
    }
    catch (e) {
        console.log(e);
    }
}())
