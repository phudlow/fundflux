const rp = require('request-promise-native').defaults({ 
    resolveWithFullResponse: true,
    json: true 
});

const ROOT = process.env.SERVER_ROOT;
const {
    EMAIL_MISSING,
    EMAIL_INVALID,
    PASSWORD_MISSING,
    PASSWORD_TOO_SHORT,
    PASSWORD_CHAR_REQ_FAIL,
    ACCOUNT_CREATED,
    ACCOUNT_DELETED,
    EMAIL_UNAVAILABLE,
    INVALID_CREDENTIALS,
} = require('../locale/en-us');

const email    = 'foo@bar.com';
const password = 'p@ssword123';
let res;

describe('Account Creation', () => {
    test('cannot create an account with no email', async () => {
    
        // Blank email
        try { await rp.post(ROOT + '/signup', { body: { email: '', password } }); }
        catch (err) { res = err.response; }
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe(EMAIL_MISSING);
        expect(res.body.message).toBeFalsy();

        // No email
        try { await rp.post(ROOT + '/signup', { body: { password } }); } 
        catch (err) { res = err.response; }
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe(EMAIL_MISSING);
        expect(res.body.message).toBeFalsy();
    });

    test('cannot create an account with invalid email format', async () => {
        try { await rp.post(ROOT + '/signup', { body: { email:'foo@bar@baz.com', password } }); } 
        catch (err) { res = err.response; }
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe(EMAIL_INVALID);
        expect(res.body.message).toBeFalsy();
    });

    test('cannot create an account with no password', async () => {

        // Blank password
        try { await rp.post(ROOT + '/signup', { body: { password: '', email } }); } 
        catch (err) { res = err.response; }
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe(PASSWORD_MISSING);
        expect(res.body.message).toBeFalsy();

        // No password
        try { await rp.post(ROOT + '/signup', { body: { email } }); } 
        catch (err) { res = err.response; }
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe(PASSWORD_MISSING);
        expect(res.body.message).toBeFalsy();
    });

    test('cannot create an account with a password that is too short', async () => {
        try { await rp.post(ROOT + '/signup', { body: { password: 'aD3@', email } }); } 
        catch (err) { res = err.response; }
        expect(res.statusCode).toBe(422);
        expect(res.body.error).toBe(PASSWORD_TOO_SHORT);
        expect(res.body.message).toBeFalsy();
    });

    test('cannot create an account with a password that does not meet character requirements', () => {
        const invalidPasswords = [ 'CheeseQuakeR', '9@$#31337', 'FR13ND1M13', 'nathan4u' ];

        invalidPasswords.forEach(async pw => {
            try { await rp.post(ROOT + '/signup', { body: { password: pw, email } }); }
            catch (err) { res = err.response; }
            expect(res.statusCode).toBe(422);
            expect(res.body.error).toBe(PASSWORD_CHAR_REQ_FAIL);
            expect(res.body.message).toBeFalsy();
        });
    });

    test('can create an account', async () => {
        res = await rp.post(ROOT + '/signup', { body: { email, password } });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe(ACCOUNT_CREATED);
        expect(res.body.error).toBeFalsy();
    });

    test('cannot create an account with an email that is already taken', async () => {
        try { await rp.post(ROOT + '/signup', { body: { email, password } }); }
        catch (err) { res = err.response; }
        expect(res.statusCode).toBe(409);
        expect(res.body.error).toBe(EMAIL_UNAVAILABLE);
        expect(res.body.message).toBeFalsy();
    });
});

describe('Account Deletion', () => {
    test('cannot delete an account using incorrect credentials', async () => {
        try { await rp.post(ROOT + '/delete-account', { body: { email, password: 'wordp@ss321' } }); }
        catch (err) { res = err.response; }
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe(INVALID_CREDENTIALS);
        expect(res.body.message).toBeFalsy();
    });

    test('can delete an account', async () => {
        res = await rp.post(ROOT + '/delete-account', { body: { email, password } });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe(ACCOUNT_DELETED);
        expect(res.body.error).toBeFalsy();
    });

    test('can create an account using email of deleted account', async () => {
        res = await rp.post(ROOT + '/signup', { body: { email, password } });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe(ACCOUNT_CREATED);
        expect(res.body.error).toBeFalsy();

        // Clean-up
        res = await rp.post(ROOT + '/delete-account', { body: { email, password } });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe(ACCOUNT_DELETED);
        expect(res.body.error).toBeFalsy();
    });
});
