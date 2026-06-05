import { Locator, Page, expect } from '@playwright/test';

export class AddClientModal {
  readonly page: Page;
  
  // --- Main Modal Container ---
  readonly modalContainer: Locator;

  // --- Form Input Fields ---
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly mobileInput: Locator;
  readonly primaryLanguageInput: Locator;
  readonly ndisNumberInput: Locator;
  
  // --- Address Finder Elements ---
  readonly addressInput: Locator;
    readonly addressPopover: Locator;
    readonly addressPopoverInput: Locator;
    readonly addressPopoverResultZone: Locator;
    readonly addressSuggestions: Locator; // Alias for the popover container
    readonly addressNoResultsMessage: Locator;



  // --- Action Buttons ---
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Locates the modal overlay based on its unique "Add Client" heading text
    this.modalContainer = page.locator('div', { has: page.locator('h3:has-text("Add Client")') }).last();

    // --- Mandatory Fields ---
    this.firstNameInput = this.modalContainer.locator('div', { hasText: /^First Name\*/ }).getByRole('textbox');
    this.lastNameInput = this.modalContainer.locator('div', { hasText: /^Last Name\*/ }).getByRole('textbox');
    this.emailInput = this.modalContainer.locator('div', { hasText: /^Email\*/ }).getByRole('textbox');
    this.mobileInput = this.modalContainer.locator('div', { hasText: /^Mobile\*/ }).getByRole('textbox');
    
    // --- Optional Fields ---
    this.primaryLanguageInput = this.modalContainer.locator('div', { hasText: /^Primary language/ }).getByRole('textbox');
    this.ndisNumberInput = this.modalContainer.locator('div', { hasText: /^NDIS number/ }).getByRole('textbox');
    
    // --- Address Finder Locators ---
    this.addressInput = this.modalContainer.getByPlaceholder('Search...').first();
    // Locates the f loating autocomplete dropdown list overlay
    this.addressPopover = page.locator('div.absolute.z-50, [role="dialog"]').filter({ has: page.getByPlaceholder('Search...') });
    this.addressPopoverInput = this.addressPopover.getByPlaceholder('Search...').first();
    this.addressPopoverResultZone = this.addressPopover.locator('div').filter({ hasNot: page.getByPlaceholder('Search...') }).locator('div.flex.flex-col, div.overflow-y-auto').first();
    this.addressSuggestions = this.addressPopoverResultZone.locator('div.cursor-pointer, [role="option"]');
    this.addressNoResultsMessage = this.addressPopoverResultZone.getByText('No results found.');

    // --- Action Controls ---
    this.saveButton = this.modalContainer.getByRole('button', { name: 'Save' });
    this.cancelButton = this.modalContainer.getByRole('button', { name: 'Cancel' });
    this.closeButton = this.modalContainer.locator('button:has(svg)').first();
  }

  // --- Action Methods ---

  /**
   * Fills out the profile text fields
   */
  async fillClientProfile(client: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    language?: string;
    ndisNumber?: string;
  }) {
    await this.firstNameInput.fill(client.firstName);
    await this.lastNameInput.fill(client.lastName);
    await this.emailInput.fill(client.email);
    await this.mobileInput.fill(client.mobile);
    
    if (client.language) await this.primaryLanguageInput.fill(client.language);
    if (client.ndisNumber) await this.ndisNumberInput.fill(client.ndisNumber);
  }

  /**
   * Types an address into the lookup field and selects a specific matching suggestion
   * @param partialAddress Part of the address text to trigger autocomplete
   */
async searchAndSelectAddress(partialAddress: string): Promise<string> {
    // 1. Click the main address form field first to trigger/open the popover
    await this.addressInput.click();
    
    // 2. Ensure the popover container is fully rendered on screen
    await this.addressPopover.waitFor({ state: 'visible' });
    
    // 3. Type the query into the gray input field inside the popover
    await this.addressPopoverInput.fill(partialAddress);
    
    // 4. Wait for the result suggestions to be populated and visible
    await this.addressSuggestions.first().waitFor({ state: 'visible' });
    
    // 5. Select and click the target address option from the active result zone
    const count = await this.addressSuggestions.count();
    if (count === 0) {
      throw new Error(`No address suggestions found for query: "${partialAddress}"`);
    }
    const randomIndex = Math.floor(Math.random() * count);
    const targetOption = this.addressSuggestions.nth(randomIndex);
    const selectedAddressText = (await targetOption.textContent()) || '';
    await this.addressSuggestions.nth(randomIndex).click();
    
    // 6. Optional: Assert the popover automatically closes after selection
    await expect(this.addressPopover).toBeHidden();

    return selectedAddressText;
  }


/**
   * Triggers the address popover, types a query into the popover search input,
   * and selects the very first address option returned.
   * @param partialAddress Part of the address text to type into the popover search input
   */
  async selectFirstAddressSuggestion(partialAddress: string) {
    // 1. Click the main address form field first to open the popover
    await this.addressInput.click();
    
    // 2. Ensure the popover container is fully visible on screen
    await this.addressPopover.waitFor({ state: 'visible' });
    
    // 3. Type the query into the grey input field inside the popover 
    await this.addressPopoverInput.fill(partialAddress);
    
    // 4. Wait for the address result options to be populated and visible
    await this.addressSuggestions.first().waitFor({ state: 'visible' });
    
    // 5. Select and click the absolute first available address option row
    await this.addressSuggestions.first().click();
    
    // 6. Assert the popover automatically closes after selection
    await expect(this.addressPopover).toBeHidden();
  }

  /**
   * Clicks the Save button to submit the form
   */
  async clickSave() {
    await this.saveButton.click();
  }

  /**
   * Clicks the Cancel button to discard entries
   */
  async clickCancel() {
    await this.cancelButton.click();
  }

  /**
   * Clicks the 'X' button at the top-right corner to close the modal
   */
  async clickClose() {
    await this.closeButton.click();
  }
}