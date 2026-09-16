import { test } from '@playwright/test'

test.describe('Locator syntax tests', () => {

    test('Search for a given text', async ({ page }) => {
        await page.goto("https://google.com/")
        await page.getByRole('combobox').fill('playwright')
        await page.getByText('Google Search').first().click()
    })

    test('Click on Text Box', async ({ page }) => {
        await page.goto("https://demoqa.com/elements")
        await page.getByRole('link', {name: 'Text Box'}).click()
        await page.locator('input#userName').fill("Test User")
        await page.locator('input#userEmail').fill("test@example.com")
        await page.getByRole('textbox', {name: "Current Address"}).fill("Test address")
        await page.locator('#permanentAddress').fill("Test permanent address")
        await page.getByRole('button', {name: "Submit"}).click()
    })
})