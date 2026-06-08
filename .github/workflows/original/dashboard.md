<!-- REGION: Sidebar Navigation -->
<nav role="navigation" aria-label="Main Navigation">
  <a href="/dashboards/" role="link" title="Dashboard" aria-current="page">Dashboard</a>
  <div role="group" title="Tools">
    <a href="/clients/" role="link" title="Clients">Clients</a>
    <a href="/quotes-invoices/" role="link" title="Quotes & Invoices">Quotes & Invoices</a>
    <a href="/expenses/" role="link" title="Expenses">Expenses</a>
    <a href="/schedule/" role="link" title="Schedule">Schedule</a>
    <a href="/ndis-claims/" role="link" title="NDIS Claims">NDIS Claims</a>
    <a href="/inventory/" role="link" title="Inventory">Inventory</a>
    <a href="/ndis-services/" role="link" title="NDIS Services">NDIS Services</a>
  </div>
  <div role="group" title="Settings">
    <a href="/account/" role="link" title="Account">Account</a>
    <a href="/business/" role="link" title="Business">Business</a>
    <a href="/notifications/" role="link" title="Notifications">Notifications</a>
  </div>
  <div role="group" title="Support">
    <a href="/application-tour/" role="link" title="Application Tour">Application Tour</a>
    <a href="/feedback-form/" role="link" title="Feedback form">Feedback form</a>
  </div>
</nav>

<!-- REGION: Main Content - Dashboard -->
<main role="main" title="Dashboard">
  
  <!-- Toolbar Area -->
  <section role="region" title="Toolbar Area">
    <button type="button" title="Date Range Picker">Jun 01, 2026 - Jun 30, 2026</button>
    <button type="button" title="Export Summary">Export Summary</button>
  </section>

  <!-- Metrics Panel -->
  <section role="region" title="Metrics Panel">
    <div role="status" title="Total Payments">
      <span class="summary-title">Total Payments</span>
      <span class="summary-value">$0</span>
      <span class="status-change">+0% from last month</span>
    </div>
    <div role="status" title="Total Quotes/Invoices Issued">
      <span class="summary-title">Total Quotes/Invoices Issued</span>
      <span class="summary-value">+0</span>
      <span class="status-change">+0% from last month</span>
    </div>
    <div role="status" title="Total Clients">
      <span class="summary-title">Total Clients</span>
      <span class="summary-value">No records</span>
    </div>
  </section>

  <!-- Summary Panel: Quotes, Invoices & Expenses -->
  <section role="region" title="Quotes, Invoices & Expenses Overview">
    <h2>Quotes, Invoices & Expenses Overview</h2>
    <dl>
      <dt>Issued Quotes</dt><dd>$0.00</dd>
      <dt>Accepted Quotes</dt><dd>$0.00</dd>
      <dt>Remaining Quotes</dt><dd>$0.00</dd>
      <dt>Invoices Sent</dt><dd>$0.00</dd>
      <dt>Paid Invoices</dt><dd>$0.00</dd>
      <dt>Outstanding Invoices</dt><dd>$0.00</dd>
      <dt>Overdue Invoices</dt><dd>$0.00</dd>
      <dt>Expenses In Flexigrow</dt><dd>$0.00</dd>
    </dl>
  </section>

  <!-- DataGrid/Table: Clients Overview -->
  <section role="region" title="Clients Overview">
    <h2>Clients Overview</h2>
    <table role="grid">
      <thead>
        <tr>
          <th role="columnheader">Client</th>
          <th role="columnheader">Invoiced</th>
          <th role="columnheader">Paid</th>
        </tr>
      </thead>
      <tbody>
        <!-- State: Empty Grid -->
        <tr><td colspan="3" class="status-inactive">No records / Empty</td></tr>
      </tbody>
    </table>
  </section>

  <!-- DataGrid/Table: Projects Overview -->
  <section role="region" title="Projects Overview">
    <h2>Projects Overview</h2>
    <table role="grid">
      <thead>
        <tr>
          <th role="columnheader">Project</th>
          <th role="columnheader">Expense</th>
        </tr>
      </thead>
      <tbody>
        <!-- Sampled Row 1 -->
        <tr data-row-key="3rr">
          <td data-field="Project">3rr</td>
          <td data-field="Expense">$0</td>
        </tr>
      </tbody>
    </table>
  </section>
</main>

export class FlexigrowDashboardPage {
  // Region Containers
  readonly sidebarNav = (page: Page) => page.getByRole('navigation', { name: 'Main Navigation' });
  readonly mainContent = (page: Page) => page.getByRole('main', { name: 'Dashboard' });
  
  // Sidebar - Tools
  readonly linkDashboard = (page: Page) => this.sidebarNav(page).getByRole('link', { name: 'Dashboard' });
  readonly linkClients = (page: Page) => this.sidebarNav(page).getByRole('link', { name: 'Clients' });
  readonly linkQuotesInvoices = (page: Page) => this.sidebarNav(page).getByRole('link', { name: 'Quotes & Invoices' });
  readonly linkExpenses = (page: Page) => this.sidebarNav(page).getByRole('link', { name: 'Expenses' });

  // Toolbar Actions
  readonly btnDatePicker = (page: Page) => this.mainContent(page).getByRole('button', { name: /Jun 01, 2026/i }); // Lưu ý: Text động thay đổi theo thời gian
  readonly btnExportSummary = (page: Page) => this.mainContent(page).getByRole('button', { name: 'Export Summary' });

  // Metrics Widgets
  readonly metricTotalPayments = (page: Page) => this.mainContent(page).getByRole('status', { name: 'Total Payments' });
  readonly metricTotalInvoices = (page: Page) => this.mainContent(page).getByRole('status', { name: 'Total Quotes/Invoices Issued' });

  // Financial Summary Values
  readonly summaryIssuedQuotes = (page: Page) => this.mainContent(page).locator('dt:has-text("Issued Quotes") + dd');
  readonly summaryPaidInvoices = (page: Page) => this.mainContent(page).locator('dt:has-text("Paid Invoices") + dd');

  // Tables
  readonly tableProjects = (page: Page) => this.mainContent(page).getByRole('grid', { name: 'Projects Overview' });
  
  /**
   * Chaining Strategy phục vụ định vị Row dựa trên Primary Key (Project Name)
   */
  getProjectRow(page: Page, projectName: string) {
    return this.tableProjects(page).getByRole('row').filter({ hasText: projectName });
  }
}