/**
 * Tests creation/deletion of app entities, as well as fetching all via GET /appdata.
 */
const { createTestUser, sortDeep } = require('../../utils');

const ROOT = process.env.SERVER_ROOT;

// Describe testUser's data
let { testData, testData2 } = require('../../testData');

let testUser, testUser2;
describe('API endpoints for app', () => {
    
    beforeAll(async () => {
        testUser =  await createTestUser({ initialData: testData });
        testUser2 = await createTestUser({ initialData: testData2 });

        testData = { data: testData, email: testUser.email };
        testData2 = { data: testData2, email: testUser2.email };
    }, 20000);

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
            sortDeep(testData),
            sortDeep(testData2)
        ]);
    });

    test('Can delete delta', async () => {
        const delta = testData.data.projects[1].plans[1].transactions[1].deltas[1];
        await testUser.delete(ROOT + '/delta/' + delta.id);
        testData.data.projects[1].plans[1].transactions[1].deltas.pop();

        const results = await Promise.all([
            testUser.get(ROOT + '/appdata'),
            testUser2.get(ROOT + '/appdata')
        ]);
        expect(results.map(res => sortDeep(res))).toEqual([
            sortDeep(testData),
            sortDeep(testData2)
        ]);
    });

    test('Can delete transaction', async () => {
        const transaction = testData.data.projects[1].plans[1].transactions[1];
        await testUser.delete(ROOT + '/transaction/' + transaction.id);
        testData.data.projects[1].plans[1].transactions.pop();

        const results = await Promise.all([
            testUser.get(ROOT + '/appdata'),
            testUser2.get(ROOT + '/appdata')
        ]);
        expect(results.map(res => sortDeep(res))).toEqual([
            sortDeep(testData),
            sortDeep(testData2)
        ]);
    });

    test('Can delete plan', async () => {
        const plan = testData.data.projects[1].plans[1];
        await testUser.delete(ROOT + '/plan/' + plan.id);
        testData.data.projects[1].plans.pop();

        const results = await Promise.all([
            testUser.get(ROOT + '/appdata'),
            testUser2.get(ROOT + '/appdata')
        ]);
        expect(results.map(res => sortDeep(res))).toEqual([
            sortDeep(testData),
            sortDeep(testData2)
        ]);
    });

    test('Can delete account', async () => {
        const account = testData.data.projects[1].accounts[1];
        await testUser.delete(ROOT + '/account/' + account.id);
        testData.data.projects[1].accounts.pop();

        const results = await Promise.all([
            testUser.get(ROOT + '/appdata'),
            testUser2.get(ROOT + '/appdata')
        ]);
        expect(results.map(res => sortDeep(res))).toEqual([
            sortDeep(testData),
            sortDeep(testData2)
        ]);
    });

    test('Can delete project', async () => {
        const project = testData.data.projects[1];
        await testUser.delete(ROOT + '/project/' + project.id);
        testData.data.projects.pop();

        const results = await Promise.all([
            testUser.get(ROOT + '/appdata'),
            testUser2.get(ROOT + '/appdata')
        ]);
        expect(results.map(res => sortDeep(res))).toEqual([
            sortDeep(testData),
            sortDeep(testData2)
        ]);
    });

});
