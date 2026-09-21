import {Page} from '@playwright/test'

export class NavigationPage {

    private readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async formLayoutsPage() {
        await this.selectgroupMenuItems('Forms')
        await this.page.getByText('Form Layouts').click()
    }

    async datepickerPage() {
        await this.selectgroupMenuItems('Forms')
        await this.page.getByText('Datepicker').click()
    }

    async dialogPage() {
        await this.selectgroupMenuItems('Modal & Overlays')
        await this.page.getByText('Dialog').click()
    }

    async windowPage() {
        await this.selectgroupMenuItems('Modal & Overlays')
        await this.page.getByText('Window').click()
    }

    async toastrPage() {
        await this.selectgroupMenuItems('Modal & Overlays')
        await this.page.getByText('Toastr').click()
    }

    async tooltipPage() {
        await this.selectgroupMenuItems('Modal & Overlays')
        await this.page.getByText('Tooltip').click()
    }

    async calendarPage() {
        await this.selectgroupMenuItems('Extra Components')
        await this.page.getByText('Calendar').click()
    }

    async dragAndDropPage() {
        await this.selectgroupMenuItems('Extra Components')
        await this.page.getByText('Drag & Drop').click()
    }

    async smartTablesPage() {
        await this.selectgroupMenuItems('Tables & Data')
        await this.page.getByText('Smart Table').click()  
    }

    private async selectgroupMenuItems(groupMenuTitle: string) {
        const groupMenuItem = this.page.getByTitle(groupMenuTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if(expandedState == "false") {
            await groupMenuItem.click()
        }
    }
}