import { Locator, Page, expect } from '@playwright/test';
import { ClientsManagePage } from './clientsManage.page';
import { LeftMenuPage } from '../leftMenu.page';

export interface AddClientProfileData {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    language?: string;
    ndisNumber?: string;
}

export class AddClientModal {
    public readonly modalDialog: Locator;

    public readonly firstNameInput: Locator;
    public readonly lastNameInput: Locator;
    public readonly emailInput: Locator;
    public readonly mobileInput: Locator;
    public readonly primaryLanguageInput: Locator;
    public readonly ndisNumberInput: Locator;

    public readonly addressSearchButton: Locator;
    public readonly addressFinderPopover: Locator;
    public readonly addressFinderSearchInput: Locator;
    public readonly addressFinderOptions: Locator;
    public readonly addressFinderNoResultsMessage: Locator;

    public readonly saveButton: Locator;
    public readonly cancelButton: Locator;
    public readonly closeButton: Locator;

    // Backward-compatible aliases for existing tests.
    public readonly modalContainer: Locator;
    public readonly addressInput: Locator;
    public readonly addressPopover: Locator;
    public readonly addressPopoverInput: Locator;
    public readonly addressPopoverResultZone: Locator;
    public readonly addressSuggestions: Locator;
    public readonly addressNoResultsMessage: Locator;

    constructor(private readonly page: Page) {
        this.modalDialog = this.page.getByRole('dialog', { name: /add client/i });

        this.firstNameInput = this.getFieldTextbox(/^First Name\*/i);
        this.lastNameInput = this.getFieldTextbox(/^Last Name\*/i);
        this.emailInput = this.getFieldTextbox(/^Email\*/i);
        this.mobileInput = this.getFieldTextbox(/^Mobile\*/i);
        this.primaryLanguageInput = this.getFieldTextbox(/^Primary language/i);
        this.ndisNumberInput = this.getFieldTextbox(/^NDIS number/i);

        this.addressSearchButton = this.modalDialog.getByRole('button', { name: /search/i });
        this.addressFinderPopover = this.page.locator('[role="dialog"], div.absolute.z-50').filter({ has: this.page.getByPlaceholder('Search...') });
        this.addressFinderSearchInput = this.addressFinderPopover.getByPlaceholder('Search...').first();
        this.addressFinderOptions = this.addressFinderPopover.locator('[role="option"], div.cursor-pointer');
        this.addressFinderNoResultsMessage = this.addressFinderPopover.getByText('No results found.', { exact: true });

        this.saveButton = this.modalDialog.getByRole('button', { name: 'Save', exact: true });
        this.cancelButton = this.modalDialog.getByRole('button', { name: 'Cancel', exact: true });
        this.closeButton = this.modalDialog.getByRole('button', { name: 'Close', exact: true });

        this.modalContainer = this.modalDialog;
        this.addressInput = this.addressSearchButton;
        this.addressPopover = this.addressFinderPopover;
        this.addressPopoverInput = this.addressFinderSearchInput;
        this.addressPopoverResultZone = this.addressFinderPopover;
        this.addressSuggestions = this.addressFinderOptions;
        this.addressNoResultsMessage = this.addressFinderNoResultsMessage;
    }

    private getFieldTextbox(labelPattern: RegExp): Locator {
        return this.modalDialog
            .locator('div', { hasText: labelPattern })
            .getByRole('textbox')
            .first();
    }

    public async openFromClientManage(leftMenuPage: LeftMenuPage): Promise<void> {
        await leftMenuPage.navigateToSubmenu('Clients', 'Manage');
        const clientsManagePage = new ClientsManagePage(this.page);
        await clientsManagePage.clickAddClient();
        await this.expectLoaded();
    }

    public async expectLoaded(): Promise<void> {
        await expect(this.modalDialog).toBeVisible({ timeout: 15000 });
        await expect(this.firstNameInput).toBeVisible({ timeout: 15000 });
        await expect(this.lastNameInput).toBeVisible({ timeout: 15000 });
        await expect(this.emailInput).toBeVisible({ timeout: 15000 });
        await expect(this.mobileInput).toBeVisible({ timeout: 15000 });
    }

    public async fillClientProfile(data: AddClientProfileData): Promise<void> {
        await this.firstNameInput.fill(data.firstName);
        await this.lastNameInput.fill(data.lastName);
        await this.emailInput.fill(data.email);
        await this.mobileInput.fill(data.mobile);

        if (data.language) {
            await this.primaryLanguageInput.fill(data.language);
        }
        if (data.ndisNumber) {
            await this.ndisNumberInput.fill(data.ndisNumber);
        }
    }

    public async openAddressFinder(): Promise<void> {
        await this.addressSearchButton.click();
        await expect(this.addressFinderSearchInput).toBeVisible({ timeout: 10000 });
    }

    public async typeAddressSearchKeyword(keyword: string): Promise<void> {
        await this.addressFinderSearchInput.fill(keyword);
    }

    public async expectAddressFinderOpened(): Promise<void> {
        await expect(this.addressFinderPopover).toBeVisible({ timeout: 10000 });
        await expect(this.addressFinderSearchInput).toBeVisible({ timeout: 10000 });
    }

    public async expectAddressNoResults(): Promise<void> {
        await expect(this.addressFinderNoResultsMessage).toBeVisible({ timeout: 10000 });
        await expect(this.addressFinderNoResultsMessage).toHaveText('No results found.');
        await expect(this.addressFinderOptions).toHaveCount(0);
    }

    public async selectFirstAddressSuggestion(partialAddress: string): Promise<void> {
        await this.openAddressFinder();
        await this.typeAddressSearchKeyword(partialAddress);
        await this.addressFinderOptions.first().waitFor({ state: 'visible' });
        await this.addressFinderOptions.first().click();
        await expect(this.addressFinderPopover).toBeHidden();
    }

    public async searchAndSelectAddress(partialAddress: string): Promise<string> {
        await this.openAddressFinder();
        await this.typeAddressSearchKeyword(partialAddress);
        await this.addressFinderOptions.first().waitFor({ state: 'visible' });

        const count = await this.addressFinderOptions.count();
        if (count === 0) {
            throw new Error(`No address suggestions found for query: "${partialAddress}"`);
        }

        const randomIndex = Math.floor(Math.random() * count);
        const targetOption = this.addressFinderOptions.nth(randomIndex);
        const selectedAddressText = (await targetOption.textContent()) ?? '';
        await targetOption.click();
        await expect(this.addressFinderPopover).toBeHidden();

        return selectedAddressText;
    }

    public async clickSave(): Promise<void> {
        await this.saveButton.click();
    }

    public async clickCancel(): Promise<void> {
        await this.cancelButton.click();
    }

    public async clickClose(): Promise<void> {
        await this.closeButton.click();
    }

    public async expectSearchAPISuccess(trackedSearchKeyword: string): Promise<void> {
        await this.page.waitForResponse((response) =>
            response.url().includes('/api/proxy/api/address/') &&
            response.url().includes(`keywords=${encodeURIComponent(trackedSearchKeyword)}`) &&
            response.status() === 200,
        );
    }

    public async expectUIResultContainTrackerKeyword(trackedSearchKeyword: string): Promise<void> {
        await expect(this.addressFinderPopover).toBeVisible();

        const allTexts = await this.addressFinderPopover.allInnerTexts();
        expect(allTexts.length).toBeGreaterThan(0);
        for (const itemText of allTexts) {
            expect(itemText.toLowerCase()).toContain(trackedSearchKeyword.toLowerCase());
        }
    }
}