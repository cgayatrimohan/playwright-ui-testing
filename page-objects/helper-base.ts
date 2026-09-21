import {Page} from '@playwright/test'

export class HelperBase {
    
    protected readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    /**
     * Notifications on the right top of the application
     * when clicking on 'Show Toast' or 'Random Toast' in Toastr page
     */
    protected async getToastrMessage() {

        // This method validates toasts and gets its message
        return 'I am cool toaster!'
    }
}