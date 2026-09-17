import { test, expect } from '@playwright/test'

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

    test('Locating parent elements', async({ page }) => {
        await page.locator('nb-card', {hasText: 'Using the Grid'}).getByRole('button').click()
        await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('button').click()

        await page.locator('nb-card', {hasText: 'Horizontal form'}).getByRole('button').click()

        //find form which have sign-in along with checkbox 
        await page.locator('nb-card')
                  .filter({has: page.locator('nb-checkbox')})
                  .filter({hasText: 'Sign in'})
                  .getByLabel('Email')
                  .fill('test@example.com')

        await page.getByText('Using the Grid').locator('..').getByRole('button').click()
    })

    test('Reusing locators', async ({ page }) => {
        const basicForm = page.locator('nb-card', {hasText: "Basic form"})

        await basicForm.getByLabel('Email').fill('test@example.com')
        await basicForm.getByLabel('Password').fill('playwright')
        await basicForm.locator('nb-checkbox').click()
       
        await expect(basicForm.getByLabel('Email')).toHaveValue('test@example.com')

        //writing the same for form without labels
        const formWithoutLabels = page.locator('nb-card', {hasText: "Form without labels"})
        await formWithoutLabels.locator('[placeholder = "Recipients"]').fill('test@example.com')
        await formWithoutLabels.locator('[placeholder = "Subject"]').fill('testing')
        await formWithoutLabels.locator('[placeholder = "Message"]').fill('This is a test message')
        await formWithoutLabels.getByRole('button', {name: 'Send'}).click()
    })

    test('Extracting values', async ({ page }) => {
        //extracting text value from a single element
        const basicForm = page.locator('nb-card', {hasText: "Basic form"})
        const submitButtonText = await basicForm.getByRole('button').textContent()
        console.log("Submit button text is: " + submitButtonText)  
        expect(submitButtonText).toEqual('Submit')

        // extracting multiple text values from a list of elements
        const gridForm = page.locator('nb-card', {hasText: "Using the Grid"})
        const allRadioButtonsValues = await gridForm.locator('nb-radio-group nb-radio').allTextContents()
        console.log(allRadioButtonsValues)
        expect(allRadioButtonsValues).toEqual(['Option 1', 'Option 2', 'Disabled Option'])

        //extract input field values
        const emailField = basicForm.getByRole('textbox', {name: 'Email'})
        await emailField.fill('test@example.com')

        const emailFieldValueText = await emailField.inputValue()
        console.log(emailFieldValueText)
        expect(emailFieldValueText).toEqual('test@example.com')

        //extract attribute value
        const emailPlaceholder = await emailField.getAttribute('placeholder')
        console.log(emailPlaceholder)
        expect(emailPlaceholder).toEqual('Email')
    })

    test('Assertions', async ({ page }) => {

        // Generic assertions
        const value = 5
        expect(value).toEqual(5)

        const basicFormSelectionButton = page.locator('nb-card', {hasText: "Basic form"}).getByRole('button')
        const submitButtonText = await basicFormSelectionButton.textContent()
        expect(submitButtonText).toEqual('Submit')

        // Locator assertions
        await expect(basicFormSelectionButton).toHaveText('Submit')

        // soft assertions
        await expect.soft(basicFormSelectionButton).toHaveText('Submit')
        await basicFormSelectionButton.click()
    })

    test('Generated test', async( { page }) => {
        await page.getByRole('textbox', {name: 'Email address'}).fill('test@example.com')
    })
})
