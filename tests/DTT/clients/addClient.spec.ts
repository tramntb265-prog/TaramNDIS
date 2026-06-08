import { test } from '../../../src/fixtures/fixture';
import { expect } from '@playwright/test';
import { AddClientModal } from '../../../src/pages/clients/addClient.modal';

test.describe('Add Client Modal - Address Finder Verification', () => {
    let addClientModal: AddClientModal;

    test.beforeEach(async ({ leftMenuPage, page }) => {
        addClientModal = new AddClientModal(page);
        await addClientModal.openFromClientManage(leftMenuPage);
    });

    /*Address finder */

    test('@AddClientModal @ACM001 should open Address Finder popover when select Address input', async () => {
        await addClientModal.openAddressFinder();
        await addClientModal.expectAddressFinderOpened();
    });

    test('@AddClientModal @ACM002 should return live updates correctly on-keydown', async () => {
        const partialAddress = '15 a';
        let currentSearch = '';

        await addClientModal.openAddressFinder();

        for (const singleKey of partialAddress.split('')) {
            currentSearch += singleKey;
            await addClientModal.typeAddressSearchKeyword(currentSearch);
            await addClientModal.expectSearchAPISuccess(currentSearch);
            await addClientModal.expectUIResultContainTrackerKeyword(currentSearch);
        }
    });

    test('@AddClientModal @ACM003 should displays an explicit empty state message when no results are found', async () => {
        await addClientModal.openAddressFinder();
        await addClientModal.typeAddressSearchKeyword('zzzzzzzzzzzz');
        await addClientModal.expectAddressNoResults();
    });
});