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

})