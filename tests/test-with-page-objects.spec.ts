import {test } from '../fixture'
import { PageManager } from '../page-objects/page-manager'
import { faker } from '@faker-js/faker'


test.beforeEach(async ({ page }) => {
    await page.goto("https://playground.bondaracademy.com/")
})

test('Navigate to form layouts page', async({ pom }) => {
    // const pom = new PageManager(page)
    await pom.navigateTo.formLayoutsPage()

    await pom.navigateTo.datepickerPage()
    await pom.navigateTo.toastrPage()
    await pom.navigateTo.smartTablesPage()
})

test('Parameterized page object methods', async({ pom }) => {
    // const pom = new PageManager(page)
    const randomFullName = faker.person.fullName()
    const randomEmail = faker.internet.email({provider: 'example.com'})
    

    await pom.navigateTo.formLayoutsPage()
    await pom.formLayoutsPage.submitUsingTheGridForm(randomEmail, randomFullName, 'Option 1')
    await pom.formLayoutsPage.submitInlineForm(randomFullName, randomEmail, true)

    await pom.navigateTo.datepickerPage()
    await pom.datepickerPage.selectCommonDatepickerDateFromToday(5)

    await pom.datepickerPage.selectDatepickerWithRangeFromToday(7,20)
})
