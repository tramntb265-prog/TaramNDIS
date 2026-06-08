import { expect, Locator, Page } from '@playwright/test';

export class DashboardPage {
  public readonly dashboardMain: Locator;
  public readonly toolbarSection: Locator;
  public readonly metricsPanelSection: Locator;
  public readonly quotesInvoicesExpensesOverviewSection: Locator;
  public readonly clientsOverviewSection: Locator;
  public readonly projectsOverviewSection: Locator;

  public readonly dashboardLink: Locator;
  public readonly clientsLink: Locator;
  public readonly quotesInvoicesLink: Locator;
  public readonly expensesLink: Locator;
  public readonly scheduleLink: Locator;
  public readonly ndisClaimsLink: Locator;
  public readonly inventoryLink: Locator;
  public readonly ndisServicesLink: Locator;
  public readonly accountLink: Locator;
  public readonly businessLink: Locator;
  public readonly notificationsLink: Locator;
  public readonly applicationTourLink: Locator;
  public readonly feedbackFormLink: Locator;

  public readonly dateRangePickerButton: Locator;
  public readonly exportSummaryButton: Locator;

  public readonly totalPaymentsCard: Locator;
  public readonly totalQuotesInvoicesIssuedCard: Locator;
  public readonly totalClientsCard: Locator;

  public readonly clientsOverviewGrid: Locator;
  public readonly projectsOverviewGrid: Locator;

  constructor(private readonly page: Page) {
    this.page = page;

    // Some builds expose main without an accessible name. Keep this locator resilient.
    this.dashboardMain = this.page.locator('main, [role="main"]').first();
    this.toolbarSection = this.page.getByRole('region', { name: 'Toolbar Area' });
    this.metricsPanelSection = this.page.getByRole('region', { name: 'Metrics Panel' });
    this.quotesInvoicesExpensesOverviewSection = this.page.getByRole('region', {
      name: 'Quotes, Invoices & Expenses Overview',
    });
    this.clientsOverviewSection = this.page.getByRole('region', { name: 'Clients Overview' });
    this.projectsOverviewSection = this.page.getByRole('region', { name: 'Projects Overview' });

    this.dashboardLink = this.page.getByRole('link', { name: 'Dashboard' });
    this.clientsLink = this.page.getByRole('link', { name: 'Clients' });
    this.quotesInvoicesLink = this.page.getByRole('link', { name: 'Quotes & Invoices' });
    this.expensesLink = this.page.getByRole('link', { name: 'Expenses' });
    this.scheduleLink = this.page.getByRole('link', { name: 'Schedule' });
    this.ndisClaimsLink = this.page.getByRole('link', { name: 'NDIS Claims' });
    this.inventoryLink = this.page.getByRole('link', { name: 'Inventory' });
    this.ndisServicesLink = this.page.getByRole('link', { name: 'NDIS Services' });
    this.accountLink = this.page.getByRole('link', { name: 'Account' });
    this.businessLink = this.page.getByRole('link', { name: 'Business' });
    this.notificationsLink = this.page.getByRole('link', { name: 'Notifications' });
    this.applicationTourLink = this.page.getByRole('link', { name: 'Application Tour' });
    this.feedbackFormLink = this.page.getByRole('link', { name: 'Feedback form' });

    this.dateRangePickerButton = this.page.locator('button[title="Date Range Picker"]').first();
    this.exportSummaryButton = this.page.getByRole('button', { name: 'Export Summary' }).first();

    this.totalPaymentsCard = this.page.getByRole('status', { name: 'Total Payments' }).first();
    this.totalQuotesInvoicesIssuedCard = this.page.getByRole('status', {
      name: 'Total Quotes/Invoices Issued',
    }).first();
    this.totalClientsCard = this.page.getByRole('status', { name: 'Total Clients' }).first();

    this.clientsOverviewGrid = this.clientsOverviewSection.getByRole('grid');
    this.projectsOverviewGrid = this.projectsOverviewSection.getByRole('grid');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboards?\/?/i, { timeout: 30000 });
    await this.waitForDashboardReady();
  }

  private async waitForDashboardReady(): Promise<void> {
    const readyCandidates = [
      this.dateRangePickerButton,
      this.exportSummaryButton,
      this.dashboardLink,
      this.clientsLink,
    ];

    for (const candidate of readyCandidates) {
      try {
        await candidate.waitFor({ state: 'visible', timeout: 15000 });
        return;
      } catch {
        // Try next candidate so dashboard checks remain resilient across UI variants.
      }
    }

    const currentUrl = this.page.url();
    const pageTitle = await this.page.title().catch(() => 'unknown-title');
    throw new Error(`Dashboard readiness check failed. url=${currentUrl}, title=${pageTitle}`);
  }
  async openDateRangePicker(): Promise<void> {
    await this.dateRangePickerButton.click();
  }

  async clickExportSummary(): Promise<void> {
    await this.exportSummaryButton.click();
  }

  async navigateToClients(): Promise<void> {
    await this.clientsLink.click();
  }

  async navigateToQuotesInvoices(): Promise<void> {
    await this.quotesInvoicesLink.click();
  }

  async navigateToExpenses(): Promise<void> {
    await this.expensesLink.click();
  }

  async navigateToSchedule(): Promise<void> {
    await this.scheduleLink.click();
  }

  async navigateToNdisClaims(): Promise<void> {
    await this.ndisClaimsLink.click();
  }

  async navigateToInventory(): Promise<void> {
    await this.inventoryLink.click();
  }

  async navigateToNdisServices(): Promise<void> {
    await this.ndisServicesLink.click();
  }

  async navigateToAccount(): Promise<void> {
    await this.accountLink.click();
  }

  async navigateToBusiness(): Promise<void> {
    await this.businessLink.click();
  }

  async navigateToNotifications(): Promise<void> {
    await this.notificationsLink.click();
  }

  async openApplicationTour(): Promise<void> {
    await this.applicationTourLink.click();
  }

  async openFeedbackForm(): Promise<void> {
    await this.feedbackFormLink.click();
  }

  async getTotalPaymentsValue(): Promise<string> {
    return (await this.totalPaymentsCard.locator('.summary-value').textContent())?.trim() ?? '';
  }

  async getTotalQuotesInvoicesIssuedValue(): Promise<string> {
    return (await this.totalQuotesInvoicesIssuedCard.locator('.summary-value').textContent())?.trim() ?? '';
  }

  async getTotalClientsValue(): Promise<string> {
    return (await this.totalClientsCard.locator('.summary-value').textContent())?.trim() ?? '';
  }

  async getIssuedQuotesValue(): Promise<string> {
    return (await this.quotesInvoicesExpensesOverviewSection.locator('dt:has-text("Issued Quotes") + dd').textContent())?.trim() ?? '';
  }

  async getPaidInvoicesValue(): Promise<string> {
    return (await this.quotesInvoicesExpensesOverviewSection.locator('dt:has-text("Paid Invoices") + dd').textContent())?.trim() ?? '';
  }

  async isClientsOverviewEmpty(): Promise<boolean> {
    return await this.clientsOverviewGrid.getByText('No records / Empty').isVisible();
  }

  private getProjectRowByKey(projectKey: string): Locator {
    return this.projectsOverviewGrid.locator(`tbody tr[data-row-key="${projectKey}"]`);
  }

  async getProjectExpenseByKey(projectKey: string): Promise<string> {
    const row = this.getProjectRowByKey(projectKey);
    return (await row.locator('td[data-field="Expense"]').textContent())?.trim() ?? '';
  }
}
