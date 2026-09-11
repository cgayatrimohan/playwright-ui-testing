import { test } from '@playwright/test'

test.beforeEach(async ({page}) => {
    await page.goto("https://playground.bondaracademy.com/")
})


test.describe('test suite 1', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText("Forms").click()
    })

    test('Forms layout page test', async ({ page }) => {
        await page.getByText("Form Layouts").click()
    })

    test('Datepicker test', async ({ page }) => {
        await page.getByText("Datepicker").click()
    })
})


test.describe('test suite 2', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("https://playground.bondaracademy.com/")
        await page.getByText("Charts").click()
    })
})

