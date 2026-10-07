import { test, expect } from '@playwright/test';


/**
 * Tests from Linkedin learning course
 */
test.describe("Home page", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://practicesoftwaretesting.com');
    });

    // test('visual test', async ({ page }) => {
    //     await expect(page).toHaveScreenshot('home-page.png');
    // });

    test('check sign in', async ({ page }) => {
        // Ensure sign in link is present
        await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
    });

    test('validate page title', async ({ page }) => {
        // Check the title of the page
        await expect(page).toHaveTitle(/Practice Software Testing - Toolshop - v5.0/);
    });

    test('grid loads with 9 products', async ({ page }) => {
        // Check the count of items 
        await expect(page.locator('.col-md-9').getByRole('link')).toHaveCount(9);
    });

    test('search for Thor hammer', async ({ page }) => {
        const productGrid = page.locator('.col-md-9');
        // Search for Thor hammer 
        const searchQuery = page.locator('[data-test="search-query"]');
        await searchQuery.fill("Thor Hammer");
        await page.locator('[data-test="search-submit"]').click();

        // Ensure the search results contain the Thor hammer
        await expect(productGrid.getByRole('link')).toHaveCount(1);
        await expect(page.getByAltText('Thor hammer')).toBeVisible();
    });

});