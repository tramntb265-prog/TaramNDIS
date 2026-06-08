# Trusted Business DOM Context & Playwright Locator Architecture - Left Menu Module

---

## 1. Trusted Business DOM Context (Cleaned & Annotated)

Dưới đây là cấu trúc DOM tinh gọn của phân khu `leftMenu` (được bọc trong phân khu Sidebar `group peer hidden md:block`) sau khi áp dụng triệt để các bộ quy tắc loại bỏ nhiễu layout, tối ưu hóa khả năng đọc hiểu dựa trên ngữ nghĩa nghiệp vụ và tiêu chuẩn Accessibility.

```html
<!-- REGION: Left Sidebar Navigation -->
<nav role="navigation" aria-label="Main Navigation">
  
  <!-- App Branding & Identity -->
  <div role="banner" title="Flexigrow Brand">
    <span title="flexgrow-logo">Flexigrow</span>
  </div>

  <!-- Core Dashboard Route -->
  <a href="/dashboards/" role="link" title="Dashboard" aria-current="page" class="active">
    Dashboard
  </a>

  <!-- Functional Category: Tools -->
  <div role="group" title="Tools">
    <!-- Collapsible Feature Node -->
    <div role="none">
      <a href="/clients/" role="link" title="Clients" aria-expanded="true">Clients</a>
      <!-- Dropdown Submenu Context -->
      <div role="menu" aria-label="Clients Submenu">
        <a href="/clients/" role="menuitem" title="Manage">Manage</a>
      </div>
    </div>
    
    <a href="/quotes-invoices/" role="link" title="Quotes & Invoices">Quotes & Invoices</a>
    <a href="/expenses/" role="link" title="Expenses">Expenses</a>
    <a href="/schedule/" role="link" title="Schedule">Schedule</a>
    <a href="/ndis-claims/" role="link" title="NDIS Claims">NDIS Claims</a>
    <a href="/inventory/" role="link" title="Inventory">Inventory</a>
    <a href="/ndis-services/" role="link" title="NDIS Services">NDIS Services</a>
  </div>

  <!-- Functional Category: Settings -->
  <div role="group" title="Settings">
    <a href="/account/" role="link" title="Account">Account</a>
    <a href="/business/" role="link" title="Business">Business</a>
    <a href="/notifications/" role="link" title="Notifications">Notifications</a>
  </div>

  <!-- Functional Category: Support -->
  <div role="group" title="Support">
    <a href="/application-tour/" role="link" title="Application Tour">Application Tour</a>
    <a href="/feedback-form/" role="link" title="Feedback form">Feedback form</a>
  </div>

  <!-- Active Session Profile Summary -->
  <div role="region" title="User Profile Summary">
    <span class="status-active">testy132_02 chengcheng</span>
    <span>testy132_02@yopmail.com</span>
  </div>

  <!-- Component Control Layout -->
  <button type="button" aria-label="Toggle Sidebar" title="Toggle Sidebar">Toggle Sidebar</button>
</nav>

import { Page, Locator, expect } from '@playwright/test';

export class LeftMenuComponent {
  private readonly page: Page;
  
  // Boundary Root Component Selector
  readonly sidebarContainer: Locator;

  // Static Target Links
  readonly linkDashboard: Locator;
  readonly btnToggleSidebar: Locator;
  readonly regionUserProfile: Locator;

  // Structural Business Feature Groups
  private readonly groupTools: Locator;
  private readonly groupSettings: Locator;
  private readonly groupSupport: Locator;

  constructor(page: Page) {
    this.page = page;

    // Định vị bằng cấu trúc class đặc trưng của khối sidebar MD (bảo vệ lỗi tránh single point of failure)
    this.sidebarContainer = page.locator('.group\\.peer').filter({ has: page.getByRole('navigation', { name: 'Main Navigation' }) });

    // Khởi tạo các Core Element thông qua Chaining
    this.linkDashboard = this.sidebarContainer.getByRole('link', { name: 'Dashboard', exact: true });
    this.btnToggleSidebar = this.sidebarContainer.getByRole('button', { name: 'Toggle Sidebar' });
    this.regionUserProfile = this.sidebarContainer.getByRole('region', { name: 'User Profile Summary' });

    // Gom cụm theo nhóm logic nghiệp vụ
    this.groupTools = this.sidebarContainer.locator('div[role="group"]').filter({ hasText: 'Tools' });
    this.groupSettings = this.sidebarContainer.locator('div[role="group"]').filter({ hasText: 'Settings' });
    this.groupSupport = this.sidebarContainer.locator('div[role="group"]').filter({ hasText: 'Support' });
  }

  /**
   * Page Readiness Policy: Kiểm tra trạng thái sẵn sàng đa điểm của Sidebar trước khi thao tác
   */
  async verifyPageReadiness(): Promise<void> {
    // 1. Kiểm tra URL phân hệ hiện hành
    await expect(this.page).toHaveURL(/\/dashboards/);
    
    // 2. Kiểm tra tính sẵn sàng của các mốc neo chính (Multi-Anchor Ready Check)
    await expect(this.linkDashboard).toBeVisible();
    await expect(this.sidebarContainer.getByRole('link', { name: 'Quotes & Invoices' })).toBeVisible();
    await expect(this.regionUserProfile).toBeVisible();
  }

  /**
   * Chaining Strategy: Chuyển đổi tính năng linh hoạt trong nhóm Tools
   * @param name Tên danh mục hiển thị (e.g., 'Expenses', 'Schedule', 'Inventory')
   */
  async selectToolItem(name: string): Promise<void> {
    await this.groupTools.getByRole('link', { name: name, exact: true }).click();
  }

  /**
   * Action Flow: Thao tác mở rộng Tree Node / Accordion nâng cao (Phân hệ Clients)
   */
  async navigateToClientsManage(): Promise<void> {
    const clientsTrigger = this.groupTools.getByRole('link', { name: 'Clients' });
    
    // Bảo toàn trạng thái: Chỉ click nếu menu con đang đóng
    const isExpanded = await clientsTrigger.getAttribute('aria-expanded');
    if (isExpanded !== 'true') {
      await clientsTrigger.click();
    }
    
    // Tiếp cận chính xác phần tử đích trong Submenu dropdown
    await this.groupTools.getByRole('menuitem', { name: 'Manage' }).click();
  }

  /**
   * Chaining Strategy: Điều hướng nhanh sang các màn hình thiết lập hệ thống
   */
  async selectSettingItem(name: string): Promise<void> {
    await this.groupSettings.getByRole('link', { name: name, exact: true }).click();
  }
}

3. Page Object Hints & Business Architecture
Khối Thành Phần Tái Sử Dụng (Identify Reusable Components)
Application Left Side Panel (LeftMenuComponent): Khối điều hướng toàn cục đa nhiệm, hoạt động độc lập với luồng hiển thị của dữ liệu main ở trung tâm.

Tree/Accordion Node Component: Thiết kế điều hướng đa tầng lồng ghép (như cụm liên kết Clients -> Manage), cần được kiểm soát chặt chẽ về mặt trạng thái cơ học (aria-expanded).

Luồng Nghiệp Vụ Suy Luận (Business Flow Inference)
Pattern: SettingsManagement & Application Routing Control.

Hành động cốt lõi quyết định tính đúng đắn (Critical Actions):

Thao tác chuyển đổi phân hệ (Context Switching) an toàn không gây lỗi mất dữ liệu (Dirty Form Checking).

Thu gọn diện tích hiển thị giao diện làm việc thông qua hành động Toggle Sidebar.

4. Testability Assessment & Recommendations
Các Rủi Ro Tiềm Ẩn (Risks Identified)
[!WARNING]
1. Rủi ro Phụ thuộc Ngôn ngữ hiển thị (Localization Dependency): Do thiếu các ID Automation chuyên dụng (data-testid), mã kiểm thử đang định vị dựa trên chuỗi văn bản cứng ('Tools', 'Settings'). Khi hệ thống cập nhật gói dịch thuật đa ngôn ngữ (i18n), toàn bộ kịch bản test sẽ bị hỏng đồng loạt.

2. Trạng thái Đóng/Mở Động Gây Flaky (Accordion Transition Lag): Khi click vào menu Clients để kích hoạt danh mục con Manage, hiệu ứng animation CSS chuyển động có thể tạo ra độ trễ ngắn khiến Playwright click trượt vào phần tử Manage nếu không tích hợp cơ chế đợi trạng thái aria-expanded="true".

Khuyến Nghị Cải Tiến UI Từ Kiến Trúc Sư Automation
Yêu cầu đội phát triển bổ sung mã định danh kiểm thử độc lập:
<nav data-testid="sidebar-navigation">
      <a data-testid="nav-dashboard" href="/dashboards/">Dashboard</a>
      <a data-testid="nav-group-tools-clients" href="/clients/">Clients</a>
      <a data-testid="nav-group-tools-clients-manage" href="/clients/">Manage</a>
      <button data-testid="sidebar-toggle-trigger">Toggle Sidebar</button>
    </nav>
    ```
2.  **Chuẩn hóa đồng bộ Accessibility cho Menu đa tầng:** Cần đảm bảo các phân hệ sở hữu tính năng mở rộng tương tự (như *Quotes & Invoices*, *Expenses*, *Schedule*) đều được gán chặt chẽ cặp thuộc tính kiểm soát trạng thái `aria-expanded` giống như phân hệ `Clients` hiện hành để Automation dễ dàng bắt được sự thay đổi trạng thái của UI một cách tường minh.