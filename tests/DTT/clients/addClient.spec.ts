import { test } from '../../../src/fixtures/fixture';
import { expect } from '@playwright/test';
import { ClientsManagePage } from '../../../src/pages/clients/clientsManage.page';
import { AddClientModal } from '../../../src/pages/clients/addClient.modal';
import { LeftMenuPage } from '../../../src/pages/leftMenu.page';

test.describe('Add Client Modal - Address Finder Verification', () => {
  let clientsPage: ClientsManagePage;
  let addClientModal: AddClientModal;

  test.beforeEach(async ({ leftMenuPage }) => {
    await leftMenuPage.navigateToSubmenu('Clients', 'Manage');

    await clientsPage.clickAddClient();
    await expect(addClientModal.modalContainer).toBeVisible();
  });

  test('Verify Address Finder displays dropdown suggestions when results are found', async () => {
    
  });

  test('Verify Address Finder displays an explicit empty state message when no results are found', async () => {
    // 1. Type an arbitrary query string that cannot match any real address indices
    await addClientModal.addressInput.fill('123 4534');

    // 2. Assert that the active list overlay structure is drawn on screen
    await expect(addClientModal.addressDropdownContainer).toBeVisible();

    // 3. Verify that the unique fallback feedback message node is displayed exactly as intended
    await expect(addClientModal.addressNoResultsMessage).toBeVisible();
    await expect(addClientModal.addressNoResultsMessage).toHaveText('No results found.');

    // 4. Confirm that actual clickable option rows are completely omitted from the layout
    const optionCount = await addClientModal.addressDropdownOptions.count();
    expect(optionCount).toBe(0);
  });
});