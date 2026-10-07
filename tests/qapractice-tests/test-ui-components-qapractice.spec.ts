import { Console } from 'console'
import { step } from '../../helpers/test-step-decorator'
import { test, expect } from '@playwright/test'

test.describe('Testing all UI components', async () => {

    test.beforeEach('Home page', async ({ page }) => {
        await page.goto('https://www.qa-practice.com/')
    })

    test('Text inputs', async ({ page }) => {
        await page.getByRole('link', { name: 'Text input' }).click()

        // Fill submit me
        await page.getByRole('textbox', { name: 'text' }).fill('English_String_123')
        await page.getByRole('textbox', { name: 'text' }).press('Enter');

        await expect(page.locator('#result-text')).toHaveText('English_String_123')

        //Fill email field
        await page.getByRole('link', { name: 'Email field' }).click()
        await page.getByPlaceholder('Submit me').fill('test@example.com')
        await page.getByPlaceholder('Submit me').press('Enter')
        await expect(page.locator('.result-text')).toHaveText('test@example.com')

        //Fill Password field
        await page.getByRole('link', { name: 'Password field' }).click()
        const passwordField = page.getByPlaceholder('Submit me')
        await page.getByPlaceholder('Submit me').fill('Practice_123!')
        await passwordField.press('Enter')
        await expect(page.locator('.result-text')).toHaveText('Practice_123!')
    })

    test('Buttons', async ({ page }) => {
        await page.getByRole('link', { name: 'Simple button' }).click()

        //Simple button
        await page.getByRole('button', { name: 'Click' }).click()
        const resultText = page.locator('#result-text')
        await expect(resultText).toHaveText('Submitted')

        //Looks like a button
        await page.getByRole('link', { name: 'Looks like a button' }).click()
        await page.locator('.a-button').click()

        await expect(resultText).toHaveText('Submitted')

        //Disabled
        await page.getByRole('link', { name: 'Disabled' }).click()
        await page.getByLabel('Select state').selectOption('enabled');

        await expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled()

        await page.getByRole('button', { name: 'Submit' }).click()

        await expect(resultText).toHaveText('Submitted')

    })

    test('Checkbox', async ({ page }) => {
        await page.getByRole('link', { name: 'Single checkbox' }).click()

        //Single checkbox
        await page.getByRole('checkbox', { name: 'select me or not' }).click()
        await expect(page.getByRole('checkbox')).toBeChecked()

        await page.getByRole('button', { name: 'Submit', exact: true }).click()
        await expect(page.locator('.result-text')).toHaveText('select me or not')

        //Multiple checkboxes
        await page.getByRole('link', { name: 'Checkboxes' }).click()

        const allboxes = page.getByRole('checkbox')

        for (const box of await allboxes.all()) {
            await box.check({ force: true })
            await expect(box).toBeChecked()
        }

        await page.getByRole('button', { name: 'Submit', exact: true }).click()
        const resultText = page.locator('#result-text')
        await expect(resultText).toHaveText('one, two, three')
    })

    test('Text Area', async ({ page }) => {
        await page.getByRole('link', { name: 'Text area' }).click()

        //Text area
        await page.locator('#div_id_text_area #id_text_area').fill('This is details to be included in text area')
        await page.getByRole('button', { name: 'Submit' }).click()
        const resultText = page.locator('#result-text')
        await expect(resultText).toHaveText('This is details to be included in text area')

        //Multiple text areas
        await page.getByRole('link', { name: 'Multiple textareas' }).click()
        await page.getByRole('textbox', { name: 'first chapter' }).fill('This is first chapter')
        await page.getByRole('textbox', { name: 'second chapter' }).pressSequentially('This is second chapter', { delay: 100 })

        await page.getByRole('button', { name: 'Submit' }).click()
        const textAreasDetails = page.locator('#result-text')

        for (const textArea of await textAreasDetails.all()) {
            console.log(textArea)
        }
    })

    test('Select input', async ({ page }) => {
        await page.getByRole('link', { name: 'Select input' }).click()

        //single select
        await page.getByLabel('Choose language').selectOption('Java')
        await page.getByRole('button', { name: 'Submit' }).click()
        const resultText = page.locator('#result-text')
        await expect(resultText).toHaveText('Java')

        //multiple selects
        await page.getByRole('link', { name: 'Multiple selects' }).click()
        await page.getByLabel('Choose the place you want to go').selectOption('Sea')
        await page.getByLabel('Choose how you want to get there').selectOption('Car')
        await page.getByLabel('Choose when you want to go').selectOption('Today')

        await page.getByRole('button', { name: 'Submit' }).click()
        await expect(resultText).toHaveText('to go by car to the sea today')
    })

    test('New tab', async ({ page }) => {
        await page.getByRole('link', { name: 'Single UI Elements' }).click()
        await page.getByRole('link', { name: 'New tab' }).click()

        //New tab link
        const newTabPromise = page.waitForEvent('popup')
        await page.getByRole('link', { name: 'New page will be opened on a new tab' }).click()
        const newTab = await newTabPromise
        const resultText = newTab.locator('#result-text')
        await expect(resultText).toHaveText('I am a new page in a new tab')

        //New tab button
        await page.getByRole('link', { name: 'New tab button' }).click()

        const newTabButtonPromise = page.waitForEvent('popup')
        await page.getByRole('link', { name: 'Click' }).click()


        const newTabButton = await newTabButtonPromise
        await expect(newTabButton.locator('#result-text')).toHaveText('I am a new page in a new tab')
    })

    test('Alerts - Alert box (browser)', async ({ page, context }) => {
        await page.getByRole('link', { name: 'Single UI Elements' }).click()
        await page.getByRole('link', { name: 'Alerts' }).click()

        // 1. Set up the dialog listener BEFORE clicking
        page.on('dialog', async (dialog) => {
            // Verify the alert message matches what we expect
            expect(dialog.message()).toBe('I am an alert!')

            // Check the type of dialog (alert, confirm, or prompt)
            console.log(`Dialog type: ${dialog.type}`)

            // Accept (click "OK") on the alert
            await dialog.accept()
        })

        // 2. Click the link that triggers the alert
        await page.getByRole('link', { name: 'Click' }).click()
    })

    test('Alerts - Confirmation Box', async ({ page }) => {
        await page.getByRole('link', { name: 'Single UI Elements' }).click()
        await page.getByRole('link', { name: 'Alerts' }).click()
        await page.getByRole('link', { name: 'Confirmation box' }).click()

        page.on('dialog', async (dialog) => {
            console.log(`Dialog type: ${dialog.type}`)
            expect(dialog.message()).toBe('Select Ok or Cancel')
            await dialog.accept()
        })

        await page.getByRole('link', { name: 'Click' }).click()
        const resultText = page.locator('#result-text')
        await expect(resultText).toHaveText('Ok')
    })

    test('Alerts - Prompt Box', async ({ page }) => {
        await page.getByRole('link', { name: 'Single UI Elements' }).click()
        await page.getByRole('link', { name: 'Alerts' }).click()
        await page.getByRole('link', { name: 'Prompt box' }).click()

        const secretInputText = 'test user'

        page.on('dialog', async (dialog) => {
            expect(dialog.type()).toBe('prompt');
            expect(dialog.message()).toBe('Please enter some text');
            await dialog.accept(secretInputText)
        })

        await page.getByRole('link', { name: 'Click', exact: true }).click()
        const resultText = page.locator('#result-text')
        await expect(resultText).toContainText(secretInputText)
    })

    test('Drag and Drop', async ({ page }) => {
        await page.getByRole('link', { name: 'Single UI Elements' }).click()
        await page.getByRole('link', { name: 'Drag and Drop' }).click()

        const boxes = page.getByRole('link', { name: 'Boxes' })
        await expect(boxes).toBeVisible()

        await page.getByText('Drag me').hover()
        await page.mouse.down()
        await page.locator('#rect-droppable').getByText('Drop here').hover()
        await page.mouse.up()

        const dropSuccessText = page.locator('#text-droppable')
        await expect(dropSuccessText).toHaveText('Dropped!')

        //Images drag and drop
        await page.getByRole('link', { name: 'Images' }).click()
        await page.locator('#rect-droppable1').hover()
        await page.mouse.down()
        await page.locator('#rect-droppable2').hover()
        await page.mouse.up()
    })

    /**
     * Test case for testing the iframes
     */
    test('IFrames', async ({ page }) => {
        await page.getByRole('link', { name: 'Single UI Elements' }).click()
        await page.getByRole('link', { name: 'Iframes' }).click()

        const frameLocator = page.frameLocator('.embed-responsive-item')
        await frameLocator.getByRole('link', { name: 'Main call to action' }).click()
    })

    test('Pop up', async ({ page }) => {
        await page.getByRole('link', { name: 'Single UI Elements' }).click()
        await page.getByRole('link', { name: 'Pop-Up' }).click()

        const modalLink = page.getByRole('link', { name: 'Modal' })
        await expect(modalLink).toBeVisible()

        await page.getByRole('button', { name: 'Launch Pop-Up' }).click()
        await expect(page.getByRole('heading', { name: 'I am a Pop-Up' })).toBeVisible();

        const checkbox = page.getByRole('checkbox', { name: 'Select me or not' })
        await checkbox.check()


        await page.getByRole('button', { name: 'Send' }).click()
        await expect(page.locator('#result-text')).toBeVisible();
        await expect(page.locator('#result-text')).toContainText('select me or not');
    })

    test('IFrame pop-up', async ({ page }) => {

        await page.goto('https://www.qa-practice.com/elements/popup/iframe_popup')

        //iframe pop-up
        await page.getByRole('button', { name: 'Launch Pop-Up' }).click();

        // 3. Create a Frame Locator targeting the iframe embedded inside the modal
        // (Using a standard iframe selector or its technical id/name if present)
        const popupFrame = page.frameLocator('iframe');

        // 4. Assertions and operations INSIDE the iframe context
        // Verify the page title inside the frame exists
        const titleText = popupFrame.getByRole('heading', { name: 'Iframe page title' })
        await expect(titleText).toBeVisible();

        // Target the text we need to copy
        const textToCopy = 'I am the text you want to copy';
        await expect(popupFrame.getByText(textToCopy)).toBeVisible();

        // Click the "Check" button outside the iframe to open the input form validation layer
        await page.locator('.modal-footer').getByRole('button', {name: 'Check'}).first().click();

        // 5. Fill out the validation form outside the iframe
        // Locate the input textbox and fill it with the copied text string
        await page.getByRole('textbox').fill(textToCopy);

        // Click the submit button inside the outside the iframe 
        await page.getByRole('button', { name: 'Submit' }).click();

        // 6. Web-first assertions to validate the conditional outcome inside the frame
        const validationResult = page.locator('#check-result')
        await expect(validationResult).toHaveText('Correct!')
    })

    test('Practice form', async ({ page }) => {
        await page.goto('https://www.qa-practice.com/forms/practice-form')

        // Student registration form

        // First Name & Last Name
        await page.getByRole('textbox', {name: 'First Name'}).fill('Fname')
        await page.getByRole('textbox', {name: 'Last Name'}).fill('Lname')

        // Email
        await page.getByRole('textbox', {name: 'Email'}).fill('test@example.com')

        // Gender
        await page.getByRole('radio', {name: 'Female'}).check({force: true})

        // Mobile Number
        await page.getByPlaceholder('Mobile Number').fill('1112223333')


        // Languages
        const subject = page.getByRole('textbox', {name: 'Type to search subjects...'})
        await subject.fill('S')
        await subject.press('ArrowDown')
        await page.getByText('Sanskrit').click();


        // Hobbies
        await page.getByRole('checkbox', {name: 'Sports'}).check()

        // Current Address
        await page.getByRole('textbox', {name: 'Current Address'}).fill('Test address, CA-93053')
        await expect(page.getByRole('textbox', {name: 'Current Address'})).toHaveValue('Test address, CA-93053')

        // Select state
        await page.locator('#div_id_state .custom-dropdown', {hasText: 'Select State'}).click()
        await page.locator('.custom-dropdown-option', {hasText: 'Uttar Pradesh'}).click()


        // Select city
        await page.locator('#div_id_city .custom-dropdown').filter({hasText: 'Select City'}).click()
        await page.locator('.custom-dropdown-option', {hasText: 'Agra'}).click({force: true})

        // Assertions
        await expect(page.locator('#div_id_state .custom-dropdown-control').locator('.selected-value')).toHaveText('Uttar Pradesh')
        await expect(page.locator('#div_id_city .custom-dropdown-control').locator('.selected-value')).toHaveText('Agra')

        // Submit form
        await page.getByRole('button', {name: 'Submit'}).click()
        await page.locator('.modal-footer').getByRole('button', {name: 'Close'}).click()

    })
})