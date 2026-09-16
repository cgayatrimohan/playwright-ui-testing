import { test } from '@playwright/test'

test.describe('Locator syntax tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("https://playground.bondaracademy.com/")
        await page.getByText("Forms").click()
        await page.getByText("Form Layouts").click()
    })
    
    test('Locator Syntax Rules', async ({ page}) => {
        //find by Tag
        page.locator('input')

        //find by ID
        page.locator('#inputEmail1')

        // find by Class value
        page.locator('.shape-rectangle')

        // find by any attribute
        page.locator('[placeholder="Email"]')

        //find by full class value
        page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

        //find by several selectors [no spaces in b/w the selectors]
        page.locator('input[placeholder="Email"].shape-rectangle[nbinput]')

        //find by XPath [NOT recommended by playwright]
        page.locator('//*[@id="inputEmail1"]')

        //find by partial text match
        page.locator(':text("Using")')

        //find by exact text match
        page.locator(':text-is("Using the Grid")')
    })

    test('User-visible-locators', async ({ page }) => {
        await page.getByRole('button', {name: 'Sign in'}).first().click()
        await page.getByRole('textbox', {name: 'Email'}).first().fill('test@example.com')

        await page.getByLabel('Email').first().fill('test@example.com')

        await page.getByPlaceholder('Jane Doe').fill('Gayatri')

        await page.getByText('Submit').first().click()

        await page.getByTestId('inputEmail1').fill('test@example.com')

        await page.getByTitle('IoT Dashboard').click()
    })

    test('Locating child elements', async ({ page }) => {
        await page.locator('nb-card').locator('nb-radio-group').locator(':text-is("Option 1")').click()
        await page.locator('nb-card nb-radio-group :text-is("Option 2")').click()

        await page.locator('nb-card').getByRole('button', {name: 'Sign in'}).first().click()

        await page.locator('nb-card').nth(3).getByRole('button').click();

    })
})