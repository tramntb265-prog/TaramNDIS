import { Locator, Page } from '@playwright/test';

export class ClientsManagePage {
  readonly page: Page;

  readonly breadcrumbClients: Locator;
  readonly breadcrumbManage: Locator;
  readonly addClientButton: Locator;

  readonly searchInput: Locator;
  readonly viewButton: Locator;

  readonly clientsTable: Locator;
  readonly tableHeaders: Locator;
  readonly tableRows: Locator;

  readonly rowsPerPageDropdown: Locator;
  readonly paginationInfo: Locator;
  readonly firstPageButton: Locator;
  readonly previousPageButton: Locator;
  readonly nextPageButton: Locator;
  readonly lastPageButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.breadcrumbClients = page.locator('span, div').getByText('Clients', { exact: true });
    this.breadcrumbManage = page.locator('span, div').getByText('Manage', { exact: true });
    this.addClientButton = page.getByRole('button', { name: 'Add Client' });

    this.searchInput = page.getByPlaceholder('Search Clients ...');
    this.viewButton = page.getByRole('button', { name: 'View' });

    this.clientsTable = page.locator('table, [role="table"]').first();
    this.tableHeaders = this.clientsTable.locator('th');
    this.tableRows = this.clientsTable.locator('tbody tr, [role="row"]').filter({ hasNotText: 'Name' });

    this.rowsPerPageDropdown = page.locator('div', { hasText: 'Rows per page' }).locator('button, select').last();
    this.paginationInfo = page.locator('span, div, p').filter({ hasText: /^Page \d+ of \d+$/ });
    //this.paginationInfo = page.getByText(/Page \d+ of \d+/);

    this.firstPageButton = page.locator('button').filter({ has: page.locator('svg') }).nth(0); // Nút «
    this.previousPageButton = page.locator('button').filter({ has: page.locator('svg') }).nth(1); // Nút ‹
    this.nextPageButton = page.locator('button').filter({ has: page.locator('svg') }).nth(2); // Nút ›
    this.lastPageButton = page.locator('button').filter({ has: page.locator('svg') }).nth(3); // Nút »
  }

  async expectLoaded(){
    this.breadcrumbClients.isVisible({timeout: 15000});
    this.searchInput.isVisible({timeout: 15000});
    this.addClientButton.isVisible({timeout: 15000});
    this.clientsTable.isVisible({timeout: 15000});
    this.paginationInfo.isVisible({timeout: 15000});
    this.firstPageButton.isVisible({timeout: 15000});
  }

  async searchClient(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.page.keyboard.press('Enter'); 
  }

  async clickAddClient() {
    await this.addClientButton.click();
  }

  getClientRowByEmail(email: string): Locator {
    return this.tableRows.filter({ hasText: email });
  }

  async openActionMenuByEmail(email: string) {
    const row = this.getClientRowByEmail(email);
    await row.locator('button').last().click();
  }

  async changeRowsPerPage(value: '10' | '20' | '50') {
    await this.rowsPerPageDropdown.click();
    await this.page.getByRole('option', { name: value }).click();
  }
}