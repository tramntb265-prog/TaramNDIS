import { Locator, Page, expect } from '@playwright/test';
import { AsyncLocalStorage } from 'node:async_hooks';

export class DashboardPage {
  readonly page: Page;

  readonly pageTitle: Locator;
  readonly dateRangePickerButton: Locator;
  readonly exportSummaryButton: Locator;

  readonly totalPaymentsCard: Locator;
  readonly totalQuotesInvoicesCard: Locator;
  readonly totalClientsCard: Locator;

  readonly quotesInvoicesExpensesSection: Locator;
  readonly issuedQuotesValue: Locator;
  readonly acceptedQuotesValue: Locator;
  readonly remainingQuotesValue: Locator;
  readonly invoicesSentValue: Locator;
  readonly paidInvoicesValue: Locator;
  readonly outstandingInvoicesValue: Locator;
  readonly overdueInvoicesValue: Locator;
  readonly expensesValue: Locator;

  readonly clientsOverviewTable: Locator;
  readonly projectsOverviewTable: Locator;
  readonly noRecordsMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.getByRole('heading', { name: 'Dashboard', exact: true });
    this.dateRangePickerButton = page.locator('button').filter({ hasText: /Jun 01, 2026/ }); // Hoặc regex linh hoạt hơn: /^[A-Z][a-z]{2} \d{2}, \d{4}/
    this.exportSummaryButton = page.getByRole('button', { name: 'Export Summary' });

    this.totalPaymentsCard = page.locator('div', { has: page.locator('text=Total Payments') });
    this.totalQuotesInvoicesCard = page.locator('div', { has: page.locator('text=Total Quotes/Invoices Issued') });
    this.totalClientsCard = page.locator('div', { has: page.locator('text=Total Clients') });

    this.quotesInvoicesExpensesSection = page.locator('div', { has: page.locator('text=Quotes, Invoices & Expenses') }).first();
    this.issuedQuotesValue = this.quotesInvoicesExpensesSection.locator('div', { hasText: 'Issued Quotes' }).locator('span, p, div').last();
    this.acceptedQuotesValue = this.quotesInvoicesExpensesSection.locator('div', { hasText: 'Accepted Quotes' }).locator('span, p, div').last();
    this.remainingQuotesValue = this.quotesInvoicesExpensesSection.locator('div', { hasText: 'Remaining Quotes' }).locator('span, p, div').last();
    this.invoicesSentValue = this.quotesInvoicesExpensesSection.locator('div', { hasText: 'Invoices Sent' }).locator('span, p, div').last();
    this.paidInvoicesValue = this.quotesInvoicesExpensesSection.locator('div', { hasText: 'Paid Invoices' }).locator('span, p, div').last();
    this.outstandingInvoicesValue = this.quotesInvoicesExpensesSection.locator('div', { hasText: 'Outstanding Invoices' }).locator('span, p, div').last();
    this.overdueInvoicesValue = this.quotesInvoicesExpensesSection.locator('div', { hasText: 'Overdue Invoices' }).locator('span, p, div').last();
    this.expensesValue = this.quotesInvoicesExpensesSection.locator('div', { hasText: 'Expenses In Flexigrow' }).locator('span, p, div').last();

    this.clientsOverviewTable = page.locator('div', { has: page.locator('text=Clients').locator('text=Overview') }).first();
    this.projectsOverviewTable = page.locator('div', { has: page.locator('text=Projects').locator('text=Overview') }).first();
    this.noRecordsMessage = page.locator('text=No records');
  }

  async expectLoaded() {
    await this.pageTitle.waitFor({ state: 'visible', timeout: 15000 });
    await expect(this.dateRangePickerButton).toBeVisible();
    await expect(this.exportSummaryButton).toBeEnabled();
  }

  async openDateRangePicker() {
    await this.dateRangePickerButton.click();
  }

  async clickExportSummary() {
    await this.exportSummaryButton.click();
  }

  async getCardValue(card: 'payments' | 'quotes' | 'clients'): Promise<string | null> {
    let targetCard: Locator;
    switch (card) {
      case 'payments': targetCard = this.totalPaymentsCard; break;
      case 'quotes': targetCard = this.totalQuotesInvoicesCard; break;
      case 'clients': targetCard = this.totalClientsCard; break;
    }
    return targetCard.locator('text=$').first().textContent() || targetCard.locator('text=+').first().textContent();
  }

  async getOverviewValue(type: 'Issued Quotes' | 'Paid Invoices' | 'Expenses') {
    return this.quotesInvoicesExpensesSection.locator('div', { hasText: type }).locator('span, p, div').last().textContent();
  }
}