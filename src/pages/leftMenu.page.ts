import { Locator, Page, expect } from '@playwright/test';
import { ClientsManagePage } from './clients/clientsManage.page';

export class LeftMenuPage {
  public readonly menuContainer: Locator;
  public readonly navMainNavigation: Locator;

  public readonly dashboardLink: Locator;
  public readonly clientsMenu: Locator;
  public readonly quotesInvoicesMenu: Locator;
  public readonly expensesMenu: Locator;
  public readonly scheduleMenu: Locator;
  public readonly ndisClaimsMenu: Locator;
  public readonly inventoryMenu: Locator;
  public readonly ndisServicesMenu: Locator;
  public readonly staffMenu: Locator;

  public readonly accountLink: Locator;
  public readonly businessMenu: Locator;
  public readonly notificationsLink: Locator;

  public readonly appTourLink: Locator;
  public readonly feedbackFormLink: Locator;
  public readonly toggleSidebarButton: Locator;
  public readonly userProfileRegion: Locator;

  private readonly groupTools: Locator;
  private readonly groupSettings: Locator;
  private readonly groupSupport: Locator;

  constructor(private readonly page: Page) {
    this.menuContainer = this.page.locator('div.flex.h-full.w-full.flex-col.bg-sidebar').first();
    this.navMainNavigation = this.menuContainer.getByRole('navigation', { name: 'Main Navigation' }).first();

    this.groupTools = this.menuContainer.locator('[role="group"][title="Tools"]').first();
    this.groupSettings = this.menuContainer.locator('[role="group"][title="Settings"]').first();
    this.groupSupport = this.menuContainer.locator('[role="group"][title="Support"]').first();

    this.dashboardLink = this.menuContainer.getByRole('link', { name: 'Dashboard', exact: true });

    this.clientsMenu = this.menuContainer.locator('a[title="Clients"], a:has-text("Clients"), button:has-text("Clients")').first();
    this.quotesInvoicesMenu = this.menuContainer.locator('a[title="Quotes & Invoices"], a:has-text("Quotes & Invoices"), button:has-text("Quotes & Invoices")').first();
    this.expensesMenu = this.menuContainer.locator('a[title="Expenses"], a:has-text("Expenses"), button:has-text("Expenses")').first();
    this.scheduleMenu = this.menuContainer.locator('a[title="Schedule"], a:has-text("Schedule"), button:has-text("Schedule")').first();
    this.ndisClaimsMenu = this.menuContainer.locator('a[title="NDIS Claims"], a:has-text("NDIS Claims"), button:has-text("NDIS Claims")').first();
    this.inventoryMenu = this.menuContainer.locator('a[title="Inventory"], a:has-text("Inventory"), button:has-text("Inventory")').first();
    this.ndisServicesMenu = this.menuContainer.locator('a[title="NDIS Services"], a:has-text("NDIS Services"), button:has-text("NDIS Services")').first();
    this.staffMenu = this.menuContainer.locator('a[title="Staff"], a:has-text("Staff"), button:has-text("Staff")').first();

    this.accountLink = this.menuContainer.locator('a[title="Account"], a:has-text("Account")').first();
    this.businessMenu = this.menuContainer.locator('a[title="Business"], a:has-text("Business"), button:has-text("Business")').first();
    this.notificationsLink = this.menuContainer.locator('a[title="Notifications"], a:has-text("Notifications")').first();

    this.appTourLink = this.menuContainer.locator('a[title="Application Tour"], a:has-text("Application Tour")').first();
    this.feedbackFormLink = this.menuContainer.locator('a[title="Feedback form"], a:has-text("Feedback form")').first();

    this.toggleSidebarButton = this.menuContainer.getByRole('button', { name: 'Toggle Sidebar' }).first();
    this.userProfileRegion = this.menuContainer.getByRole('region', { name: 'User Profile Summary' }).first();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboards?\/?/i, { timeout: 30000 });
    await this.waitForMenuReady();
  }

  private async waitForMenuReady(): Promise<void> {
    const readinessAnchors = [
      this.dashboardLink,
      this.quotesInvoicesMenu,
      this.accountLink,
      this.businessMenu,
      this.menuContainer,
    ];

    for (const anchor of readinessAnchors) {
      try {
        await anchor.waitFor({ state: 'visible', timeout: 15000 });
        return;
      } catch {
        // Keep trying next anchor to avoid single-point locator failures.
      }
    }

    throw new Error(`Left menu readiness check failed. url=${this.page.url()}`);
  }

  async navigateToDashboard(): Promise<void> {
    await this.dashboardLink.click();
  }

  async clickToolsMenu(menuName: 'Clients' | 'Quotes & Invoices' | 'Expenses' | 'Schedule' | 'NDIS Claims' | 'Inventory' | 'NDIS Services' | 'Staff'): Promise<void> {
    switch (menuName) {
      case 'Clients': await this.clientsMenu.click(); break;
      case 'Quotes & Invoices': await this.quotesInvoicesMenu.click(); break;
      case 'Expenses': await this.expensesMenu.click(); break;
      case 'Schedule': await this.scheduleMenu.click(); break;
      case 'NDIS Claims': await this.ndisClaimsMenu.click(); break;
      case 'Inventory': await this.inventoryMenu.click(); break;
      case 'NDIS Services': await this.ndisServicesMenu.click(); break;
      case 'Staff': await this.staffMenu.click(); break;
    }
  }

  async navigateToSubmenu(parentMenuName: string, submenuName: string): Promise<void> {
    if (parentMenuName === 'Clients' && submenuName === 'Manage') {
      const clientsTrigger = this.clientsMenu;
      const expanded = await clientsTrigger.getAttribute('aria-expanded');
      if (expanded !== null && expanded !== 'true') {
        await clientsTrigger.click();
      }
      const manageMenuItem = this.menuContainer.getByRole('menuitem', { name: 'Manage', exact: true });
      if (await manageMenuItem.count()) {
        await manageMenuItem.first().click();
      } else {
        await this.menuContainer.locator('a, button').filter({ hasText: /^Manage$/ }).first().click();
      }
      return;
    }

    const parentGroup = this.resolveGroupByName(parentMenuName);
    await parentGroup.locator('a, button').filter({ hasText: new RegExp(`^${this.escapeRegex(submenuName)}$`) }).first().click();
  }

  async navigateToClientManage(): Promise<void> {
    await this.navigateToSubmenu('Clients', 'Manage');
    const clientManage = new ClientsManagePage(this.page);
    await clientManage.expectLoaded();
  }

  async navigateToAccount(): Promise<void> {
    await this.accountLink.click();
  }

  async clickBusinessSettings(): Promise<void> {
    await this.businessMenu.click();
  }

  async navigateToNotifications(): Promise<void> {
    await this.notificationsLink.click();
  }

  async openApplicationTour(): Promise<void> {
    await this.appTourLink.click();
  }

  async openFeedbackForm(): Promise<void> {
    await this.feedbackFormLink.click();
  }

  async toggleSidebar(): Promise<void> {
    await this.toggleSidebarButton.click();
  }

  private resolveGroupByName(groupName: string): Locator {
    switch (groupName) {
      case 'Tools': return this.groupTools;
      case 'Settings': return this.groupSettings;
      case 'Support': return this.groupSupport;
      default: return this.menuContainer;
    }
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}