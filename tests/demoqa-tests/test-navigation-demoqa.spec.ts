import {test, expect} from '@playwright/test'
import { NavigationDemoQAPage} from '../../page-objects/navigation-demoqa-page'

test.beforeEach(async ({ page }) => {
    await page.goto("https://demoqa.com/")
})

test('Navigate to TextBox page', async({ page }) => {
    const naviagteTo = new NavigationDemoQAPage(page)

    await page.locator('.card-body').getByText('Elements').click()
    await naviagteTo.textBoxPage()
})

test('Iframes', async ({ page }) => {
    const navigateTo = new NavigationDemoQAPage(page)
    
    await page.locator('.card-body').getByText('Alerts, Frame & Windows').click()
    await navigateTo.framesPage()

    page.frameLocator('#frame1Wrapper').getByText('This is a sample page')
})


test('Handle new page/tabs', async({ page, context }) => {
    await page.goto('https://demoqa.com/browser-windows');

    const newTabPromise = page.waitForEvent("popup");
    await page.getByRole('button', {name: 'New Tab'}).click();
    const newTab = await newTabPromise;
    console.log(await newTab.evaluate('location.href'));
    
    await newTab.getByRole('heading', { name: 'This is a sample page' }).click();

    // alternate method where you get all the open pages and switch focus
    // const allTabs = context.pages()
    // const mainPage = allTabs[0]
    // const secondTab = allTabs[1]

    // await mainPage.bringToFront();  
});