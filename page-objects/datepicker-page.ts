import { Page, expect } from '@playwright/test'
import { step } from '../helpers/test-step-decorator'
import { HelperBase } from './helper-base'

export class DatepickerPage extends HelperBase{

    constructor(page: Page) {
        super(page)
    }

    @step
    async selectCommonDatepickerDateFromToday(daysFromToday: number) {
        const calendarInputField = this.page.getByPlaceholder('Form Picker')
        await calendarInputField.click()

        const expectedDate = await this.selectDateInCalendar(daysFromToday)
        await expect(calendarInputField).toHaveValue(expectedDate)
    }

    @step
    async selectDatepickerWithRangeFromToday(daysFromTodayStart: number, daysFromTodayEnd: number) {
        const calendarInputField = this.page.getByPlaceholder('Range Picker')
        await calendarInputField.click()
        const expectedStartDate = await this.selectDateInCalendar(daysFromTodayStart)
        const expectedEndDate = await this.selectDateInCalendar(daysFromTodayEnd)

        const expectedRangeDate = `${expectedStartDate} - ${expectedEndDate}`

        await expect(calendarInputField).toHaveValue(expectedRangeDate)
    }

    private async selectDateInCalendar(daysFromToday: number) {
        const date = new Date()
        date.setDate(date.getDate() + daysFromToday)

        const expectedDay = date.getDate().toString()
        const expectedMonth = date.toLocaleDateString('En-US', { month: 'short' })
        const expectedMonthLong = date.toLocaleDateString('En-US', { month: 'long' })
        const expectedYear = date.getFullYear().toString()
        const expectedDate = `${expectedMonth} ${expectedDay}, ${expectedYear}`

        // To check what is the current month year once you click on datepicker
        let currentMonthAndYear = await this.page.locator('nb-calendar-view-mode').getByRole('button').textContent()
        const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`

        while (!currentMonthAndYear?.includes(expectedMonthAndYear)) {
            // if it doesnt match then we will click on next arrow
            await this.page.locator('.next-month').click()
            currentMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }
        await this.page.locator('.day-cell:not(.bounding-month)').getByText(expectedDay, { exact: true }).click()
        
        return expectedDate
    }
}