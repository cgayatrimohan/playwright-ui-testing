import { test, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/login-page";

test('Login form is visible and usable', async ({page}) => {
    const loginpage = new LoginPage(page);
    await loginpage.goto();

    await expect(loginpage.usernameInput).toBeVisible();
    await expect(loginpage.passwordInput).toBeEmpty();
    await expect(loginpage.loginButton).toBeEnabled();

    await loginpage.login('test user', 'test@example.com');

    await page.setInputFiles('#upload', 'files.pdf');
})

