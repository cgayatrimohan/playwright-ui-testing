import { test, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/login-page";

test('Login form is visible and usable', async ({ page }) => {
    const loginpage = new LoginPage(page);
    await loginpage.goto();

    await expect(loginpage.usernameInput).toBeVisible();
    await expect(loginpage.passwordInput).toBeEmpty();
    await expect(loginpage.loginButton).toBeEnabled();

    // await loginpage.login('test user', 'test@example.com');

    const [response] = await Promise.all([
        page.waitForResponse(response =>
            response.url().includes('/homepage') && response.status() === 200
        ),
        loginpage.login('test user', 'welcome123')
    ]);

    // await page.setInputFiles('#upload', 'files.pdf');
});


// Parameterized login tests
const loginData = [
    { username: 'user1', password: 'pass123', expected: 'Success' },
    { username: 'user2', password: 'pass456', expected: 'Success' },
    { username: 'user3', password: 'pass789', expected: 'Failure' }
]

for(const data of loginData) {
    test(`Login test - ${data.username}`, async({page}) => {
        const loginpage = new LoginPage(page);
        await loginpage.goto();

        await loginpage.login(data.username, data.password);

        if(data.expected === 'Success') {
            await expect(page.locator('#dashboard')).toBeVisible();
        } else {
            await expect(page.locator('#error-message')).toBeVisible();
        }
    });
};

