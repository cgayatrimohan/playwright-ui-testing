import {test, expect} from '@playwright/test'
import { NavigationPage } from '../page-objects/navigation-page'
import { FormLayoutsPage } from '../page-objects/form-layouts-page'

test.beforeEach(async ({ page }) => {
    await page.goto("https://playground.bondaracademy.com/")
})

test('Navigate to form layouts page', async({ page }) => {
    const navigateTo = new NavigationPage(page)
    await navigateTo.formLayoutsPage()

    await navigateTo.datepickerPage()
    await navigateTo.toastrPage()
    await navigateTo.smartTablesPage()
})

test('Parameterized page object methods', async({ page }) => {
    const navigateTo = new NavigationPage(page)
    const formLayoutsPage = new FormLayoutsPage(page)

    await navigateTo.formLayoutsPage()
    await formLayoutsPage.submitUsingTheGridForm('test@example.com', 'test123', 'Option 1')
    await formLayoutsPage.submitInlineForm('Test User', 'test@example.com', true)
})
