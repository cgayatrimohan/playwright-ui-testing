import { test, expect } from '@playwright/test'

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

    test('Extract values', async ({ page }) => {
        await page.goto("https://demoqa.com/elements")
        await page.getByRole('link', {name: 'Radio Button'}).click()

        //extract all values of radio buttons
        const radioButtonsEnabled = await page.locator('[class="form-check-label"]').allTextContents()        
        console.log(radioButtonsEnabled)
        expect(radioButtonsEnabled).toEqual(['Yes', 'Impressive'])
    })

    test('Radio buttons', async ({ page }) => {
        await page.goto("https://demoqa.com/elements")
        await page.getByRole('link', {name: 'Radio Button'}).click()

        //select radio button
        await page.getByLabel('Yes').check()
        await page.getByRole('radio', {name: 'Impressive'}).check()

        //validate the radio button
        const radioButtonStatus = await page.getByRole('radio', {name: 'Impressive'}).isChecked()
        expect(radioButtonStatus).toBeTruthy()

        //Actual way of validating the radio button status
        await expect(page.getByRole('radio', {name: 'Impressive'})).toBeChecked()
        await expect(page.getByRole('radio', {name: 'Yes'})).not.toBeChecked()
    })

    test('Checkbox', async({ page }) => {
        await page.goto('https://demoqa.com/elements')
        await page.getByRole('link', {name: 'Check Box'}).click()

        await page.getByRole('checkbox', {name: 'Select Home'}).check()
        await page.getByRole('checkbox', {name : 'Select Home'}).uncheck()
    })

    test('Lists and Dropdowns', async({ page }) => {
        await page.goto('https://demoqa.com/widgets')
        await page.getByRole('link', {name: 'Select Menu'}).click()

        // Standard dropdown --> this has select tag and can be selected by directly giving value rather than click
        await page.locator('#oldSelectMenu').selectOption('Blue')
        await expect(page.locator('#oldSelectMenu')).toHaveValue('1')

        //Custom dropdown
        const dropdownField = page.locator('#react-select-2-input')
        await dropdownField.click()
        await page.getByRole('option', { name: 'Group 1, option 1' }).click()

        //looping through list
        const allListValues = await dropdownField.locator('#react-select-11-input').allTextContents()
        console.log(allListValues)      
    })

    test('Tooltip', async({ page }) => {
        await page.goto('https://demoqa.com/widgets')
        await page.getByRole('link', {name: 'Tool Tips'}).click()
        const hoverMeButton = await page.getByRole('button', {name: 'Hover me to see'}).hover()
        const toolTipText =  await page.locator('.tooltip-inner').innerText()
        console.log(toolTipText)
    })

    test('Dialog boxes', async({ page }) => {
        await page.goto('https://demoqa.com/modal-dialogs')  
        
        // Example within the HTML, you can simply inspect and select the option and click
        await page.getByRole('button', {name: 'Small modal'}).click()
        await page.locator('#closeSmallModal').click() 
        
        // Another dialog
        await page.getByRole('button', {name: 'Large modal'}).click()
        await page.locator('#closeLargeModal').click() 
    })
})