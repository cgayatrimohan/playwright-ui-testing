import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto("https://playground.bondaracademy.com/")
})

test.describe('Forms Layouts Page', async () => {

    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('Input Fields', async ({ page }) => {
        const usingTheGridForm = page.locator('nb-card', {hasText: 'Using the Grid'})
                                     .getByRole('textbox', {name: 'Email'})
        
        await usingTheGridForm.fill('test@example.com')
        await usingTheGridForm.clear()

        // Fill the input field with a delay of 500 milliseconds between each character -> similate keystrokes
        await usingTheGridForm.pressSequentially('test2@example.com', {delay: 500})

        //extract the values
        const inputValue = await usingTheGridForm.inputValue()

        //assertions on input field
        await expect(usingTheGridForm).toHaveValue('test2@example.com')
        await expect(usingTheGridForm).toHaveValue(/example.com/)
    })

    test('Radio buttons', async({ page }) => {
        const usingTheGridForm = page.locator('nb-card', {hasText: 'Using the Grid'})

        await usingTheGridForm.getByLabel('Option 1').check({force: true})
        await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).check({force: true})

        //if the radio button is selected or not
        const radioButtonStatus = await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).isChecked()
        expect(radioButtonStatus).toBeTruthy()

        //Actual way of validating the radio button status
        await expect(usingTheGridForm.getByRole('radio', {name: 'Option 2'})).toBeChecked()
        await expect(usingTheGridForm.getByRole('radio', {name: 'Option 1'})).not.toBeChecked()
    })

})

test.describe('Modal & Overlays Page', async () => {
    
    test.beforeEach(async ({ page }) => {
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Toastr').click()
    })
    
    test('Checkbox', async ({ page }) => {        
        await page.getByRole('checkbox', {name: 'Hide on click'}).click({force: true})
        await page.getByRole('checkbox', {name: 'Show toast with icon'}).uncheck({force: true})

        //loop over all checkboxes
        const allBoxes = page.getByRole('checkbox')

        for(const box of await allBoxes.all()) {
            await box.uncheck({force: true})
            await expect(box).not.toBeChecked()
        }
    })

    test('Lists and dropdowns', async({ page }) => {

        //standard dropdown --> this has select tag and can be selected by directly giving value rather than click
        await page.locator('.form-group', {hasText: 'Toast type:'})
                  .getByRole('combobox')
                  .selectOption('info')
        await expect(page.getByRole('combobox')).toHaveValue('info')

        //custom dropdown
        await page.locator('.form-group', {hasText: 'Position:'}).locator('nb-select').click()
        // --> Option 1
        // await page.getByRole('list').getByText('bottom-end').click()
        // ---> Option 2
        await page.locator('nb-option', {hasText: 'bottom-end'}).click()
        await expect(page.locator('.form-group', {hasText: 'Position:'}).locator('nb-select')).toHaveText('bottom-end')

        //Looping through the list
        const positionDropdownField = page.locator('.form-group', {hasText: 'Position:'}).locator('nb-select')
        await positionDropdownField.click()

        const allListValues = await page.locator('nb-option').allTextContents()
        console.log(allListValues)

        for(const value of allListValues) {
            await page.locator('nb-option', {hasText: value}).click()
            await expect(positionDropdownField).toHaveText(value)
            await positionDropdownField.click() // adding this so that the loop can continue
        }

    })

    test('Tooltip test case', async({ page }) => {
        await page.getByText('Tooltip').click()

        await page.getByRole('button', {name: 'Top'}).hover()
        await expect(page.getByRole('tooltip')).toHaveText('This is a tooltip')
    })

    test('Dialog', async({ page }) => {
        await page.getByText('Dialog').click()


    })
})

test.describe('Tables and Data Page', async() => {
    
    test.beforeEach('Smart Table', async({ page }) => {
       await page.getByText('Tables & Data').click()
       await page.getByText('Smart Table').click()   
    })

    test('Dialog box', async({ page }) => {

        //enable event listener so that we can listen on the event that is 
        //responsible for this dialog box and intercept this event and then accept or reject the result
        page.on('dialog', dialog => {
            expect(dialog.message()).toEqual('Are you sure you want to delete?')
            dialog.accept()
        })

        // example native built into browser confirmation dialog box 
        await page.locator('tr', {hasText: 'mdo@gmail.com'}).locator('.nb-trash').click()
        await expect(page.locator('tr', {hasText: 'mdo@gmail.com'})).not.toBeVisible()
    })
})
