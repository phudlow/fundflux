const { query } = require('../db');

let res;

describe('Database connection', () => {
    test('can connect to database', async () => {
        res = await query('SELECT NOW()');

        expect(res.rowCount).toBe(1);
        expect(res.rows[0].now).toBeTruthy();
    });

    test('app cannot drop tables', async () => {
        try { await query('DROP TABLE session'); }
        catch (err) {
            expect(err.toString()).toBe('error: must be owner of relation session');
        }
    });
});
