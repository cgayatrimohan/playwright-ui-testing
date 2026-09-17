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

})