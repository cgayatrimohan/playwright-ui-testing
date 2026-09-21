import { test, expect } from '@playwright/test'
import { table } from 'console'

test.beforeEach(async ({ page }) => {
    await page.goto("https://playground.bondaracademy.com/")
})

test.describe('IOT Dashboard', async() => {
    test('Sliders - Temperature', async ({ page }) => {
        // example 1: By setting the attribute values
        const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')

        // to set the value of the attributes, we to execute javascript inside of the webpage
        await tempGauge.evaluate( element => {
            element.setAttribute('cx', '227.4867') //partial value is good enough
            element.setAttribute('cy', '227.4867') //partial value is good enough
        })
        await tempGauge.click()

        // example 2: using mouse movement [Harder approach]
        const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
        await tempBox.scrollIntoViewIfNeeded()

        const box = await tempBox.boundingBox()
        const x = box?.x + box?.width / 2
        const y = box?.y + box?.width / 2

        await page.mouse.move(x,y)
        await page.mouse.down()
        await page.mouse.move(x+100, y)
        await page.mouse.move(x+100, y+100)
        await page.mouse.up()

        await expect(tempBox).toContainText('30')
    })
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

    test('Date picker within current month', async({ page }) => {
       await page.getByText('Datepicker').click()
       
       // Example: Common Datepicker
       const calendarInputField = page.getByPlaceholder('Form Picker')
       await calendarInputField.click()

       await page.locator('.day-cell:not(.bounding-month)').getByText('15').click()
    // await page.locator('.day-cell:not(.bounding-month)').getByText('2', {exact: true}).click() --> if using single digit use exact
       await expect(calendarInputField).toHaveValue('Sep 15, 2026') 
       

       const date = new Date()
       date.setDate(date.getDate() + 5) //--> within the same month


       const expectedDay = date.getDate().toString()
       const expectedMonth = date.toLocaleDateString('En-US', {month: 'short'})
       const expectedMonthLong = date.toLocaleDateString('En-US', {month: 'long'})
       const expectedYear = date.getFullYear().toString()
       const expectedDate = `${expectedMonth} ${expectedDay}, ${expectedYear}`


       await calendarInputField.click()
       await page.locator('.day-cell:not(.bounding-month)').getByText(expectedDay, {exact: true}).click()
       await expect(calendarInputField).toHaveValue(expectedDate)
    })

    test('Date picker future month', async({ page }) => {
        await page.getByText('Datepicker').click()
        const calendarInputField = page.getByPlaceholder('Form Picker')
        await calendarInputField.click()

        //Dynamically pick date
        const date = new Date()
        date.setDate(date.getDate() + 100)

        const expectedDay = date.getDate().toString()
        const expectedMonth = date.toLocaleDateString('En-US', {month: 'short'})
        const expectedMonthLong = date.toLocaleDateString('En-US', {month: 'long'})
        const expectedYear = date.getFullYear().toString()
        const expectedDate = `${expectedMonth} ${expectedDay}, ${expectedYear}`

        // To check what is the current month year once you click on datepicker
        await calendarInputField.click() 
        let currentMonthAndYear = await page.locator('nb-calendar-view-mode').getByRole('button').textContent()
        const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`

        while(!currentMonthAndYear?.includes(expectedMonthAndYear)) {
            // if it doesnt match then we will click on next arrow
            await page.locator('.next-month').click()
            currentMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
        }

        await calendarInputField.click()
        await page.locator('.day-cell:not(.bounding-month)').getByText(expectedDay, {exact: true}).click()
        await expect(calendarInputField).toHaveValue(expectedDate)
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

    test('iFrames', async({ page }) => {
        await page.getByText('Dialog').click()

        const frameLocator = page.frameLocator('[data-cy="esc-close-iframe"]') //entry point into the frame
        await frameLocator.getByRole('button', {name: 'Open Dialog with esc close'}).click()

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

    test('Web table', async({ page }) => {

        //1. how to select row by any visible text 
        const tableRowByEmail = page.getByRole('row', {name: 'twitter@outlook.com'})
        await tableRowByEmail.locator('.nb-edit').click()
        await tableRowByEmail.getByPlaceholder('Age').fill('35')
        await tableRowByEmail.locator('.nb-checkmark').click()

        await expect(tableRowByEmail.locator('td').last()).toHaveText('35')


        //2. Get row by a specific column value
        const firstColField = page.getByRole('cell').nth(1) //second cell within the row
        const tableRowById = page.getByRole('row').filter({has: firstColField.getByText('10')})
        await tableRowById.locator('.nb-edit').click()
        await page.locator('tbody').getByPlaceholder('E-mail').fill('test@example.com')
        await page.locator('tbody').locator('.nb-checkmark').click()
        await expect(tableRowById.locator('td').nth(5)).toHaveText('test@example.com')

        //3. List of all values from a column by looping through the table rows
        //  [usecase: test the filter value on a column here, let's filter on age]
        
        const ages = ["20", "30", "40", "200"]

        for(let age of ages) {
            await page.getByPlaceholder('Age').fill(age)

            if(age == "200") {
                await expect(page.locator('tbody')).toContainText("No data found")
            } else {
                //since the table has a small delay till it shows all filtered values, 
                // first let's verify if the first row, age column shows 20
                await expect(page.locator('tbody tr').first().locator('td').last()).toHaveText(age)
                
                const allTableRows = await page.locator('tbody tr').all()
                
                for(let row of allTableRows) {
                    await expect(row.locator('td').last()).toHaveText(age)
                }
            }
        }

    })
})


test.describe('Extra Components', async() => {
    test('Drag and Drop', async({ page }) => {
        await page.getByText('Extra Components').click()
        await page.getByText('Drag & Drop').click()

        // example 1
        await page.getByText('Get groceries').dragTo(page.locator('#drop-list'))

        //example 2
        await page.getByText('Clean my room').hover()
        await page.mouse.down()
        await page.locator('#drop-list').hover()
        await page.mouse.up()
    })
})