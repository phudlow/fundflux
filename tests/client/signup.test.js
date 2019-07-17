const rp = require('request-promise-native').defaults({ 
    resolveWithFullResponse: true,
    json: true 
});

const email     = 'foo.bar@bar.com';
const password  = 'S3CRET_PW';
const email2    = 'bar.foo@foo.com';
const password2 = 'pa55w0rd!';

const errorMsgs = require('../../locale/en-us/signup').errorMsgs;

let invalidMsg, res;

test('Signup end-to-end functionality', async (done) => {
    const browser = await require('puppeteer').launch({
        headless: false,
        executablePath: process.env.CHROME_PATH
    });
    const page = (await browser.pages())[0];

    // Go to signup page
    await page.goto(process.env.SERVER_ROOT + '/signup');
    await page.waitForSelector('#signup-page');

    async function inputIntoForm(email, password) {
        if (email !== null) {
            await page.click('input[name=email]');
            await page.keyboard.down('Control');
            await page.keyboard.press('KeyA');
            await page.keyboard.up('Control');
            await page.keyboard.press('Delete');
            await page.keyboard.type(email);
        }
        if (password !== null) {
            await page.click('input[name=password]');
            await page.keyboard.down('Control');
            await page.keyboard.press('KeyA');
            await page.keyboard.up('Control');
            await page.keyboard.press('Delete');
            await page.keyboard.type(password);
        }
    }

    // Shows error message if submitting with no email
    await inputIntoForm('', password);
    await page.keyboard.press('Enter');
    invalidMsg = await page.$eval('#email div.error', el => el.innerText);
    expect(invalidMsg).toBe(errorMsgs.email.EMAIL_MISSING);

    // Shows error message if submitting with invalid email
    await inputIntoForm('foo.bar@bar@bar.foo', password);
    await page.keyboard.press('Enter');
    invalidMsg = await page.$eval('#email div.error', el => el.innerText);
    expect(invalidMsg).toBe(errorMsgs.email.EMAIL_INVALID);

    // Shows error message if submitting with no password
    await inputIntoForm(email, '');
    await page.keyboard.press('Enter');
    invalidMsg = await page.$eval('#password div.error', el => el.innerText);
    expect(invalidMsg).toBe(errorMsgs.password.PASSWORD_MISSING);

    // Shows error message if submitting with a password that is too short
    await inputIntoForm(email, 'E3S$');
    await page.keyboard.press('Enter');
    invalidMsg = await page.$eval('#password div.error', el => el.innerText);
    expect(invalidMsg).toBe(errorMsgs.password.PASSWORD_TOO_SHORT);

    // Shows error message if submitting with a password that does not meet character type requirements
    await inputIntoForm(email, 'yoda4prez4229');
    await page.keyboard.press('Enter');
    invalidMsg = await page.$eval('#password div.error', el => el.innerText);
    expect(invalidMsg).toBe(errorMsgs.password.PASSWORD_CHAR_REQ_FAIL);

    // Shows modal when successful
    await inputIntoForm(email, password);
    await page.keyboard.press('Enter');
    expect(await page.waitForSelector('#signup-success-modal', { visible: true })).toBeTruthy();

    // Click close btn, clears password but keeps email
    await page.click('#signup-success-modal .close-btn');
    expect(await page.waitForSelector('#signup-success-modal', { visible: false })).toBeTruthy();
    expect(await page.$eval('input[name=email]', el => el.value)).toBe(email);
    expect(await page.$eval('input[name=password]', el => el.value)).toBeFalsy();

    // Shows error message if submitting with an email that is unavailable
    await inputIntoForm(null, password);
    await page.click('input[type=submit]');
    invalidMsg = await page.$eval('#email div.error', el => el.innerText);
    expect(invalidMsg).toBe(errorMsgs.email.EMAIL_UNAVAILABLE);

    // Put in second valid combination, shows modal
    await inputIntoForm(email2, password2);
    await page.click('input[type=submit]');
    expect(await page.waitForSelector('#signup-success-modal', { visible: true })).toBeTruthy();

    // Clicking link in modal returns to login page
    await page.click('#signup-success-modal a');
    expect(await page.waitForSelector('#login-page')).toBeTruthy();
    await page.close();
    await browser.close();

    // Clean up 2 created accounts
    res = await rp.post(process.env.SERVER_ROOT + '/delete-account', { body: { email, password } });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('ACCOUNT_DELETED');
    expect(res.body.error).toBeFalsy();
    res = await rp.post(process.env.SERVER_ROOT + '/delete-account', { body: { email: email2, password: password2 } });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('ACCOUNT_DELETED');
    expect(res.body.error).toBeFalsy();

    done();
}, 12000);
