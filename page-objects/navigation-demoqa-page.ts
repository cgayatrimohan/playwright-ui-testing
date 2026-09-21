import {Locator,Page} from '@playwright/test'
import { step } from '../helpers/test-step-decorator'

export class NavigationDemoQAPage {

    private readonly page: Page


    constructor(page: Page) {
        this.page = page
    }

    @step
    async textBoxPage() {
        await this.selectedgroupMenuItems('Elements')
        await this.page.getByText('Text Box').click()

    }

    private async selectedgroupMenuItems(groupMenuTitle: string) {
        const groupMenuItem = this.page.locator('.text', {hasText: groupMenuTitle})
        const expandedStatus = groupMenuItem.locator('.element-list accordion-collapse collapse')

        if((await expandedStatus.allInnerTexts()).includes('show')) {
            await groupMenuItem.click()
        }
    }
}