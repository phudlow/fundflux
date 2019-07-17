const rp = require('request-promise-native').defaults({ 
    resolveWithFullResponse: true,
    json: true 
});
const { inputIntoUserForm } = require('../utils');

const errorMsgs = require('../../locale/en-us').userForm.errorMsgs;
const email     = 'foo.bar@bar.com';
const password  = 'S3CRET_PW';
const email2    = 'bar.foo@foo.com';
const password2 = 'pa55w0rd!';
let browser, page, invalidMsg, res;

describe('Signup end-to-end functionality', () => {
    beforeAll(async () => {
        browser = await require('puppeteer').launch({
            headless: false,
            executablePath: process.env.CHROME_PATH
        });
        page = (await browser.pages())[0];

        // Go to signup page
        await page.goto(process.env.SERVER_ROOT + '/signup');
        await page.waitForSelector('#signup-page');
    });

    afterAll(async () => {
        await page.close();

        // Clean up 2 created accounts
        res = await rp.post(process.env.SERVER_ROOT + '/delete-account', { body: { email, password } });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('ACCOUNT_DELETED');
        expect(res.body.error).toBeFalsy();
        res = await rp.post(process.env.SERVER_ROOT + '/delete-account', { body: { email: email2, password: password2 } });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('ACCOUNT_DELETED');
        expect(res.body.error).toBeFalsy();
    });

    test('Shows error message if submitting with no email', async () => {
        await inputIntoUserForm(page, '', password);
        await page.keyboard.press('Enter');
        invalidMsg = await page.$eval('#email div.error', el => el.innerText);
        expect(invalidMsg).toBe(errorMsgs.email.EMAIL_MISSING);
    });

    test('Shows error message if submitting with invalid email', async () => {
        await inputIntoUserForm(page, 'foo.bar@bar@bar.foo', password);
        await page.keyboard.press('Enter');
        invalidMsg = await page.$eval('#email div.error', el => el.innerText);
        expect(invalidMsg).toBe(errorMsgs.email.EMAIL_INVALID);
    });

    test('Shows error message if submitting with no password', async () => {
        await inputIntoUserForm(page, email, '');
        await page.keyboard.press('Enter');
        invalidMsg = await page.$eval('#password div.error', el => el.innerText);
        expect(invalidMsg).toBe(errorMsgs.password.PASSWORD_MISSING);
    });

    test('Shows error message if submitting with a password that is too short', async () => {
        await inputIntoUserForm(page, email, 'E3S$');
        await page.keyboard.press('Enter');
        invalidMsg = await page.$eval('#password div.error', el => el.innerText);
        expect(invalidMsg).toBe(errorMsgs.password.PASSWORD_TOO_SHORT);
    });

    test('Shows error message if submitting with a password that does not meet character type requirements', async () => {
        await inputIntoUserForm(page, email, 'yoda4prez4229');
        await page.keyboard.press('Enter');
        invalidMsg = await page.$eval('#password div.error', el => el.innerText);
        expect(invalidMsg).toBe(errorMsgs.password.PASSWORD_CHAR_REQ_FAIL);
    });

    test('Shows modal when successful', async () => {
        await inputIntoUserForm(page, email, password);
        await page.keyboard.press('Enter');
        expect(await page.waitForSelector('#signup-success-modal', { visible: true })).toBeTruthy();
    });

    test('Click close btn, clears password but keeps email', async () => {
        await page.click('#signup-success-modal .close-btn');
        expect(await page.waitForSelector('#signup-success-modal', { visible: false })).toBeTruthy();
        expect(await page.$eval('input[name=email]', el => el.value)).toBe(email);
        expect(await page.$eval('input[name=password]', el => el.value)).toBeFalsy();
    });

    test('Shows error message if submitting with an email that is unavailable', async () => {
        await inputIntoUserForm(page, null, password);
        await page.click('input[type=submit]');
        invalidMsg = await page.$eval('#email div.error', el => el.innerText);
        expect(invalidMsg).toBe(errorMsgs.email.EMAIL_UNAVAILABLE);
    });

    test('Put in second valid combination, shows modal', async () => {
        await inputIntoUserForm(page, email2, password2);
        await page.click('input[type=submit]');
        expect(await page.waitForSelector('#signup-success-modal', { visible: true })).toBeTruthy();
    });

    test('Clicking link in modal returns to login page', async () => {
        await page.click('#signup-success-modal a');
        expect(await page.waitForSelector('#login-page')).toBeTruthy();
        expect(page.url().includes('/login')).toBeTruthy();
    });
}, 15000);
