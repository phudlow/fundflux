/**
 * Tests creation/deletion of app entities, as well as fetching all via GET /appdata.
 */
const { createTestUser, sortDeep } = require('../../utils');

const ROOT = process.env.SERVER_ROOT;

// Describe testUser's data
const { testData, testData2 } = require('../../testData');

let testUser, testUser2;
describe('API endpoints for app', () => {
    
    beforeAll(async () => {
        testUser =  await createTestUser({ initialData: testData });
        testUser2 = await createTestUser({ initialData: testData2 });
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
