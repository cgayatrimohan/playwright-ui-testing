import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

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

    test('Web tables', async({ page }) => {
        await page.goto("https://demoqa.com/webtables")

        // how to select a row based on visible text
        const tableRowByEmail =  page.getByRole('row', {name: 'cierra@example.com'})
        await tableRowByEmail.locator('#edit-record-1').click()
        await page.getByRole('textbox', { name: 'Age' }).fill('35');
        await page.getByRole('button', {name: 'Submit'}).click()

        // how to get row by specific column value
        const firstColumnField = page.getByRole('cell').nth(2) //third cell within the row
        const tableRowByAge = page.getByRole('row').filter({has: firstColumnField.getByText('35')})
        await tableRowByAge.locator('#edit-record-1').click()
        await page.locator('#userEmail').fill('test@example.com')
        await page.getByRole('button', {name: 'Submit'}).click()
    })

    test('Date picker', async({ page }) => {
        await page.goto("https://demoqa.com/date-picker")
        
        const datepickerInputFeild = page.locator('#datePickerMonthYearInput')
        await datepickerInputFeild.click()

        // Select Date
        await page.locator('.react-datepicker__day--001:not(.react-datepicker__day--outside-month)').click()
        await expect(datepickerInputFeild).toHaveValue('09/01/2026')

        // Date and Time
        const dateTimePickerField = page.locator('#dateAndTimePickerInput')
        await dateTimePickerField.click()

        await page.locator('.react-datepicker__day--017').click()
        // await page.getByRole('option', {name: '12:00', exact: true}).click()
        // await expect(dateTimePickerField).toHaveValue('September 17, 2026 12:00 PM')
        await page.getByRole('option', {name: '08:45', exact: true}).click()
        await expect(dateTimePickerField).toHaveValue('September 17, 2026 8:45 AM')      
    })

    test('iFrame', async({ page }) => {
       await page.goto("https://demoqa.com/frames") 

       const frameLocator = page.frameLocator('#frame1')
       let textInsideFrame = await frameLocator.locator('#sampleHeading').allTextContents()

       console.log(textInsideFrame)

       //switch to other frame
       const frameLocator2 = page.frameLocator('#frame2')
       let textInsideFrame2 = await frameLocator2.locator('#sampleHeading').allTextContents()
       await expect(frameLocator2.locator('#sampleHeading')).toHaveText(textInsideFrame2)
    })

    test('Drag & Drop', async({ page }) => {
        await page.goto("https://demoqa.com/droppable")

        await page.locator('#draggable').hover()
        await page.mouse.down()
        await page.getByRole('tabpanel', {name: 'Simple'}).locator('.drop-box').hover()
        await page.mouse.up()
    })

    test('TextBox', async({ page }) => {
        await page.goto("https://demoqa.com/text-box")

        await page.locator('#userName').fill('Test User')
        await page.getByPlaceholder('name@example.com').fill('test@example.com')
        await page.getByPlaceholder('Current Address').fill('Test address, 94539')
        await page.locator('#permanentAddress').fill('test permanent address')
        await page.getByRole('button', {name: 'Submit'}).click()
    })
});

test.describe('Elements Tab', async () => {

    /**
     * Test case for TextBox component in Elements Tab
     */
    test('TextBox', async ({ page }) => {
        await page.goto('https://demoqa.com/text-box');
        await page.getByRole('textbox', {name: 'Full Name'}).fill('Test User');
        await page.getByPlaceholder('name@example.com').fill('test@example.com');
        await page.getByRole('textbox', {name: 'Current Address'}).fill('Test address, 94539');
        await page.locator('#permanentAddress').fill('test permanent address');
        await page.getByRole('button', {name: 'Submit'}).click();

        //assertions
        const outputField = page.locator('#userForm #output');
        await expect(outputField.locator('#name')).toHaveText('Name:Test User');
        await expect(outputField.locator('#email')).toHaveText('Email:test@example.com');
        await expect(outputField.locator('#currentAddress')).toHaveText('Current Address :Test address, 94539');
        await expect(outputField.locator('#permanentAddress')).toHaveText('Permananet Address :test permanent address');
    });

    /**
     * Test case for Checkbox component in Elements Tab
     */
    test('Checkbox', async ({ page }) => {
        await page.goto('https://demoqa.com/checkbox');
        
        await page.getByRole('checkbox').check();
        await expect(page.getByRole('checkbox')).toBeChecked();
    });

    /**
     * Test case for Radio Button component in Elements Tab
     */
    test('Radio Button', async ({ page }) => {
        await page.goto('https://demoqa.com/radio-button');
        await page.getByRole('radio', {name: 'Yes'}).check();
        await expect(page.getByRole('radio', {name: 'Yes'})).toBeChecked();
        await expect(page.locator('.text-success')).toHaveText('Yes');

        await page.getByRole('radio', {name: 'Impressive'}).check();
        await expect(page.locator('.text-success')).toHaveText('Impressive');

        await expect(page.getByRole('radio', {name: 'No'})).toBeDisabled();
    });

    /**
     * Test case for Web Tables component in Elements Tab
     */
    test('Web Tables', async ({ page }) => {
        await page.goto('https://demoqa.com/webtables');

        // Edit row and make some changes
        const firstRow = page.getByRole('row', {name: 'cierra@example.com'})
        await firstRow.locator('#edit-record-1').click();
        await page.getByRole('textbox', {name: 'Age'}).fill('25');
        await page.getByRole('button', {name: 'Submit'}).click();

        //assertions
        const updatedRow = page.getByRole('cell').nth(2);
        await expect(updatedRow).toHaveText('25');
        
        // Add a new row
        await page.getByRole('button', {name: 'Add'}).click();
        await page.getByRole('textbox', {name: 'First Name'}).fill('First User');
        await page.getByRole('textbox', {name: 'Last Name'}).fill('Last User');
        await page.getByPlaceholder('name@example.com').fill('testuser@example.com');
        await page.getByRole('textbox', {name: 'Age'}).fill('39');
        await page.getByRole('textbox', {name: 'Salary'}).fill('50000');
        await page.getByRole('textbox', {name: 'Department'}).fill('IT');
        await page.getByRole('button', {name: 'Submit'}).click();

        //assertions
        const newlyAddedRow = page.getByRole('cell', {name: 'First User'});
        await expect(newlyAddedRow).toHaveText('First User');
        await expect(page.getByRole('cell', {name: 'Last User'})).toHaveText('Last User');

        // Delete newly added row
        const lastRow = page.getByRole('row', {name: 'testuser@example.com'});
        await lastRow.locator('#delete-record-4').click();
        await expect(page.getByRole('row', {name: 'testuser@example.com'})).toBeHidden();
    });

    /**
     * Test case for Buttons component in Elements Tab
     */
    test('Buttons', async ({ page }) => {
        await page.goto('https://demoqa.com/buttons');

        // Click on "Double Click" button
        await page.getByRole('button', {name: 'Double Click Me', exact: true}).dblclick();
        await expect(page.locator('#doubleClickMessage')).toHaveText('You have done a double click');

        // Click on "Right Click" button
        await page.getByRole('button', {name: 'Right Click Me', exact: true}).click({button: 'right'});
        await expect(page.locator('#rightClickMessage')).toHaveText('You have done a right click');

        //Click on "Click Me" button
        await page.getByRole('button', {name: 'Click Me', exact: true}).click();
        await expect(page.locator('#dynamicClickMessage')).toHaveText('You have done a dynamic click');
    });

    /**
     * Test case for Links component in Elements Tab
     */
    test('Links opening new tabs', async ({ page, context }) => {
        await page.goto('https://demoqa.com/links');

        // Click on "Home" link to open a new tab
        const newTabPromise = context.waitForEvent('page');
        await page.getByRole('link', {name: 'Home'}).first().click();
        const newTab = await newTabPromise;
        
        // Assert the new tab opened and has the expected URL
        await expect(newTab).toHaveURL('https://demoqa.com/');

        // close new tab
        await newTab.close();
    
        // back to main page
        await page.bringToFront();
    
        // Click on "Dynamic Link"
        const dynamicLinkPromise = context.waitForEvent('page');
        await page.locator('#dynamicLink').click();
        const dynamicLink = await dynamicLinkPromise;
        
        //Assert the new tab opened and has the expected URL
        await expect(dynamicLink).toHaveURL('https://demoqa.com/');

        // close dynamic link tab
        await dynamicLink.close();
    });

    /**
     * Links sending api calls
     */
    test('Links sending api calls', async ({ page }) => {
        await page.goto('https://demoqa.com/links');

        // Click on "Created" link to trigger API call
        await page.getByRole('link', {name: 'Created'}).click();

        // Assert the API call was made by checking the network request
        const response = await page.waitForResponse('https://demoqa.com/created');
        expect(response.status()).toBe(201);

        //Click on "No Content" link to trigger API call
        await page.getByRole('link', {name: 'No Content'}).click();
        const noContentResponse = await page.waitForResponse('https://demoqa.com/no-content');
        expect(noContentResponse.status()).toBe(204);

        // Click on "Moved" link to trigger API call
        await page.getByRole('link', {name: 'Moved'}).click();
        const movedResponse = await page.waitForResponse('https://demoqa.com/moved');
        expect(movedResponse.status()).toBe(301);

        // Click on "Bad request" link to trigger API call
        await page.getByRole('link', {name: 'Bad request'}).click();
        const badRequestResponse = await page.waitForResponse('https://demoqa.com/bad-request');
        expect(badRequestResponse.status()).toBe(400);

        // Click on "Unauthorized" link to trigger API call
        await page.getByRole('link', {name: 'Unauthorized'}).click();
        const unauthorizedResponse = await page.waitForResponse('https://demoqa.com/unauthorized');
        expect(unauthorizedResponse.status()).toBe(401);

        // Click on "Forbidden" link to trigger API call
        await page.getByRole('link', {name: 'Forbidden'}).click();
        const forbiddenResponse = await page.waitForResponse('https://demoqa.com/forbidden');
        expect(forbiddenResponse.status()).toBe(403);

        // Click on "Not Found" link to trigger API call
        await page.getByRole('link', {name: 'Not Found'}).click();
        const notFoundResponse = await page.waitForResponse('https://demoqa.com/invalid-url');
        expect(notFoundResponse.status()).toBe(404);
    });

    /**
     * Test case for Broken Links
     */
    test('Broken Links', async ({ page }) => {
        await page.goto('https://demoqa.com/broken');

        await page.getByRole('link', {name: 'Click Here for Valid Link'}).click();
        await expect(page).toHaveURL('https://demoqa.com');

        await page.goto('https://demoqa.com/broken');

        await page.getByRole('link', {name: 'Click Here for Broken Link'}).click();
        await expect(page).toHaveURL('http://the-internet.herokuapp.com/status_codes/500');
    });

    /**
     * Test case for Download
     */
    test('Download', async ({ page }) => {
        await page.goto('https://demoqa.com/upload-download');

        const downloadPromise = page.waitForEvent('download');
        await page.getByRole('button', {name: 'Download'}).click();
        const download = await downloadPromise;

        const suggestedFileName = download.suggestedFilename();
        console.log('Suggested file name:', suggestedFileName);
        

        const savePath = path.resolve(__dirname, `../downloads/${suggestedFileName}`);
        await download.saveAs(savePath);
        console.log(`Downloaded file saved as ${suggestedFileName}`);

        expect(fs.existsSync(savePath)).toBeTruthy();
    });


    test('Upload', async ({ page }) => {
        await page.goto('https://demoqa.com/upload-download');

       const filePath = path.resolve(__dirname, '../downloads/sampleFile.jpeg');
    //    await page.getByRole('button', { name: 'Choose File' }).setInputFiles('Codex.dmg');

    });
});