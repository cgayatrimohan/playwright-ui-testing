/**
 * Challenge 1: The Robust Page Object Model (POM)
   Scenario: You need to automate a multi-step checkout funnel. The page relies on heavy hydration, meaning buttons become visible but aren't immediately clickable due to attached React/Vue event listeners.
   
   Task: Write a robust TypeScript Class utilizing Playwright's modern locator API.

• Implement strict TypeScript types for your components.
• Ensure you use locators over elementHandle.
• Handle the hydration flakiness without using hardcoded waitForTimeout.
 */

import {expect, type Locator, type Page} from '@playwright/test';

export interface CheckoutItem {
    readonly id : string;
    readonly quantity: number;
}

export class CheckoutItemPage {
    private readonly page: Page;
    private readonly cartItems: Locator;
    private readonly checkoutButton: Locator;
    private readonly successBanner: Locator;

    constructor(page : Page) {
        this.page = page;
        this.cartItems = page.getByRole('listitem', { name: 'Cart Item' });
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
        this.successBanner = page.locator('#success-banner');
    }

    /**
     * Verify if a specific cart item is in the cart with teh correct quantity.
     * @param item  
     */
    async verifyCartItems(item: CheckoutItem): Promise<void> {
        const targetItem = this.cartItems.filter({hasText: item.id});
        await expect(targetItem).toBeVisible();

        const quantityInput = targetItem.locator('input[type="number"]');
        await expect(quantityInput).toHaveValue(item.quantity.toString());
    }

    /**
     * Proceed to the checkout process and verify the success banner is displayed.
     */
    async proceedToCheckout(): Promise<void> {
        await expect(this.checkoutButton).toBeEnabled();
        await expect(this.checkoutButton).toBeVisible();
        await this.checkoutButton.click();

        await expect(this.successBanner).toBeVisible();
    }
    
}

