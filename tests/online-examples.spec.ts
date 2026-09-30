import { test, expect, chromium } from '@playwright/test'
import path from 'path';
import fs from 'fs';

test('multiple context example', async ({ }) => {
    const browser = await chromium.launch(); // Or add browser fixture which will launch the browser

    //create two independent browser contexts
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    //Each context has independent cookies/storage
    await page1.goto('https://playground.bondaracademy.com/pages/forms/datepicker');
    await page2.goto('https://playground.bondaracademy.com/pages/forms/layouts');

    await context1.close();
    await context2.close();
    await browser.close();

});

test('API Testing', async ({ request }) => {

    // GET Request
    const response = await request.get('https://conduit-api.bondaracademy.com/api/tags');
    expect(response.ok()).toBeTruthy();
    const tags = await response.json();

    // POST Request
    const createResponse = await request.post('https://api.example.com/users', {
        data: {
            "user": {
                "name": "John Doe",
                "email": "john@example.com"
            }
        },
        headers: {
            Authorization: 'Bearer token123'
        }
    });
    expect(createResponse.status()).toBe(201);

    // Delete Request
    const id = 123;
    const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${id}`);
    expect(deleteArticleResponse.status()).toEqual(204)
});

test('File upload', async ({ page }) => {

    await page.goto('https://example.com');

    // Resolve the absolute file path relative to your project directory
    const filePath = path.resolve(__dirname, '../assests/sample_document.pdf');

    // Locate the input element and pass the file path
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);

    // Optional: If uploading multiple files at once, pass an array
    // await fileInput.setInputFiles([filePath1, filePath2]);

    // Click submit and assert upload success
    await page.getByRole('button', { name: 'Upload' }).click();
    await expect(page.locator('#upload-success')).toBeVisible();
});


test('Handle and verify file download', async ({ page }) => {

    await page.goto('https://example.com');

    // 1. Set up the download event listener before clicking the download link
    const downloadPromise = page.waitForEvent('download');

    // 2. Click the button or link that triggers the download action
    await page.getByRole('link', {name: 'Download invoice (pdf)'}).click();
    const download = await downloadPromise;

    // 3. Wait for the browser to finish downloading the file stream
    const suggestedFileName = download.suggestedFilename();
    console.log(`Downloaded file name from server: ${suggestedFileName}`);

    // 4. Save the file to a permanent path in your automation framework
    const savePath = path.resolve(__dirname, `../downlaods/${suggestedFileName}`);
    await download.saveAs(savePath);

    // 5. Node.js assertion: Verify that the file actually exists on your hard drive
    expect(fs.existsSync(savePath)).toBeTruthy();
});

test('Example 21', async ({ page }) => {

    const browser = await chromium.launch();
    const context = await browser.newContext({ storageState: 'auth.json' });

    await page.route('**/api/**', async (route) => {
        route.fulfill({
            status: 200,
            body: 'OK'
        });
    });


    page.on('dialog', async (d) => {
        d.accept();
    });

    await page.goto('https://example.com');
    await page.screenshot({ path: 'final.png', fullPage: true });

    await context.storageState({ path: 'auth.json' });
    await context.close();
});