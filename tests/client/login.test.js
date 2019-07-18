const { inputIntoUserForm, createTestUser } = require('../utils');

const errorMsgs = require('../../locale/en-us').userForm.errorMsgs;
let browser, page, testUser, testUser2, email, password, invalidMsg;

describe('Login end-to-end functionality', () => {
    beforeAll(async () => {
        browser = await require('puppeteer').launch({
            headless: false,
            executablePath: process.env.CHROME_PATH
        });
        page = (await browser.pages())[0];
        testUser = await createTestUser();
        email    = testUser.email;
        password = testUser.password;
        testUser2 = await createTestUser();
    });

    afterAll(async () => {
        await page.close();
        await testUser.remove();
        await testUser2.remove();
    });

    test('Going to / (app) redirects to /login if not signed in', async () => {
        await page.goto(process.env.SERVER_ROOT + '/login');
        expect(await page.waitForSelector('#login-page')).toBeTruthy();
        expect(page.url().includes('/login')).toBeTruthy();
    });

    test('Shows error message if submitting with no email', async () => {
        await inputIntoUserForm(page, '', password);
        await page.keyboard.press('Enter');
        invalidMsg = await page.$eval('#email div.error', el => el.innerText);
        expect(invalidMsg).toBe(errorMsgs.email.EMAIL_MISSING);
    });

    test('Shows error message if submitting with invalid email', async () => {
        await inputIntoUserForm(page, 'foo.bar@bar@bar.foo', password);
        await page.click('input[type=submit]');
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
        await page.click('input[type=submit]');
        invalidMsg = await page.$eval('#password div.error', el => el.innerText);
        expect(invalidMsg).toBe(errorMsgs.password.PASSWORD_TOO_SHORT);
    });

    test('Shows error message if submitting with email and password that doesn\'t match', async () => {
        await inputIntoUserForm(page, testUser2.email, password);
        await page.keyboard.press('Enter');
        await page.waitForSelector('input[type=submit]:not([disabled])');
        invalidMsg = await page.$eval('#email div.error', el => el.innerText);
        expect(invalidMsg).toBe(errorMsgs.INVALID_CREDENTIALS);
    });

    test('Can login with correct credentials, redirects to app', async () => {
        await inputIntoUserForm(page, email, password);
        await page.keyboard.press('Enter');
        expect(await page.waitForSelector('#app-page')).toBeTruthy();
    });

    test('Can logout, redirects to login', async () => {
        await page.click('a[href="/logout"]');
        expect(await page.waitForSelector('#login-page')).toBeTruthy();
        expect(page.url().includes('/login')).toBeTruthy();
    });

    test('Going to / (app) redirects to /login after logout', async () => {
        await page.goto(process.env.SERVER_ROOT);
        expect(await page.waitForSelector('#login-page')).toBeTruthy();
        expect(page.url().includes('/login')).toBeTruthy();
    });
}, 20000);
