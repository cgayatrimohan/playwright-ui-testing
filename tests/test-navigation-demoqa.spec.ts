import {test, expect} from '@playwright/test'
import { NavigationDemoQAPage} from '../page-objects/navigation-demoqa-page'

test.beforeEach(async ({ page }) => {
    await page.goto("https://demoqa.com/")
})

test('Navigate to TextBox page', async({ page }) => {
    const naviagteTo = new NavigationDemoQAPage(page)

    await page.locator('.card-body').getByText('Elements').click()
    await naviagteTo.textBoxPage()
})