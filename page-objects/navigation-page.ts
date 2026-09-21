import { Page } from '@playwright/test'
import { step } from '../helpers/test-step-decorator'

export class NavigationPage {

    private readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    @step
    async formLayoutsPage() {
        await this.selectgroupMenuItems('Forms')
        await this.page.getByText('Form Layouts').click()
    }

    @step
    async datepickerPage() {
        await this.selectgroupMenuItems('Forms')
        await this.page.getByText('Datepicker').click()
    }

    @step
    async dialogPage() {
        await this.selectgroupMenuItems('Modal & Overlays')
        await this.page.getByText('Dialog').click()
    }

    @step
    async windowPage() {
        await this.selectgroupMenuItems('Modal & Overlays')
        await this.page.getByText('Window').click()
    }

    @step
    async toastrPage() {
        await this.selectgroupMenuItems('Modal & Overlays')
        await this.page.getByText('Toastr').click()
    }

    @step
    async tooltipPage() {
        await this.selectgroupMenuItems('Modal & Overlays')
        await this.page.getByText('Tooltip').click()
    }

    @step
    async calendarPage() {
        await this.selectgroupMenuItems('Extra Components')
        await this.page.getByText('Calendar').click()
    }

    @step
    async dragAndDropPage() {
        await this.selectgroupMenuItems('Extra Components')
        await this.page.getByText('Drag & Drop').click()
    }

    @step
    async smartTablesPage() {
        await this.selectgroupMenuItems('Tables & Data')
        await this.page.getByText('Smart Table').click()
    }

    private async selectgroupMenuItems(groupMenuTitle: string) {
        const groupMenuItem = this.page.getByTitle(groupMenuTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if (expandedState == "false") {
            await groupMenuItem.click()
        }
    }
}