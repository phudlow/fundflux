const { createTestUser } = require('../../utils');

const ROOT = process.env.SERVER_ROOT;

let testUser;

describe('API /appdata endpoint', () => {
    
    beforeAll(async () => {
        testUser = await createTestUser();
        await testUser.login();
    });

    afterAll(async () => {
        await testUser.remove();
    });

    test('placeholder', () => {
        expect(1).toBeTruthy();
    });
});