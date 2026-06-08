<!-- REGION: Sidebar Navigation -->
<nav role="navigation" aria-label="Sidebar">
  <a href="/dashboard/">Dashboard</a>
  <details open>
    <summary>Clients</summary>
    <a href="/ndis/client/list/" role="link" aria-current="page">Manage</a>
  </details>
  <details><summary>Quotes & Invoices</summary></details>
  <details><summary>Expenses</summary></details>
  <details><summary>Schedule</summary></details>
  <details><summary>NDIS Claims</summary></details>
  <details><summary>Inventory</summary></details>
  <details><summary>NDIS Services</summary></details>
</nav>

<!-- REGION: Main Content Area -->
<main>
  <!-- Toolbar & Search -->
  <section role="toolbar" title="Client Actions">
    <button type="button" name="Add Client">Add Client</button>
    <input type="search" placeholder="Search Clients ..." aria-label="Search Clients" />
  </section>

  <!-- Data Grid / Table -->
  <section role="region" aria-label="Clients Data Grid">
    <table role="grid">
      <thead>
        <tr>
          <th role="columnheader">Name</th>
          <th role="columnheader">Email</th>
          <th role="columnheader">Primary Language</th>
          <th role="columnheader">NDIS Number</th>
          <th role="columnheader">Mobile</th>
          <th role="columnheader">Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- Sample Row 1 (Dùng Name làm Primary Key cho Scope) -->
        <tr role="row" data-row-key="Noi noi lastname">
          <td role="gridcell">Noi noi lastname</td>
          <td role="gridcell">testy132_noinoi^@yopmail.com</td>
          <td role="gridcell">english</td>
          <td role="gridcell">maximum12345</td>
          <td role="gridcell">0412312322</td>
          <td role="gridcell">
            <button type="button" aria-label="Open menu" aria-haspopup="menu">Open menu</button>
          </td>
        </tr>
        <!-- Sample Row 2 -->
        <tr role="row" data-row-key="tikala udpate lastname">
          <td role="gridcell">tikala udpate lastname</td>
          <td role="gridcell">tikalaclient@yopmail.com</td>
          <td role="gridcell">english</td>
          <td role="gridcell">maximax55555</td>
          <td role="gridcell">0423423433</td>
          <td role="gridcell">
            <button type="button" aria-label="Open menu" aria-haspopup="menu">Open menu</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>

  <!-- Pagination Area -->
  <footer role="contentinfo" title="Pagination">
    <label>Rows per page</label>
    <select title="Rows per page"><option value="10" selected>10</option></select>
    <span>Page 1 of 1</span>
    <button type="button" aria-label="Go to first page" disabled></button>
    <button type="button" aria-label="Go to previous page" disabled></button>
    <button type="button" aria-label="Go to next page" disabled></button>
    <button type="button" aria-label="Go to last page" disabled></button>
  </footer>
</main>

export const ClientManagementLocators = {
  //---------------------------------------------------------------------------------
  // PAGE READINESS ANCHORS (Điều kiện đảm bảo trang đã load xong hoàn toàn)
  //---------------------------------------------------------------------------------
  pageHeading: () => page.getByRole('heading', { name: 'Clients' }),
  activeSidebarLink: () => page.getByRole('link', { name: 'Manage' }),

  //---------------------------------------------------------------------------------
  // TOOLBAR & SEARCH ACTIONS
  //---------------------------------------------------------------------------------
  addButton: () => page.getByRole('button', { name: 'Add Client' }),
  searchInput: () => page.getByPlaceholder('Search Clients ...'),

  //---------------------------------------------------------------------------------
  // DATA GRID & ROW-BASED SCOPED LOCATORS (Chaining Strategy chống Flaky)
  //---------------------------------------------------------------------------------
  tableGrid: () => page.getByRole('grid', { name: 'Clients Data Grid' }),
  
  /**
   * Định vị một dòng cụ thể dựa vào tên Client (Primary Key của nghiệp vụ)
   * @param clientName Tên hiển thị tại cột Name
   */
  clientRow: (clientName: string) => 
    page.getByRole('row').filter({ has: page.getByRole('gridcell', { name: clientName }) }),

  /**
   * Click vào nút 'Open menu' của một khách hàng cụ thể dựa vào tên của họ
   */
  rowActionButton: (clientName: string) => 
    ClientManagementLocators.clientRow(clientName).getByRole('button', { name: 'Open menu' }),

  //---------------------------------------------------------------------------------
  // PAGINATION
  //---------------------------------------------------------------------------------
  rowsPerPageDropdown: () => page.getByRole('combobox', { name: 'Rows per page' }),
  paginationText: () => page.getByText('Page 1 of 1'),
  firstPageButton: () => page.getByRole('button', { name: 'Go to first page' }),
  nextPageButton: () => page.getByRole('button', { name: 'Go to next page' }),
};