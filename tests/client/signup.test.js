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
        await inputIntoUserForm(page, '', password, password);
        await page.keyboard.press('Enter');
        invalidMsg = await page.$eval('[name=email] + div.error', el => el.innerText);
        expect(invalidMsg).toBe(errorMsgs.email.EMAIL_MISSING);
    });

    test('Shows error message if submitting with invalid email', async () => {
        await inputIntoUserForm(page, 'foo.bar@bar@bar.foo', password, password);
        await page.keyboard.press('Enter');
        invalidMsg = await page.$eval('[name=email] + div.error', el => el.innerText);
        expect(invalidMsg).toBe(errorMsgs.email.EMAIL_INVALID);
    });

    test('Shows error message if submitting with no password', async () => {
        await inputIntoUserForm(page, email, '', '');
        await page.keyboard.press('Enter');
        invalidMsg = await page.$eval('[name=password] + div.error', el => el.innerText);
        expect(invalidMsg).toBe(errorMsgs.password.PASSWORD_MISSING);
    });

    test('Shows error message if submitting with a password that is too short', async () => {
        await inputIntoUserForm(page, email, 'E3S$', 'E3S$');
        await page.keyboard.press('Enter');
        invalidMsg = await page.$eval('[name=password] + div.error', el => el.innerText);
        expect(invalidMsg).toBe(errorMsgs.password.PASSWORD_TOO_SHORT);
    });

    test('Shows error message if submitting with a password that does not meet character type requirements', async () => {
        await inputIntoUserForm(page, email, 'yoda4prez4229', 'yoda4prez4229');
        await page.keyboard.press('Enter');
        invalidMsg = await page.$eval('[name=password] + div.error', el => el.innerText);
        expect(invalidMsg).toBe(errorMsgs.password.PASSWORD_CHAR_REQ_FAIL);
    });

    test('Shows error message if submitting with password and confirm password fields that don\'t contain the same value.', async () => {
        await inputIntoUserForm(page, email, password, 'yoda4prez4229');
        await page.keyboard.press('Enter');
        await new Promise((resolve, reject) => {
            window.setTimeout(() => {
                resolve();
            }, 3000);
        });
        invalidMsg = await page.$eval('[name=confirmPassword] + div.error', el => el.innerText);
        expect(invalidMsg).toBe(errorMsgs.password.PASSWORDS_DONT_MATCH);
    });

    test('Shows modal when successful', async () => {
        await inputIntoUserForm(page, email, password, password);
        await page.keyboard.press('Enter');
        expect(await page.waitForSelector('.modal-container', { visible: true })).toBeTruthy();
    });

    test('Click close btn, clears password but keeps email', async () => {
        await page.click('.modal .close-btn');
        expect(await page.waitForSelector('.modal', { visible: false })).toBeTruthy();
        expect(await page.$eval('input[name=email]', el => el.value)).toBe(email);
        expect(await page.$eval('input[name=password]', el => el.value)).toBeFalsy();
    });

    test('Shows error message if submitting with an email that is unavailable', async () => {
        await inputIntoUserForm(page, null, password, password);
        await page.click('input[type=submit]');
        invalidMsg = await page.$eval('[name=email] + div.error', el => el.innerText);
        expect(invalidMsg).toBe(errorMsgs.email.EMAIL_UNAVAILABLE);
    });

    test('Put in second valid combination, shoqws modal', async () => {
        await inputIntoUserForm(page, email2, password2, password2);
        await page.click('input[type=submit]');
        expect(await page.waitForSelector('.modal', { visible: true })).toBeTruthy();
    });

    test('Clicking link in modal returns to login page', async () => {
        await page.click('.modal a');
        expect(await page.waitForSelector('#login-page')).toBeTruthy();
        expect(page.url().includes('/login')).toBeTruthy();
    });
}, 15000);
