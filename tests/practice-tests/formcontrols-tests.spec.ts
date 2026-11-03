import {test, expect} from '@playwright/test';

test.describe('Form Controls Tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.playwrightautomation.com/practice.html');
    });

    test('Text Controls Test', async ({page}) => {

        await page.getByTestId('pp-side-nav-text-inputs').click();

        const nameInput = page.getByTestId('input-name');
        await nameInput.fill('John Doe');
        await expect(nameInput).toHaveValue('John Doe');

        const emailInput = page.getByTestId('input-email')
        await emailInput.fill('john@example.com');
        await expect(emailInput).toHaveValue('john@example.com');

        const addressInput = page.getByTestId('input-address');
        await addressInput.fill('123 Main St');
        await expect(addressInput).toHaveValue('123 Main St');

        const submitButton = page.getByTestId('btn-submit-text-inputs');
        await expect(submitButton).toBeEnabled();
        await submitButton.click();

        const resetButton = page.getByTestId('btn-reset-text-inputs');
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    });

    test('Radio Buttons Test', async({ page }) => {

        await page.getByTestId('pp-side-nav-radios').click();

        const maleOption = page.getByTestId('radio-male');
        await maleOption.check();
        await expect(maleOption).toBeChecked();
    });

    test('Checkbox Test', async({ page }) => {

        await page.getByTestId('pp-side-nav-checkboxes').click();

        const tuesdayCheckbox = page.getByTestId('checkbox-tuesday');
        await tuesdayCheckbox.click({force: true});
        await expect(tuesdayCheckbox).toBeChecked();
    });

    test('Toggle Switch Test', async({ page }) => {
        await page.getByTestId('pp-side-nav-toggles').click();

        await page.getByTestId('toggle-notifications').click({force: true});
        await expect(page.getByTestId('toggle-notifications')).toBeChecked();

        //unselect the email notifications toggle
        await page.getByTestId('toggle-email-alerts').click({force: true});
        await expect(page.getByTestId('toggle-email-alerts')).not.toBeChecked();
    });

    test('Multi selects', async({ page }) => {
        await page.getByTestId('pp-side-nav-multiselects').click();

        const multiSelect = page.getByTestId('multiselect-colors');
        await multiSelect.selectOption(['nike', 'puma']);
        await expect(multiSelect).toHaveValues(['nike', 'puma']);
    });

    test('Tooltip Test', async({ page }) => {
        await page.getByTestId('pp-side-nav-tooltip').click();

        const toolTip = page.getByTestId('tooltip-trigger');
        await toolTip.hover();
        await expect(page.getByTestId('tooltip-bubble')).toBeVisible();

       await expect(page.getByTestId('tooltip-bubble')).toHaveText('Standard delivery takes 3–5 working days.')
    });

    test('Show or hide elements test', async({ page }) => {
        await page.getByTestId('pp-side-nav-showhide').click();

        const hideButton = page.getByTestId('btn-hide-element');
        const showButton = page.getByTestId('btn-show-element');
        const targetInput = page.getByTestId('showhide-textbox');
        const targetState = page.getByTestId('showhide-state');

        // Initial state - target input should be visible
        await expect(targetInput).toBeVisible();
        await expect(targetState).toContainText('visible');

        // Click hide element
        await hideButton.click();
        await expect(targetInput).not.toBeVisible();
        await expect(targetState).toContainText('hidden');

        // Click show element
        await showButton.click();
        await expect(targetInput).toBeVisible();
        await expect(targetState).toContainText('visible');
    });
});