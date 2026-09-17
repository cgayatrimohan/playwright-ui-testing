import { test, expect } from '@playwright/test'

test.beforeEach(async ({page}) => {
    await page.goto("https://playground.bondaracademy.com/")
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Dialog').click()
})

test('Auto waiting', async ({ page }) => {
    const dialogWithDelayForm = page.locator('nb-card', {hasText: 'Open Dialog with Delay'})
    await dialogWithDelayForm.getByRole('button', {name: '3 seconds'}).click()

    const dialogContainer = page.locator('nb-dialog-container')
    // await dialogContainer.getByRole('button', {name: 'Ok'}).click()

    const dialogHeaderText = await dialogContainer.locator('nb-card-header').textContent()
    console.log(dialogHeaderText)
    expect(dialogHeaderText).toEqual('Friendly reminder')
})

test('Alternative waits', async ({ page }) => {
    const dialogWithDelayForm = page.locator('nb-card', {hasText: 'Open Dialog with Delay'})
    await dialogWithDelayForm.getByRole('button', {name: '3 seconds'}).click()

    const dialogContainer = page.locator('nb-dialog-container')

    // -----wait for the element
    //await dialogContainer.waitFor({state: 'visible'})
    //await page.waitForSelector('nb-dialog-container', {state: 'visible'})


    //----wait for API response
    await page.waitForResponse('**/delay/*')

    //-----wait for load state (NOT RECOMMENDED)
    //await page.waitForLoadState('networkidle') --> This is not recommended as it waits for all network calls to finish which may not be required in this case

    //---hardcoded wait (NOT RECOMMENDED)
    //await page.waitForTimeout(3000) --> This is not recommended as it is a hardcoded wait and may not be reliable in all cases
    
    
    const dialogHeaderText = await dialogContainer.locator('nb-card-header').textContent()
    // console.log(dialogHeaderText)
    // expect(dialogHeaderText).toEqual('Friendly reminder')

    await expect(dialogContainer.locator('nb-card-header')).toHaveText('Friendly reminder')
})