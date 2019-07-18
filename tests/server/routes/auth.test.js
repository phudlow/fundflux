const rp = require('request-promise-native').defaults({ 
    resolveWithFullResponse: true,
    json: true,
    jar: true // Save and send cookies
});

const ROOT = process.env.SERVER_ROOT;

let res, testUser, email, password;

describe('Authentication', () => {
    beforeAll(async () => {
        testUser = await require('../../utils').createTestUser();
        email    = testUser.email;
        password = testUser.password;
    });

    afterAll(async () => {
        await testUser.remove();
    });

    test('cannot login with unrecognized email', async () => {
        try { await rp.post(ROOT + '/login', { body: { email: 'not_exists_email@mail.com', password } }); }
        catch (err) { res = err.response; }
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe('INVALID_CREDENTIALS');
        expect(res.body.message).toBeFalsy();
    });

    test('cannot login with unrecognized password', async () => {
        try { await rp.post(ROOT + '/login', { body: { email, password: 'Wr0ngP@$SworD' } }); }
        catch (err) { res = err.response; }
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe('INVALID_CREDENTIALS');
        expect(res.body.message).toBeFalsy();
    });

    test('can login', async () => {
        res = await rp.post(ROOT + '/login', { body: { email, password } });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('LOGIN_SUCCESSFUL');
        expect(res.body.error).toBeFalsy();
    });

    test('going to /login while logged-in redirects to home', async () => {
        const res = await rp.get(ROOT + '/login');
        expect(res.req.path).toBe('/')
        expect(res.statusCode).toBe(200);
    });

    test('can logout, redirects to login', async () => {
        const res = await rp.get(ROOT + '/logout');
        expect(res.req.path).toBe('/login?fromLogout=true');
        expect(res.statusCode).toBe(200);
    });

    test('going to logout when logged-out redirects to login', async () => {
        const res = await rp.get(ROOT + '/logout');
        expect(res.req.path).toBe('/login');
        expect(res.statusCode).toBe(200);
    });

    test('going to home when logged-out redirects to login', async () => {
        const res = await rp.get(ROOT + '/');
        expect(res.req.path).toBe('/login');
        expect(res.statusCode).toBe(200);
    });
});
