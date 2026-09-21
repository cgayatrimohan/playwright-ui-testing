import {test, expect} from '@playwright/test'
import { PageManager } from '../page-objects/page-manager'


test.beforeEach(async ({ page }) => {
    await page.goto("https://playground.bondaracademy.com/")
})

test('Navigate to form layouts page', async({ page }) => {
    const pom = new PageManager(page)
    await pom.navigateTo.formLayoutsPage()

    await pom.navigateTo.datepickerPage()
    await pom.navigateTo.toastrPage()
    await pom.navigateTo.smartTablesPage()
})

test('Parameterized page object methods', async({ page }) => {
    const pom = new PageManager(page)

    await pom.navigateTo.formLayoutsPage()
    await pom.formLayoutsPage.submitUsingTheGridForm('test@example.com', 'test123', 'Option 1')
    await pom.formLayoutsPage.submitInlineForm('Test User', 'test@example.com', true)

    await pom.navigateTo.datepickerPage()
    await pom.datepickerPage.selectCommonDatepickerDateFromToday(5)

    await pom.datepickerPage.selectDatepickerWithRangeFromToday(7,20)
})
