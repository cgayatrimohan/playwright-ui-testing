import {Page} from '@playwright/test'

export class FormLayoutsPage {

    private readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    /**
     * Method to submit using the grid form with the following parameters
     * 
     * @param email - valid test user email
     * @param password - valid test user password
     * @param optionText - select [Option 1 or Option 2]
     */
    async submitUsingTheGridForm(email: string, password: string, optionText: string) {
        const usingTheGridForm = this.page.locator('nb-card', {hasText: 'Using the Grid'})
        await usingTheGridForm.getByRole('textbox', {name: "Email"}).fill(email)
        await usingTheGridForm.getByRole('textbox', {name: "Password"}).fill(password)
        await usingTheGridForm.getByLabel(optionText).check({force: true})
        await usingTheGridForm.getByRole('button', {name: "Sign in"}).click()

    }

    /**
     * Method to submit inline form with the following parameters
     * 
     * @param fullName - valid test user full name (First and Last Name)
     * @param email  - valid test user email
     * @param rememberMeCheckbox - Pass 'true' to select Remember me checkbox
     */
    async submitInlineForm(fullName: string, email: string, rememberMeCheckbox: boolean) {
        const inlineForm = this.page.locator('nb-card', {hasText: 'Inline form'})
        await inlineForm.getByRole('textbox', {name: 'Jane Doe'}).fill(fullName)
        await inlineForm.getByRole('textbox', {name: 'Email'}).fill(email)
        
        if(rememberMeCheckbox == true) {
            await inlineForm.getByRole('checkbox').check({force: true})
        }

        await inlineForm.getByRole('button', {name: "Submit"}).click()
    }
}